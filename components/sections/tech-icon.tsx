import { ChartColumn, FileText, Search, type LucideIcon } from 'lucide-react';
import { stackIcons } from '@/content/stack-icons';
import type { TechIconRef } from '@/content/stack';

const lucideMap: Record<'Search' | 'ChartColumn' | 'FileText', LucideIcon> = {
  Search,
  ChartColumn,
  FileText,
};

interface TechIconProps {
  icon: TechIconRef;
  className?: string;
}

export function TechIcon({ icon, className }: TechIconProps) {
  if (icon.kind === 'lucide') {
    const Icon = lucideMap[icon.name];
    return <Icon aria-hidden strokeWidth={1.5} className={className} />;
  }
  const found = stackIcons.find((i) => i.id === icon.id);
  if (!found) throw new Error(`TechIcon: ícone Simple Icons desconhecido: ${icon.id}`);
  return (
    <svg aria-hidden viewBox="0 0 24 24" role="presentation" className={`fill-current ${className ?? ''}`}>
      <path d={found.path} />
    </svg>
  );
}
