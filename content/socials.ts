export type SocialId = 'email' | 'linkedin' | 'github' | 'instagram' | 'whatsapp';

export type SocialIconId = 'linkedin' | 'github' | 'instagram' | 'whatsapp';

export interface Social {
  id: SocialId;
  href: string;
  label: string;
  iconId?: SocialIconId;
}

export const socials: readonly Social[] = [
  { id: 'email', href: 'mailto:dududiaspf@gmail.com', label: 'dududiaspf@gmail.com' },
  { id: 'linkedin', iconId: 'linkedin', href: 'https://www.linkedin.com/in/eduardo-dias-8a924131a', label: 'LinkedIn' },
  { id: 'github', iconId: 'github', href: 'https://github.com/edudiaspf18', label: 'GitHub' },
  { id: 'instagram', iconId: 'instagram', href: 'https://www.instagram.com/dudu_diaspf/', label: 'Instagram' },
  { id: 'whatsapp', iconId: 'whatsapp', href: 'https://wa.me/5562994267841', label: 'WhatsApp' },
];

export const contactEmail = 'dududiaspf@gmail.com';
export const whatsappHref = 'https://wa.me/5562994267841';
