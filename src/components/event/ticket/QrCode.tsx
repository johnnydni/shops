import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * QR code rendered as inline SVG. Client-side generation via `qrcode`
 * (no network round-trip, no external API).
 *
 * Settings tuned for printing on paper:
 *   - errorCorrectionLevel: 'M'  (~15% damage tolerance)
 *   - margin: 0 around the matrix (we add our own padding via CSS)
 *   - dark/light colours match the ticket's accent colour scheme
 */
export function QrCode({
  value,
  size = 160,
  dark = '#000000',
  light = '#FFFFFF',
  className,
}: {
  value: string;
  size?: number;
  dark?: string;
  light?: string;
  className?: string;
}) {
  const [svg, setSvg] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!value) {
      setSvg('');
      setErr(null);
      return;
    }
    QRCode.toString(value, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 0,
      width: size,
      color: { dark, light },
    })
      .then((s: string) => {
        if (!mounted) return;
        setSvg(s);
        setErr(null);
      })
      .catch((e: Error) => {
        if (!mounted) return;
        setErr(e.message);
      });
    return () => { mounted = false; };
  }, [value, size, dark, light]);

  if (err) return <div className={`qr-error ${className ?? ''}`}>QR-Fehler: {err}</div>;
  if (!svg) return <div className={`qr-loading ${className ?? ''}`} style={{ width: size, height: size }} />;
  return (
    <div
      className={`qr ${className ?? ''}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="QR-Code"
    />
  );
}
