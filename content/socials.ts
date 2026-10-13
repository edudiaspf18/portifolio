export type SocialId = 'email' | 'linkedin' | 'github' | 'instagram' | 'whatsapp';

export interface Social {
  id: SocialId;
  href: string;
  label: string;
}

export const socials: readonly Social[] = [
  { id: 'email', href: 'mailto:dududiaspf@gmail.com', label: 'dududiaspf@gmail.com' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/eduardo-dias-8a924131a', label: 'LinkedIn' },
  { id: 'github', href: 'https://github.com/edudiaspf18', label: 'GitHub' },
  { id: 'instagram', href: 'https://www.instagram.com/dudu_diaspf/', label: 'Instagram' },
  { id: 'whatsapp', href: 'https://wa.me/5562994267841', label: 'WhatsApp' },
];
