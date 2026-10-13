import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#09090b',
          color: '#fafafa',
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -5,
        }}
      >
        ED
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 24, height: 10, background: '#ea580c' }} />
      </div>
    ),
    size,
  );
}
