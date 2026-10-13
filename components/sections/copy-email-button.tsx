'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyEmailButtonProps {
  email: string;
  label: string;
  copiedLabel: string;
}

export function CopyEmailButton({ email, label, copiedLabel }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onClick(): Promise<void> {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.click();
    }
  }

  return (
    <>
    <button
      type="button"
      data-testid="contact-email"
      onClick={onClick}
      className={cn(
        buttonVariants({ size: 'lg', variant: 'outline' }),
        'rounded-full border-border transition-all duration-200 ease-in-out hover:border-foreground dark:hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      {copied ? <Check className="size-4 text-signal-ink" /> : <Copy className="size-4" />}
      {copied ? copiedLabel : label}
    </button>
    <span className="sr-only" aria-live="polite">
      {copied ? copiedLabel : ''}
    </span>
    </>
  );
}
