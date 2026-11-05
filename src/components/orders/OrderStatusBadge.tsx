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
    badgeColor: 'bg-emerald-600 text-white',
    displayLabel: 'Delivered',
    Icon: CheckCircle2,
  },
  shipped: {
    badgeColor: 'bg-blue-600 text-white',
    displayLabel: 'Shipped',
    Icon: Truck,
  },
  cancelled: {
    badgeColor: 'bg-rose-600 text-white',
    displayLabel: 'Cancelled',
    Icon: XCircle,
  },
};

const DEFAULT_CONFIG: StatusConfigItem = {
  badgeColor: 'bg-brand-orange text-white',
  displayLabel: 'Processing',
  Icon: Clock,
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIG[normalized] || DEFAULT_CONFIG;
  const { badgeColor, displayLabel, Icon } = config;

  return (
    <span
      role="status"
      aria-label={`Order status: ${displayLabel}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full shadow-2xs capitalize tracking-wide ${badgeColor}`}
    >
      <Icon size={13} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}
