import { getTranslations } from 'next-intl/server';
import { TechIcon } from '@/components/sections/tech-icon';
import type { StackItem } from '@/content/stack';

interface StackItemCardProps {
  item: StackItem;
}

export async function StackItemCard({ item }: StackItemCardProps) {
  const t = await getTranslations('stack');
  return (
    <li data-testid="stack-item" className="group flex flex-col items-center gap-3 text-center">
      <span className="flex size-16 items-center justify-center rounded-full border border-border transition-all duration-200 ease-in-out group-hover:border-foreground">
        <TechIcon icon={item.icon} className="size-7" />
      </span>
      <span className="text-sm">{item.name}</span>
      {/* espaço separa nome e nota no texto acessível */}
      {item.note && ' '}
      {item.note && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {t(`notes.${item.note}`)}
        </span>
      )}
    </li>
  );
}
