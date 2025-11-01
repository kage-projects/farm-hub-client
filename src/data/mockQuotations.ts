/**
 * Mock quotation data
 * - Multiple quotations per RFQ
 * - Different price models
 * - Price-lock timers
 */

import type { PriceModel, PriceModelData } from '../utils/rfq/priceModel';
import { calculateValidityPeriod } from '../utils/rfq/priceModel';

export type Quotation = {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  item: {
    name: string;
    category: 'bibit' | 'pakan' | 'obat' | 'logistik';
    specification?: string;
    size?: string;
  };
  quantity: number;
  unitPrice: number;
  priceModel: PriceModelData;
  shippingCost: number;
  totalPrice: number;
  sla: {
    deliveryTime: number; // hours
    minDeliveryTime: number;
    maxDeliveryTime: number;
  };
  priceLockDeadline: Date;
  priceLocked: boolean;
  terms: string[];
  submittedAt: Date;
  expiresAt: Date;
};

export const mockQuotations: Quotation[] = [
  {
    id: 'q1',
    rfqId: 'rfq1',
    supplierId: 's1',
    supplierName: 'Peternakan Ikan Lele Sumber Rezeki',
    item: {
      name: 'Bibit Lele',
      category: 'bibit',
      specification: 'Size 7-9',
    },
    quantity: 5000,
    unitPrice: 300,
    priceModel: {
      model: 'spot',
      basePrice: 300,
      validityDays: 5,
      ...calculateValidityPeriod('spot', 5),
    },
    shippingCost: 200000,
    totalPrice: 5000 * 300 + 200000,
    sla: {
      deliveryTime: 36,
      minDeliveryTime: 24,
      maxDeliveryTime: 48,
    },
    priceLockDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    priceLocked: false,
    terms: ['Pembayaran DP 30%', 'Pengiriman dalam 36 jam', 'Garansi mortalitas ≤3%'],
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  },
  {
    id: 'q2',
    rfqId: 'rfq1',
    supplierId: 's2',
    supplierName: 'Toko Pakan Ikan Makmur',
    item: {
      name: 'Pakan Pellet',
      category: 'pakan',
      specification: 'Protein 32%',
    },
    quantity: 600,
    unitPrice: 11000,
    priceModel: {
      model: 'fixed',
      basePrice: 11000,
      validityWeeks: 4,
      ...calculateValidityPeriod('fixed', 4),
    },
    shippingCost: 150000,
    totalPrice: 600 * 11000 + 150000,
    sla: {
      deliveryTime: 24,
      minDeliveryTime: 18,
      maxDeliveryTime: 30,
    },
    priceLockDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    priceLocked: false,
    terms: ['Pembayaran DP 50%', 'Harga tetap 4 minggu', 'Diskon 5% untuk order berikutnya'],
    submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000), // 4 weeks
  },
  {
    id: 'q3',
    rfqId: 'rfq1',
    supplierId: 's6',
    supplierName: 'Supplier Pakan Premium',
    item: {
      name: 'Pakan Pellet',
      category: 'pakan',
      specification: 'Protein 35% Premium',
    },
    quantity: 600,
    unitPrice: 12000,
    priceModel: {
      model: 'indexed',
      basePrice: 12000,
      indexRef: 'Harga Bahan Baku Pakan',
      formula: 'basePrice * (indexValue / baseIndex)',
      floor: 11000,
      ceiling: 13000,
      repricingWindow: 14,
      ...calculateValidityPeriod('indexed', 6),
    },
    shippingCost: 120000,
    totalPrice: 600 * 12000 + 120000,
    sla: {
      deliveryTime: 18,
      minDeliveryTime: 12,
      maxDeliveryTime: 24,
    },
    priceLockDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    priceLocked: false,
    terms: ['Harga mengikuti indeks bahan baku', 'Floor: Rp 11.000, Ceiling: Rp 13.000', 'Repricing tiap 14 hari'],
    submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    expiresAt: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks
  },
];

