import { HStack, Text, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useColorModeValue } from '../ui/color-mode';
import { FiClock } from 'react-icons/fi';

export interface PriceLockTimerProps {
  deadline: Date;
  onExpire?: () => void;
}

/**
 * Price Lock Timer Component
 * - Countdown timer untuk price-lock deadline
 * - Auto-expire notification
 */
export function PriceLockTimer({ deadline, onExpire }: PriceLockTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  } | null>(null);

  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const warningColor = useColorModeValue('orange.600', 'orange.400');
  const dangerColor = useColorModeValue('red.600', 'red.400');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds, expired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (!timeRemaining) {
    return null;
  }

  if (timeRemaining.expired) {
    return (
      <HStack gap={1} color={dangerColor}>
        <FiClock size={14} />
        <Text fontSize="sm" fontWeight="semibold">
          Price-lock kedaluwarsa
        </Text>
      </HStack>
    );
  }

  const isUrgent = timeRemaining.hours < 12;
  const color = isUrgent ? dangerColor : timeRemaining.hours < 24 ? warningColor : textSecondary;

  return (
    <HStack gap={1} color={color}>
      <FiClock size={14} />
      <Text fontSize="sm" fontWeight={isUrgent ? 'semibold' : 'normal'}>
        {timeRemaining.hours > 0 && `${timeRemaining.hours}j `}
        {timeRemaining.minutes}m {timeRemaining.seconds}s tersisa
      </Text>
    </HStack>
  );
}


