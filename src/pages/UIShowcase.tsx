import { useState } from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Grid, Field, Input, Textarea, SimpleGrid, Separator } from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import { Navbar } from '../components/navbar/Navbar';
import { ColorModeButton } from '../components/ui/color-mode';
import { Button as CustomButton } from '../components/button/Button';
import { Tag } from '../components/badges/Tag';
import { Card, CardHeader, CardBody, CardFooter } from '../components/surfaces/Card';
import { Alert } from '../components/feedback/Alert';
import { Table } from '../components/data/Table';
import { EmptyState } from '../components/feedback/EmptyState';
import { toast } from '../components/feedback/Toast';
import { Tooltip } from '../components/feedback/Tooltip';
import { Skeleton, SkeletonText } from '../components/feedback/Skeleton';
import { Spinner } from '../components/feedback/Spinner';
import { Select } from '../components/forms/Select';

/**
 * FarmHub Dashboard - Real-world showcase of aquatic farming management
 */
export function UIShowcase() {
  const [selectedPond, setSelectedPond] = useState('pond-1');
  const [feedAmount, setFeedAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Text colors for optimal readability in light/dark mode
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.700', 'gray.300');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('cyan.200', 'cyan.700');

  const navLinks = [
    {
      label: 'Solutions',
      children: [
        { label: 'Fish Farming', description: 'Tilapia, salmon, and more', href: '/fish' },
        { label: 'Shrimp Culture', description: 'Vannamei and tiger prawns', href: '/shrimp', badge: 'Popular' },
        { label: 'Lobster Farm', description: 'Rock and spiny lobster', href: '/lobster' },
      ],
    },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Inventory', href: '/inventory' },
    { label: 'Reports', href: '/reports' },
  ];

  // Sample data for farm operations
  const pondData = [
    { 
      id: 1, 
      name: 'Pond A1', 
      species: 'Tilapia', 
      population: 5000, 
      health: 98,
      lastFed: '2 hours ago',
      status: 'Excellent' 
    },
    { 
      id: 2, 
      name: 'Pond B2', 
      species: 'Vannamei Shrimp', 
      population: 12000, 
      health: 95,
      lastFed: '4 hours ago',
      status: 'Good' 
    },
    { 
      id: 3, 
      name: 'Pond C3', 
      species: 'Salmon', 
      population: 3000, 
      health: 89,
      lastFed: '6 hours ago',
      status: 'Fair' 
    },
  ];

  const tableColumns = [
    { 
      key: 'name', 
      label: 'Pond',
      header: 'Pond',
      accessor: (row: typeof pondData[0]) => row.name,
      sortable: true 
    },
    { 
      key: 'species', 
      label: 'Species',
      header: 'Species',
      accessor: (row: typeof pondData[0]) => row.species,
      sortable: true 
    },
    { 
      key: 'population', 
      label: 'Population',
      header: 'Population',
      accessor: (row: typeof pondData[0]) => row.population.toLocaleString(),
      sortable: true 
    },
    { 
      key: 'health', 
      label: 'Health Score',
      header: 'Health Score',
      accessor: (row: typeof pondData[0]) => `${row.health}%`,
      sortable: true 
    },
    { 
      key: 'status', 
      label: 'Status',
      header: 'Status',
      accessor: (row: typeof pondData[0]) => row.status,
    },
  ];

  const handleFeedSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success({ 
        title: 'Feed Scheduled!', 
        description: `${feedAmount}kg feed scheduled for ${selectedPond}` 
      });
      setFeedAmount('');
    }, 1500);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        links={navLinks}
        cta={{ label: 'Add New Pond', href: '/add-pond' }}
        user={{ name: 'Farm Manager' }}
        brandName="🌊 FarmHub"
        overHero={false}
        sticky={true}
      />
      
      {/* Main Content */}
      <Box minH="100vh" width="100%">
        <Container maxW="7xl" py={8}>
          <VStack gap={8} align="stretch">
            
            {/* Hero Dashboard Header */}
            <Box py={8}>
              <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
                <VStack align="start" gap={2}>
                  <HStack>
                    <Text fontSize="4xl">🐟</Text>
                    <Heading size="2xl" fontWeight="800" color={textPrimary}>
                      Farm Dashboard
                    </Heading>
                  </HStack>
                  <Text fontSize="lg" color={textSecondary}>
                    Real-time monitoring and management for aquatic farming operations
                  </Text>
                  <HStack gap={2} mt={2}>
                    <Tag colorScheme="success" size="md">
                      ✓ All Systems Online
                    </Tag>
                    <Tag colorScheme="info" size="md">
                      3 Active Ponds
                    </Tag>
                    <Tag colorScheme="brand" size="md">
                      20,000 Total Population
                    </Tag>
                  </HStack>
                </VStack>
                <HStack gap={3}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <CustomButton variant="outline" colorScheme="brand" size="md">
                        📊 View Reports
                      </CustomButton>
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                      <Tooltip.Content>
                        Generate detailed analytics reports
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Tooltip.Root>
                  <ColorModeButton size="md" />
                </HStack>
              </HStack>
            </Box>

            {/* System Alerts */}
            <VStack align="stretch" gap={3}>
              <Alert
                status="success"
                variant="subtle"
                title="Water Quality Optimal"
                description="All ponds maintain ideal pH levels (7.2-7.8) and dissolved oxygen (>5 mg/L)"
              />
              <Alert
                status="warning"
                variant="left-accent"
                title="Feed Stock Alert"
                description="Current feed inventory: 450kg remaining. Reorder recommended within 3 days."
              />
            </VStack>

            {/* Key Metrics Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
              <Card variant="glass">
                <CardBody>
                  <VStack align="start" gap={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="3xl">🌡️</Text>
                      <Tag colorScheme="success" size="sm">+2.3%</Tag>
                    </HStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" color={textSecondary} fontWeight="500">
                        Avg Temperature
                      </Text>
                      <Heading size="xl" color={textPrimary}>28.5°C</Heading>
                      <Text fontSize="xs" color={mutedColor}>
                        Optimal range: 26-30°C
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card variant="glass">
                <CardBody>
                  <VStack align="start" gap={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="3xl">💧</Text>
                      <Tag colorScheme="info" size="sm">Normal</Tag>
                    </HStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" color={textSecondary} fontWeight="500">
                        Water Quality
                      </Text>
                      <Heading size="xl" color={textPrimary}>7.4 pH</Heading>
                      <Text fontSize="xs" color={mutedColor}>
                        Dissolved O₂: 6.2 mg/L
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card variant="glass">
                <CardBody>
                  <VStack align="start" gap={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="3xl">🍤</Text>
                      <Tag colorScheme="brand" size="sm">Active</Tag>
                    </HStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" color={textSecondary} fontWeight="500">
                        Total Population
                      </Text>
                      <Heading size="xl" color={textPrimary}>20,000</Heading>
                      <Text fontSize="xs" color={mutedColor}>
                        Across 3 active ponds
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card variant="glass">
                <CardBody>
                  <VStack align="start" gap={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="3xl">📈</Text>
                      <Tag colorScheme="success" size="sm">+15%</Tag>
                    </HStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" color={textSecondary} fontWeight="500">
                        Growth Rate
                      </Text>
                      <Heading size="xl" color={textPrimary}>12.5%</Heading>
                      <Text fontSize="xs" color={mutedColor}>
                        Monthly average
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Separator borderColor={borderColor} />

            {/* Feed Management Section */}
            <Box>
              <Heading size="lg" mb={6} display="flex" alignItems="center" gap={3} color={textPrimary}>
                <Text>🎣</Text>
                Feed Management System
              </Heading>
              
              <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                {/* Feed Form */}
                <Card variant="elevated">
                  <CardHeader>
                    <Heading size="md" color={textPrimary}>Schedule Feeding</Heading>
                    <Text fontSize="sm" color={textSecondary}>
                      Automated feed distribution system
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <VStack gap={4} align="stretch">
                      <Field.Root>
                        <Field.Label>Select Pond</Field.Label>
                        <Select
                          value={selectedPond}
                          onChange={(e) => setSelectedPond(e.target.value)}
                          items={[
                            { value: 'pond-1', label: 'Pond A1 - Tilapia (5,000)' },
                            { value: 'pond-2', label: 'Pond B2 - Vannamei Shrimp (12,000)' },
                            { value: 'pond-3', label: 'Pond C3 - Salmon (3,000)' },
                          ]}
                        />
                        <Field.HelperText>
                          Choose the pond for feed distribution
                        </Field.HelperText>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Feed Amount (kg)</Field.Label>
                        <Input
                          placeholder="Enter amount in kilograms"
                          type="number"
                          value={feedAmount}
                          onChange={(e) => setFeedAmount(e.target.value)}
                        />
                        <Field.HelperText>
                          Recommended: 2-3% of total biomass per day
                        </Field.HelperText>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Additional Notes (Optional)</Field.Label>
                        <Textarea
                          placeholder="e.g., Special feeding instructions..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </Field.Root>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <HStack justify="space-between" w="full">
                      <CustomButton 
                        variant="ghost" 
                        colorScheme="secondary"
                        onClick={() => {
                          setFeedAmount('');
                          setNotes('');
                        }}
                      >
                        Clear Form
                      </CustomButton>
                      <CustomButton
                        variant="solid"
                        colorScheme="brand"
                        loading={loading}
                        loadingText="Scheduling..."
                        onClick={handleFeedSubmit}
                        disabled={!feedAmount}
                      >
                        Schedule Feed
                      </CustomButton>
                    </HStack>
                  </CardFooter>
                </Card>

                {/* Feed Schedule Summary */}
                <Card variant="glass">
                  <CardHeader>
                    <Heading size="md" color={textPrimary}>Today's Schedule</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" gap={3}>
                      <Box
                        p={3}
                        bg={useColorModeValue('green.50', 'green.900')}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor="green.500"
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm" fontWeight="600" color={useColorModeValue('gray.900', 'gray.50')}>
                              06:00 AM
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                              Pond A1 - 25kg
                            </Text>
                          </VStack>
                          <Tag colorScheme="success" size="sm">Completed</Tag>
                        </HStack>
                      </Box>

                      <Box
                        p={3}
                        bg={useColorModeValue('blue.50', 'blue.900')}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor="blue.500"
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm" fontWeight="600">
                              12:00 PM
                            </Text>
                            <Text fontSize="xs" color={mutedColor}>
                              Pond B2 - 30kg
                            </Text>
                          </VStack>
                          <Spinner size="sm" colorPalette="blue" />
                        </HStack>
                      </Box>

                      <Box
                        p={3}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor="gray.400"
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm" fontWeight="600">
                              06:00 PM
                            </Text>
                            <Text fontSize="xs" color={mutedColor}>
                              Pond C3 - 20kg
                            </Text>
                          </VStack>
                          <Tag colorScheme="neutral" size="sm">Pending</Tag>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <CustomButton 
                      variant="outline" 
                      colorScheme="brand" 
                      size="sm" 
                      w="full"
                      onClick={() => toast.info({ title: 'View Full Schedule', description: 'Opening calendar view...' })}
                    >
                      View Full Calendar
                    </CustomButton>
                  </CardFooter>
                </Card>
              </Grid>
            </Box>

            <Separator borderColor={borderColor} />

            {/* Pond Status Table */}
            <Box>
              <HStack justify="space-between" mb={6}>
                <Heading size="lg" display="flex" alignItems="center" gap={3} color={textPrimary}>
                  <Text>🏊</Text>
                  Pond Status Overview
                </Heading>
                <HStack>
                  <CustomButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info({ title: 'Refreshing data...', description: 'Fetching latest pond status' })}
                  >
                    🔄 Refresh
                  </CustomButton>
                  <CustomButton 
                    colorScheme="brand" 
                    size="sm"
                    onClick={() => toast.success({ title: 'Export Started', description: 'Downloading CSV report...' })}
                  >
                    📥 Export Data
                  </CustomButton>
                </HStack>
              </HStack>

              <Card variant="glass">
                <CardBody>
                  <Table
                    columns={tableColumns}
                    data={pondData}
                    variant="simple"
                  />
                </CardBody>
              </Card>
            </Box>

            {/* Loading State Demo */}
            <Box>
              <Heading size="lg" mb={6} display="flex" alignItems="center" gap={3} color={textPrimary}>
                <Text>⏳</Text>
                Real-time Sensor Data
              </Heading>
              
              <Card variant="elevated">
                <CardBody>
                  <VStack align="stretch" gap={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="600" color={textPrimary}>Loading sensor readings...</Text>
                      <Spinner size="sm" />
                    </HStack>
                    <Skeleton height="60px" />
                    <SkeletonText noOfLines={3} />
                    <Skeleton height="40px" width="60%" />
                  </VStack>
                </CardBody>
              </Card>
            </Box>

            {/* Empty State Demo */}
            <Box>
              <Heading size="lg" mb={6} display="flex" alignItems="center" gap={3} color={textPrimary}>
                <Text>📦</Text>
                Inventory Management
              </Heading>
              
              <Card variant="glass">
                <CardBody>
                  <EmptyState
                    icon="🎣"
                    title="No Equipment Registered"
                    description="Start by adding your farming equipment and supplies to track inventory levels and maintenance schedules."
                    action={{
                      label: '+ Add Equipment',
                      onClick: () => toast.info({ 
                        title: 'Add Equipment', 
                        description: 'Opening equipment registration form...' 
                      }),
                    }}
                  />
                </CardBody>
              </Card>
            </Box>

            {/* Button Showcase in Context */}
            <Box>
              <Heading size="lg" mb={6} display="flex" alignItems="center" gap={3} color={textPrimary}>
                <Text>⚡</Text>
                Quick Actions
              </Heading>
              
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                <CustomButton variant="solid" colorScheme="brand" size="lg" w="full">
                  🔔 Set Alert
                </CustomButton>
                <CustomButton variant="solid" colorScheme="secondary" size="lg" w="full">
                  📸 Add Photo
                </CustomButton>
                <CustomButton variant="solid" colorScheme="accent" size="lg" w="full">
                  📊 Analytics
                </CustomButton>
                <CustomButton variant="outline" colorScheme="brand" size="lg" w="full">
                  ⚙️ Settings
                </CustomButton>
              </SimpleGrid>
            </Box>

            {/* Footer */}
            <Box textAlign="center" py={12} mt={8}>
              <Separator borderColor={borderColor} mb={8} />
              <VStack gap={4}>
                <HStack fontSize="3xl" gap={4} opacity={0.8}>
                  <Text>🐠</Text>
                  <Text>🦐</Text>
                  <Text>🦀</Text>
                  <Text>🦞</Text>
                  <Text>🐙</Text>
                </HStack>
                <Heading 
                  size="lg"
                  bgGradient={useColorModeValue(
                    "linear(to-r, cyan.600, teal.600)",
                    "linear(to-r, cyan.300, teal.300)"
                  )}
                  bgClip="text"
                >
                  FarmHub - Aquatic Farm Management System
                </Heading>
                <Text fontSize="sm" color={mutedColor} maxW="2xl">
                  Comprehensive dashboard for monitoring water quality, managing feeding schedules, 
                  tracking population health, and optimizing aquaculture operations.
                </Text>
                <HStack gap={3} mt={4}>
                  <Tag colorScheme="brand" size="sm">Chakra UI v3</Tag>
                  <Tag colorScheme="secondary" size="sm">TypeScript</Tag>
                  <Tag colorScheme="accent" size="sm">React</Tag>
                  <Tag colorScheme="success" size="sm">Responsive Design</Tag>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
