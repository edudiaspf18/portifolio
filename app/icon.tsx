import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        ED
        <div style={{ position: 'absolute', left: 5, right: 5, bottom: 4, height: 2, background: '#ea580c' }} />
      </div>
    ),
    size,
  );
}
