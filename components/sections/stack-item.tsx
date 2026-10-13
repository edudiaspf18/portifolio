import { getTranslations } from 'next-intl/server';
import { TechIcon } from '@/components/sections/tech-icon';
import type { StackItem } from '@/content/stack';

interface StackItemCardProps {
  item: StackItem;
}

export async function StackItemCard({ item }: StackItemCardProps) {
  const t = await getTranslations('stack');
  return (
    <li data-testid="stack-item" className="group text-center">
      <div data-testid={`stack-item-${item.id}`} className="flex flex-col items-center gap-3">
        <span className="flex size-16 items-center justify-center rounded-full border border-border transition-all duration-200 ease-in-out group-hover:border-foreground">
          <TechIcon icon={item.icon} className="size-7" />
        </span>
        <span className="text-sm">{item.name}</span>
        {item.note && (
          <span className="-mx-3 text-balance font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {t(`notes.${item.note}`)}
          </span>
        )}
      </div>
    </li>
  );
}
