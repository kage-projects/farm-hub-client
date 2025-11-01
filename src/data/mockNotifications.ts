/**
 * Mock notification data
 * - Different notification types
 * - Timestamps
 * - Read/unread status
 */

export type NotificationType = 'rfq_received' | 'quotation_submitted' | 'contract_signed' | 'qc_required' | 'harvest_reminder' | 'system';

export type NotificationPriority = 'high' | 'medium' | 'low';

export type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    [key: string]: unknown;
  };
};

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'rfq_received',
    priority: 'high',
    title: 'RFQ Baru Diterima',
    message: 'Anda menerima RFQ untuk 5000 ekor bibit lele dari user123',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    actionUrl: '/rfq/rfq-123/quotation',
    actionLabel: 'Lihat RFQ',
  },
  {
    id: 'n2',
    type: 'quotation_submitted',
    priority: 'medium',
    title: 'Penawaran Dikirim',
    message: 'Penawaran Anda untuk RFQ-456 telah dikirim ke pembeli',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/rfq/rfq-456/quotation',
    actionLabel: 'Lihat Penawaran',
  },
  {
    id: 'n3',
    type: 'contract_signed',
    priority: 'high',
    title: 'Kontrak Ditandatangani',
    message: 'Kontrak CTR-001 telah ditandatangani oleh kedua pihak',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: true,
    actionUrl: '/contract/CTR-001',
    actionLabel: 'Lihat Kontrak',
  },
  {
    id: 'n4',
    type: 'qc_required',
    priority: 'high',
    title: 'QC Diperlukan',
    message: 'Barang untuk order ORD-789 telah diterima. Silakan lakukan QC dalam 24 jam.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    actionUrl: '/qc/ORD-789',
    actionLabel: 'Mulai QC',
  },
  {
    id: 'n5',
    type: 'harvest_reminder',
    priority: 'medium',
    title: 'Pengingat Panen',
    message: 'Panen untuk Proyek Lele - Padang dijadwalkan dalam 3 hari',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: false,
    actionUrl: '/harvest',
    actionLabel: 'Lihat Kalender',
  },
  {
    id: 'n6',
    type: 'system',
    priority: 'low',
    title: 'Pembaruan Sistem',
    message: 'Versi baru platform telah dirilis dengan fitur Supplier Recommender AI',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];

/**
 * Get notification icon based on type
 */
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    rfq_received: '📨',
    quotation_submitted: '📤',
    contract_signed: '✍️',
    qc_required: '✅',
    harvest_reminder: '📅',
    system: '🔔',
  };
  return icons[type] || '🔔';
}

/**
 * Get notification color based on priority
 */
export function getNotificationColor(priority: NotificationPriority): 'red' | 'orange' | 'blue' {
  const colors: Record<NotificationPriority, 'red' | 'orange' | 'blue'> = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  };
  return colors[priority];
}

