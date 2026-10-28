import { CheckCircle2, Clock, Truck, XCircle, type LucideIcon } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

interface StatusConfigItem {
  badgeColor: string;
  displayLabel: string;
  Icon: LucideIcon;
}

const STATUS_CONFIG: Record<string, StatusConfigItem> = {
  delivered: {
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    displayLabel: 'Delivered',
    Icon: CheckCircle2,
  },
  shipped: {
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    displayLabel: 'Shipped',
    Icon: Truck,
  },
  cancelled: {
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    displayLabel: 'Cancelled',
    Icon: XCircle,
  },
};

const DEFAULT_CONFIG: StatusConfigItem = {
  badgeColor: 'bg-orange-100 text-brand-orange border-orange-200',
  displayLabel: 'Processing',
  Icon: Clock,
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIG[normalized] || DEFAULT_CONFIG;
  const { badgeColor, displayLabel, Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs capitalize tracking-wide ${badgeColor}`}
    >
      <Icon size={13} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}
