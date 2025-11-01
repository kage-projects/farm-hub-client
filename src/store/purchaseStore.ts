/**
 * Purchase & Order Store using Zustand
 * Untuk state management pembelian, RFQ, dan order tracking
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PurchaseSpec {
  quantity: number;
  tanggalButuh: string;
  tanggalFleksibel: boolean;
  spesifikasiKetat: boolean;
  nilaiBesar: boolean;
  jadwalBertahap: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  type: 'pakan' | 'benih' | 'peralatan';
  rating: number;
  responseTime: string;
  priceRange: {
    min: number;
    max: number;
    unit: string;
  };
  location: string;
  verified: boolean;
  sla?: string;
  qualityGuarantee?: boolean;
}

export interface OrderItem {
  supplierId: string;
  supplierName: string;
  itemType: 'pakan' | 'benih' | 'peralatan';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface Order {
  id: string;
  orderType: 'marketplace' | 'rfq';
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  finalTotal: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'qc_pending' | 'completed' | 'cancelled';
  purchaseSpec?: PurchaseSpec;
  supplier: Supplier;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  rfqId?: string; // Jika order dari RFQ
  contractId?: string; // Jika sudah ada kontrak
  qcWindowExpiresAt?: Date; // Untuk QC window
  trackingNumber?: string;
}

export interface RFQPrefillData {
  supplierId?: string;
  itemCategory?: string;
  quantity?: number;
  deliveryDate?: string;
  specification?: string;
  spesifikasiKetat?: boolean;
  nilaiBesar?: boolean;
  jadwalBertahap?: boolean;
  projectId?: string;
}

interface PurchaseStore {
  // Current purchase context
  currentPurchase: {
    supplier?: Supplier;
    purchaseSpec?: PurchaseSpec;
    projectId?: string;
    source?: 'plan-detail' | 'supplier-page';
  } | null;

  // Orders
  orders: Order[];

  // RFQ prefill data
  rfqPrefillData: RFQPrefillData | null;

  // Actions
  setCurrentPurchase: (data: {
    supplier?: Supplier;
    purchaseSpec?: PurchaseSpec;
    projectId?: string;
    source?: 'plan-detail' | 'supplier-page';
  } | null) => void;

  createOrder: (orderData: {
    orderType: 'marketplace' | 'rfq';
    items: OrderItem[];
    totalAmount: number;
    shippingCost: number;
    purchaseSpec?: PurchaseSpec;
    supplier: Supplier;
    projectId?: string;
    rfqId?: string;
    contractId?: string;
  }) => Order;

  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  getOrder: (orderId: string) => Order | undefined;

  setRFQPrefillData: (data: RFQPrefillData | null) => void;

  clearRFQPrefillData: () => void;
}

export const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPurchase: null,
      orders: [],
      rfqPrefillData: null,

      // Actions
      setCurrentPurchase: (data) => {
        set({ currentPurchase: data });
      },

      createOrder: (orderData) => {
        const order: Order = {
          id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...orderData,
          finalTotal: orderData.totalAmount + orderData.shippingCost,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Set QC window jika sudah delivered (24 jam dari sekarang untuk demo)
        if (order.status === 'delivered') {
          const qcWindow = new Date();
          qcWindow.setHours(qcWindow.getHours() + 24);
          order.qcWindowExpiresAt = qcWindow;
        }

        set((state) => ({
          orders: [...state.orders, order],
        }));

        return order;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date(),
                  // Set QC window jika status jadi delivered
                  ...(status === 'delivered' && !order.qcWindowExpiresAt
                    ? {
                        qcWindowExpiresAt: (() => {
                          const qcWindow = new Date();
                          qcWindow.setHours(qcWindow.getHours() + 24);
                          return qcWindow;
                        })(),
                      }
                    : {}),
                }
              : order
          ),
        }));
      },

      getOrder: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      setRFQPrefillData: (data) => {
        set({ rfqPrefillData: data });
      },

      clearRFQPrefillData: () => {
        set({ rfqPrefillData: null });
      },
    }),
    {
      name: 'purchase-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        // Jangan persist currentPurchase dan rfqPrefillData (temporary data)
      }),
    }
  )
);


