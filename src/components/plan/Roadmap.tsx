import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';

export interface RoadmapStep {
  phase: string;
  duration: string;
  tasks: string[];
  status?: 'completed' | 'in-progress' | 'pending';
}

export interface RoadmapProps {
  steps?: RoadmapStep[];
}

/**
 * Roadmap - Tahapan Pelaksanaan Proyek
 * Step-by-step roadmap dengan timeline
 */
export function Roadmap({ steps }: RoadmapProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const brandColor = useColorModeValue('brand.600', 'brand.400');

  const defaultSteps: RoadmapStep[] = steps || [
    {
      phase: 'Persiapan & Konstruksi',
      duration: 'Minggu 1-4',
      tasks: [
        'Survey lokasi dan pengukuran lahan',
        'Penggalian kolam (10m × 10m × 1.5m)',
        'Pemasangan terpal dan saluran air',
        'Instalasi pompa dan sistem aerasi',
        'Pemasangan peralatan monitoring',
      ],
      status: 'completed',
    },
    {
      phase: 'Pengisian Air & Persiapan Media',
      duration: 'Minggu 5',
      tasks: [
        'Pengisian air kolam hingga penuh',
        'Pengapuran untuk stabilisasi pH',
        'Pemupukan awal (urea + TSP)',
        'Menunggu air hijau (plankton tumbuh)',
        'Pengujian kualitas air (pH, DO, suhu)',
      ],
      status: 'completed',
    },
    {
      phase: 'Penebaran Bibit',
      duration: 'Minggu 6',
      tasks: [
        'Akuisisi bibit ikan lele (5000 ekor)',
        'Aklimatisasi bibit (30 menit di kolam)',
        'Penebaran bibit ke kolam utama',
        'Monitoring adaptasi (24 jam pertama)',
        'Mulai pemberian pakan starter',
      ],
      status: 'in-progress',
    },
    {
      phase: 'Pemeliharaan Harian (Bulan 1-2)',
      duration: 'Minggu 7-14',
      tasks: [
        'Pemberian pakan 2-3x sehari',
        'Monitoring kualitas air harian',
        'Pembersihan kolam rutin',
        'Pengobatan preventif (jika perlu)',
        'Pencatatan pertumbuhan',
      ],
      status: 'pending',
    },
    {
      phase: 'Pemeliharaan Intensif (Bulan 3-5)',
      duration: 'Minggu 15-26',
      tasks: [
        'Peningkatan dosis pakan',
        'Grading ikan (sortir ukuran)',
        'Perawatan kualitas air optimal',
        'Monitoring penyakit & parasit',
        'Persiapan panen',
      ],
      status: 'pending',
    },
    {
      phase: 'Panen',
      duration: 'Minggu 27-28',
      tasks: [
        'Pengosongan air kolam sebagian',
        'Penangkapan ikan menggunakan jaring',
        'Sortasi berdasarkan ukuran',
        'Penimbangan dan pencatatan',
        'Pemasaran atau penyimpanan',
      ],
      status: 'pending',
    },
    {
      phase: 'Pasca Panen',
      duration: 'Minggu 29-30',
      tasks: [
        'Pembersihan kolam total',
        'Pengeringan dan perbaikan kolam',
        'Evaluasi hasil panen',
        'Persiapan siklus berikutnya',
        'Perencanaan budidaya selanjutnya',
      ],
      status: 'pending',
    },
  ];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle color={useColorModeValue('green.600', 'green.400')} />;
      case 'in-progress':
        return <FiClock color={useColorModeValue('yellow.600', 'yellow.400')} />;
      default:
        return <FiCircle color={useColorModeValue('gray.400', 'gray.500')} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return useColorModeValue('green.50', 'green.900');
      case 'in-progress':
        return useColorModeValue('yellow.50', 'yellow.900');
      default:
        return useColorModeValue('gray.50', 'gray.800');
    }
  };

  return (
    <VStack align="stretch" gap={4}>
      {defaultSteps.map((step, index) => (
        <Card
          key={index}
          variant="elevated"
          bg={getStatusColor(step.status)}
          borderColor={step.status === 'in-progress' ? brandColor : borderColor}
          borderWidth={step.status === 'in-progress' ? '2px' : '1px'}
        >
          <CardHeader>
            <HStack justify="space-between" align="start">
              <HStack gap={3}>
                <Box fontSize="xl">{getStatusIcon(step.status)}</Box>
                <VStack align="start" gap={0}>
                  <HStack>
                    <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                      {step.phase}
                    </Text>
                    {step.status === 'in-progress' && (
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={useColorModeValue('yellow.700', 'yellow.300')}
                        bg={useColorModeValue('yellow.100', 'yellow.800')}
                        px={2}
                        py={0.5}
                        borderRadius="md"
                      >
                        Sedang Berlangsung
                      </Text>
                    )}
                  </HStack>
                  <Text fontSize="sm" color={textSecondary}>
                    {step.duration}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={2}>
              {step.tasks.map((task, taskIndex) => (
                <HStack key={taskIndex} align="start" gap={2}>
                  <Box
                    mt={1}
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg={step.status === 'completed' ? useColorModeValue('green.500', 'green.400') : textSecondary}
                    flexShrink={0}
                  />
                  <Text fontSize="sm" color={step.status === 'completed' ? textSecondary : textPrimary}>
                    {task}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}

