export type SocialId = 'email' | 'linkedin' | 'github' | 'instagram' | 'whatsapp';

export type SocialIconId = 'linkedin' | 'github' | 'instagram' | 'whatsapp';

export interface Social {
  id: SocialId;
  href: string;
  label: string;
  // Texto mostrado na lista de contato (usuário, @ ou número).
  handle?: string;
  iconId?: SocialIconId;
}

export const contactEmail = 'dududiaspf@gmail.com';
export const whatsappHref = 'https://wa.me/5562994267841';

export const socials: readonly Social[] = [
  { id: 'email', href: `mailto:${contactEmail}`, label: contactEmail },
  { id: 'linkedin', iconId: 'linkedin', href: 'https://www.linkedin.com/in/eduardo-dias-8a924131a', label: 'LinkedIn', handle: 'eduardo-dias' },
  { id: 'github', iconId: 'github', href: 'https://github.com/edudiaspf18', label: 'GitHub', handle: 'edudiaspf18' },
  { id: 'instagram', iconId: 'instagram', href: 'https://www.instagram.com/dudu_diaspf/', label: 'Instagram', handle: '@dudu_diaspf' },
  { id: 'whatsapp', iconId: 'whatsapp', href: whatsappHref, label: 'WhatsApp', handle: '(62) 99426-7841' },
];

