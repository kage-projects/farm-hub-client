/**
 * Supplier Badge System
 * - Auto-calculate badges based on criteria
 * - Badges: Terverifikasi, Tepat Waktu 95%+, QC Pass 98%, Harga Stabil
 */

import type { SupplierData } from '../../data/mockSuppliers';
import type { SupplierScore } from './scoring';

export type BadgeType = 'verified' | 'on-time' | 'qc-pass' | 'price-stable';

export interface Badge {
  type: BadgeType;
  label: string;
  description: string;
  color: 'brand' | 'secondary' | 'accent' | 'green' | 'blue';
}

const BADGE_DEFINITIONS: Record<BadgeType, Badge> = {
  verified: {
    type: 'verified',
    label: 'Terverifikasi',
    description: 'Memiliki sertifikasi resmi',
    color: 'brand',
  },
  'on-time': {
    type: 'on-time',
    label: 'Tepat Waktu 95%+',
    description: 'Ketepatan pengiriman ≥ 95%',
    color: 'green',
  },
  'qc-pass': {
    type: 'qc-pass',
    label: 'QC Pass 98%+',
    description: 'Tingkat lulus QC ≥ 98%',
    color: 'blue',
  },
  'price-stable': {
    type: 'price-stable',
    label: 'Harga Stabil',
    description: 'Stabilitas harga ≥ 85%',
    color: 'secondary',
  },
};

/**
 * Calculate badges for a supplier
 */
export function calculateBadges(supplier: SupplierData, score?: SupplierScore): BadgeType[] {
  const badges: BadgeType[] = [];

  // Terverifikasi
  if (supplier.certification.hasCertification) {
    badges.push('verified');
  }

  // Tepat Waktu 95%+
  if (supplier.sla.onTimePercentage >= 0.95) {
    badges.push('on-time');
  }

  // QC Pass 98%+ (based on return rate - lower return = higher QC pass)
  const qcPassRate = 1 - supplier.returnRate;
  if (qcPassRate >= 0.98) {
    badges.push('qc-pass');
  }

  // Harga Stabil
  if (supplier.priceStability >= 0.85) {
    badges.push('price-stable');
  }

  return badges;
}

/**
 * Get badge definition
 */
export function getBadgeDefinition(type: BadgeType): Badge {
  return BADGE_DEFINITIONS[type];
}

/**
 * Get all badge definitions
 */
export function getAllBadgeDefinitions(): Badge[] {
  return Object.values(BADGE_DEFINITIONS);
}

