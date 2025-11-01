/**
 * Issue Report Component - Form untuk user melaporkan kendala atau bertanya
 */

import { VStack, HStack, Text, Heading, Box, Button, Textarea, Select, Input, Badge } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { useState } from 'react';
import { FiAlertCircle, FiHelpCircle, FiClock, FiPackage } from 'react-icons/fi';
import { Alert } from '../feedback/Alert';
import { useRoadmapStore, type RoadmapIssue, type RoadmapExecution } from '../../store/roadmapStore';
import { generateAdaptiveRecommendations, formatAdjustments, type AdaptiveRecommendation } from '../../utils/roadmap/adaptiveRoadmap';

interface IssueReportProps {
  executionId: string;
  onIssueReported: () => void;
  execution?: RoadmapExecution;
}

export function IssueReport({ executionId, onIssueReported, execution }: IssueReportProps) {
  const { reportIssue, adjustTahap, resolveIssue } = useRoadmapStore();
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [issueType, setIssueType] = useState<RoadmapIssue['type']>('question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const issueTypeConfig = {
    question: {
      label: 'Pertanyaan',
      icon: FiHelpCircle,
      color: useColorModeValue('blue.600', 'blue.300'),
      bg: useColorModeValue('blue.50', 'blue.900'),
      description: 'Punya pertanyaan tentang tahap ini?',
    },
    problem: {
      label: 'Masalah/Kendala',
      icon: FiAlertCircle,
      color: useColorModeValue('red.600', 'red.300'),
      bg: useColorModeValue('red.50', 'red.900'),
      description: 'Menemukan kendala dalam menjalankan tahap ini?',
    },
    delay: {
      label: 'Keterlambatan',
      icon: FiClock,
      color: useColorModeValue('orange.600', 'orange.300'),
      bg: useColorModeValue('orange.50', 'orange.900'),
      description: 'Ada keterlambatan dalam jadwal?',
    },
    resource: {
      label: 'Kebutuhan Resource',
      icon: FiPackage,
      color: useColorModeValue('purple.600', 'purple.300'),
      bg: useColorModeValue('purple.50', 'purple.900'),
      description: 'Perlu resource tambahan?',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Judul dan deskripsi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const issue = reportIssue(executionId, {
        type: issueType,
        title: title.trim(),
        description: description.trim(),
      });

      // Generate adaptive recommendations
      if (execution && execution.currentTahap) {
        const currentTahap = execution.roadmap.tahapan.find(
          (t) => t.nomor === execution.currentTahap
        );
        
        if (currentTahap) {
          const adaptiveRecs = generateAdaptiveRecommendations(issue, currentTahap);
          setRecommendations(adaptiveRecs);
          setShowRecommendations(adaptiveRecs.length > 0);
        }
      }

      setSuccess(true);
      setTitle('');
      setDescription('');
      
      setTimeout(() => {
        setSuccess(false);
        onIssueReported();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Gagal melaporkan kendala');
    } finally {
      setIsSubmitting(false);
    }
  };

  const config = issueTypeConfig[issueType];

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack gap={2}>
          <Box
            p={2}
            borderRadius="lg"
            bg={config.bg}
            color={config.color}
          >
            <config.icon size={18} />
          </Box>
          <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
            Laporkan Kendala atau Bertanya
          </Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack align="stretch" gap={4}>
            {success && (
              <Alert
                status="success"
                variant="subtle"
                title="Kendala berhasil dilaporkan"
                description="Tim akan meninjau dan memberikan saran penyesuaian roadmap."
              />
            )}

            {error && (
              <Alert
                status="error"
                variant="subtle"
                title={error}
              />
            )}

            {/* Issue Type */}
            <VStack align="start" gap={2}>
              <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                Jenis Laporan
              </Text>
              <Select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as RoadmapIssue['type'])}
                w="full"
              >
                {Object.entries(issueTypeConfig).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </Select>
              <Text fontSize="xs" color={textSecondary}>
                {config.description}
              </Text>
            </VStack>

            {/* Title */}
            <VStack align="start" gap={2}>
              <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                Judul
              </Text>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Air kolam tidak jernih setelah 3 hari"
                required
              />
            </VStack>

            {/* Description */}
            <VStack align="start" gap={2}>
              <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                Deskripsi Detail
              </Text>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kendala atau pertanyaan Anda secara detail..."
                rows={5}
                required
              />
              <Text fontSize="xs" color={textSecondary}>
                Semakin detail informasi yang Anda berikan, semakin baik saran yang bisa diberikan sistem.
              </Text>
            </VStack>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="solid"
              colorScheme={issueType === 'problem' ? 'red' : 'brand'}
              w="full"
              loading={isSubmitting}
              loadingText="Mengirim..."
              leftIcon={<config.icon />}
            >
              Laporkan Kendala
            </Button>
          </VStack>
        </form>

        {/* Adaptive Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <Box
            mt={4}
            p={4}
            borderRadius="md"
            bg={useColorModeValue('blue.50', 'blue.900')}
            border="1px solid"
            borderColor={useColorModeValue('blue.200', 'blue.700')}
          >
            <VStack align="start" gap={3}>
              <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('blue.700', 'blue.300')}>
                💡 Saran Penyesuaian Roadmap
              </Text>
              <Text fontSize="xs" color={useColorModeValue('blue.700', 'blue.300')}>
                Berdasarkan kendala yang dilaporkan, sistem menyarankan penyesuaian berikut:
              </Text>
              <VStack align="stretch" gap={2} w="full">
                {recommendations.map((rec, idx) => (
                  <Box
                    key={idx}
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('white', 'blue.800')}
                    border="1px solid"
                    borderColor={useColorModeValue('blue.200', 'blue.600')}
                  >
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" fontWeight="semibold" color={textPrimary}>
                        {rec.adjustment}
                      </Text>
                      <Text fontSize="xs" color={textSecondary}>
                        Alasan: {rec.reason}
                      </Text>
                      <Badge
                        colorPalette={
                          rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'blue'
                        }
                        variant="subtle"
                        fontSize="xs"
                      >
                        {rec.priority === 'high' ? 'Prioritas Tinggi' : rec.priority === 'medium' ? 'Prioritas Sedang' : 'Prioritas Rendah'}
                      </Badge>
                    </VStack>
                  </Box>
                ))}
              </VStack>
              {execution && execution.currentTahap && (
                <Button
                  variant="outline"
                  size="sm"
                  w="full"
                  onClick={() => {
                    const adjustments = formatAdjustments(recommendations);
                    adjustTahap(executionId, execution.currentTahap!, adjustments);
                    setShowRecommendations(false);
                    onIssueReported();
                  }}
                >
                  Terapkan Penyesuaian
                </Button>
              )}
            </VStack>
          </Box>
        )}
      </CardBody>
    </Card>
  );
}

