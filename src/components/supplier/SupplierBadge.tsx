import { Badge as ChakraBadge, Tooltip } from '@chakra-ui/react';
import { getBadgeDefinition, type BadgeType } from '../../utils/supplier/badges';

export interface SupplierBadgeProps {
  type: BadgeType;
  showTooltip?: boolean;
}

/**
 * Supplier Badge Component
 * - Display badge dengan tooltip
 * - Consistent styling dengan color scheme
 */
export function SupplierBadge({ type, showTooltip = true }: SupplierBadgeProps) {
  const badgeDef = getBadgeDefinition(type);

  const badge = (
    <ChakraBadge
      colorPalette={badgeDef.color}
      variant="solid"
      fontSize="xs"
      fontWeight="semibold"
      px={2}
      py={1}
    >
      {badgeDef.label}
    </ChakraBadge>
  );

  if (showTooltip) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger>{badge}</Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {badgeDef.description}
        </Tooltip.Content>
      </Tooltip.Root>
    );
  }

  return badge;
}

