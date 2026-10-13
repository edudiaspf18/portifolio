import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface OgProps {
  params: Promise<{ locale: string }>;
}

export default async function OpengraphImage({ params }: OgProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#09090b',
          color: '#fafafa',
        }}
      >
        <div style={{ fontSize: 28, color: '#ea580c' }}>{t('eyebrow')}</div>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{t('title')}</div>
      </div>
    ),
    size,
  );
}
