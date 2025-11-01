import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { ETPCalculator } from '../components/harvest/ETPCalculator';
import { HarvestCalendar, type HarvestEvent } from '../components/harvest/HarvestCalendar';
import { DemandMatcher } from '../components/harvest/DemandMatcher';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useState } from 'react';
import type { ETPResult } from '../utils/harvest/etpCalculator';
import { FiArrowLeft, FiCalendar, FiTarget } from 'react-icons/fi';

/**
 * Harvest Planner Page
 * - ETP Calculator
 * - Harvest Calendar
 * - Demand Matching
 */
export function HarvestPlannerPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [etpResult, setEtpResult] = useState<ETPResult | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('lele');
  const [estimatedQuantity, setEstimatedQuantity] = useState<number>(500); // kg

  // Mock harvest events - in real app, from API/state
  const [harvestEvents] = useState<HarvestEvent[]>([
    {
      id: 'h1',
      projectName: 'Proyek Lele - Padang',
      species: 'lele',
      estimatedDate: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000), // 10 weeks
      quantity: 500,
      confidence: 'high',
    },
    {
      id: 'h2',
      projectName: 'Proyek Nila - Bukittinggi',
      species: 'nila',
      estimatedDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks
      quantity: 300,
      confidence: 'medium',
    },
  ]);

  const handleETPCalculate = (result: ETPResult) => {
    setEtpResult(result);
    // Auto-update quantity based on typical yield (simplified)
    setEstimatedQuantity(500); // Default, can be calculated from pond size
  };

  const handleEventClick = (event: HarvestEvent) => {
    console.log('Harvest event clicked:', event);
    // Navigate to project detail or show modal
  };

  const handleSelectDemand = (demandId: string) => {
    console.log('Demand selected:', demandId);
    // Navigate to contract creation or show modal
    // navigate(`/contract/create?demand=${demandId}&harvest=${etpResult?.estimatedDate}`);
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Harvest Planner', href: '/harvest' },
        ]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="7xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack gap={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              leftIcon={<FiArrowLeft />}
            >
              Kembali
            </Button>
            <VStack align="start" gap={1} flex={1}>
              <HStack gap={2}>
                <FiCalendar size={24} color={useColorModeValue('#25521a', '#8fb887')} />
                <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                  Harvest Planner
                </Heading>
              </HStack>
              <Text fontSize="md" color={textSecondary}>
                Kelola jadwal panen dan match dengan permintaan pasar
              </Text>
            </VStack>
          </HStack>

          {/* ETP Calculator */}
          <ETPCalculator
            onCalculate={handleETPCalculate}
            initialValues={{
              species: selectedSpecies,
              targetWeight: 120,
              startingWeight: 5,
              startDate: new Date(),
            }}
          />

          {/* Harvest Calendar & Demand Matcher */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {/* Calendar */}
            <Card variant="elevated">
              <CardHeader>
                <HStack gap={2}>
                  <FiCalendar size={18} />
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                    Kalender Panen
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <HarvestCalendar
                  events={harvestEvents}
                  onEventClick={handleEventClick}
                />
              </CardBody>
            </Card>

            {/* Demand Matcher */}
            {etpResult && (
              <Card variant="elevated">
                <CardHeader>
                  <HStack gap={2}>
                    <FiTarget size={18} />
                    <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                      Match dengan Permintaan Pasar
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <DemandMatcher
                    harvestDate={etpResult.estimatedDate}
                    species={selectedSpecies}
                    quantity={estimatedQuantity}
                    onSelectDemand={handleSelectDemand}
                  />
                </CardBody>
              </Card>
            )}
          </SimpleGrid>

          {/* Upcoming Harvests List */}
          {harvestEvents.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                  Panen Mendatang
                </Text>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" gap={3}>
                  {harvestEvents.map((event) => {
                    const daysUntil = Math.ceil(
                      (event.estimatedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <Box
                        key={event.id}
                        p={3}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.700')}
                        cursor="pointer"
                        onClick={() => handleEventClick(event)}
                        _hover={{
                          bg: useColorModeValue('gray.50', 'gray.800'),
                        }}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={1} flex={1}>
                            <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                              {event.projectName}
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                              {event.species} • {event.quantity} kg
                            </Text>
                          </VStack>
                          <VStack align="end" gap={1}>
                            <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                              {event.estimatedDate.toLocaleDateString('id-ID')}
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                              {daysUntil > 0 ? `${daysUntil} hari lagi` : 'Sudah lewat'}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </>
  );
}

