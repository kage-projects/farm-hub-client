import { VStack, HStack, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '../button/Button';

export interface HarvestEvent {
  id: string;
  projectName: string;
  species: string;
  estimatedDate: Date;
  quantity: number; // kg
  confidence: 'high' | 'medium' | 'low';
}

export interface HarvestCalendarProps {
  events: HarvestEvent[];
  onEventClick?: (event: HarvestEvent) => void;
}

/**
 * Harvest Calendar Component
 * - Monthly calendar view
 * - Highlight harvest dates
 * - Click event untuk detail
 */
export function HarvestCalendar({ events, onEventClick }: HarvestCalendarProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const todayBg = useColorModeValue('brand.100', 'brand.800');
  const harvestBg = useColorModeValue('green.100', 'green.800');

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): HarvestEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.estimatedDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack justify="space-between">
          <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
            Kalender Panen
          </Text>
          <HStack gap={2}>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              leftIcon={<FiChevronLeft />}
            >
              Sebelumnya
            </Button>
            <Text fontSize="sm" fontWeight="medium" color={textPrimary} minW="150px" textAlign="center">
              {monthNames[month]} {year}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              rightIcon={<FiChevronRight />}
            >
              Selanjutnya
            </Button>
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={2}>
          {/* Week day headers */}
          <SimpleGrid columns={7} gap={1}>
            {weekDays.map((day) => (
              <Box
                key={day}
                p={2}
                textAlign="center"
                fontSize="xs"
                fontWeight="semibold"
                color={textSecondary}
              >
                {day}
              </Box>
            ))}
          </SimpleGrid>

          {/* Calendar days */}
          <SimpleGrid columns={7} gap={1}>
            {calendarDays.map((date, idx) => {
              if (!date) {
                return <Box key={`empty-${idx}`} p={2} />;
              }

              const dayEvents = getEventsForDate(date);
              const isTodayDate = isToday(date);

              return (
                <Box
                  key={date.toISOString()}
                  p={2}
                  minH="60px"
                  borderRadius="md"
                  border="1px solid"
                  borderColor={isTodayDate ? 'brand.400' : borderColor}
                  bg={
                    isTodayDate
                      ? todayBg
                      : dayEvents.length > 0
                      ? harvestBg
                      : 'transparent'
                  }
                  cursor={dayEvents.length > 0 ? 'pointer' : 'default'}
                  onClick={() => dayEvents.length > 0 && onEventClick?.(dayEvents[0])}
                  _hover={
                    dayEvents.length > 0
                      ? {
                          bg: useColorModeValue('green.200', 'green.700'),
                          transform: 'scale(1.02)',
                        }
                      : {}
                  }
                  transition="all 0.2s"
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isTodayDate ? 'bold' : 'normal'}
                    color={isTodayDate ? 'brand.700' : textPrimary}
                    mb={1}
                  >
                    {date.getDate()}
                  </Text>
                  {dayEvents.length > 0 && (
                    <VStack align="start" gap={0.5}>
                      {dayEvents.slice(0, 2).map((event) => (
                        <Box
                          key={event.id}
                          w="full"
                          p={0.5}
                          borderRadius="sm"
                          bg={useColorModeValue('green.600', 'green.400')}
                        >
                          <Text fontSize="xs" color="white" fontWeight="semibold" isTruncated>
                            {event.species}
                          </Text>
                        </Box>
                      ))}
                      {dayEvents.length > 2 && (
                        <Text fontSize="xs" color={textSecondary}>
                          +{dayEvents.length - 2}
                        </Text>
                      )}
                    </VStack>
                  )}
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Legend */}
          <HStack gap={4} mt={2} flexWrap="wrap" fontSize="xs">
            <HStack gap={2}>
              <Box w={4} h={4} borderRadius="sm" bg={todayBg} border="1px solid" borderColor="brand.400" />
              <Text color={textSecondary}>Hari ini</Text>
            </HStack>
            <HStack gap={2}>
              <Box w={4} h={4} borderRadius="sm" bg={harvestBg} />
              <Text color={textSecondary}>Jadwal panen</Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

