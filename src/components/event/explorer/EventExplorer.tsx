import { useEffect, useRef, useState } from 'react';

/**
 * Embedded zoom-pan viewer for a tournament match-poster image.
 *
 * Inside its own panel — the user zooms and pans WITHIN the panel only,
 * the rest of the page never scales. Implementation: a fixed-size frame
 * with `overflow: hidden`, an `<img>` inside transformed via `scale` +
 * `translate`.
 *
 * Controls:
 *  - Mouse wheel: zoom in/out (centred on cursor position)
 *  - Drag (pointerdown → move → up): pan
 *  - Pinch / two-finger gesture: native browser pinch within the panel
 *    (we honor it via the `touch-action: none` plus wheel)
 *  - "+ / − / Reset" buttons for keyboard-friendly fallback
 *
 * When `src` is missing or fails to load, a "demnächst" placeholder
 * tile is rendered instead so the section stays meaningful.
 */
export function EventExplorer({ src, alt }: { src?: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [imgOk, setImgOk] = useState(!!src);
  const dragRef = useRef<null | { x: number; y: number; tx: number; ty: number }>(null);

  useEffect(() => setImgOk(!!src), [src]);

  const MIN = 1;
  const MAX = 5;
  const STEP = 0.5;

  function clampScale(s: number) { return Math.max(MIN, Math.min(MAX, s)); }
  function clampPan(value: number, axisLen: number, s: number) {
    // Pan is bounded so the image edges can't be pulled past centre at any zoom.
    const max = (axisLen * (s - 1)) / 2;
    return Math.max(-max, Math.min(max, value));
  }

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!imgOk) return;
    e.preventDefault();
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;

    const delta = e.deltaY < 0 ? 0.18 : -0.18;
    const nextScale = clampScale(scale * (1 + delta));
    // Re-centre pan toward the cursor on zoom so the image grows under it.
    const factor = nextScale / scale;
    const nextTx = clampPan((tx - cursorX) * factor + cursorX, rect.width, nextScale);
    const nextTy = clampPan((ty - cursorY) * factor + cursorY, rect.height, nextScale);
    setScale(nextScale);
    setTx(nextTx);
    setTy(nextTy);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!imgOk || scale <= MIN) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !imgOk) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setTx(clampPan(dragRef.current.tx + dx, rect.width, scale));
    setTy(clampPan(dragRef.current.ty + dy, rect.height, scale));
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  }

  function zoomBy(delta: number) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const next = clampScale(scale + delta);
    setScale(next);
    setTx(clampPan(tx, rect.width, next));
    setTy(clampPan(ty, rect.height, next));
  }
  function reset() { setScale(1); setTx(0); setTy(0); }

  return (
    <div className="evx-wrap">
      <div
        ref={frameRef}
        className={`evx-frame${scale > 1 ? ' is-pannable' : ''}`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {src && imgOk ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            onError={() => setImgOk(false)}
            className="evx-img"
            style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
          />
        ) : (
          <div className="evx-empty" aria-label="Match-Plakat demnächst">
            <div className="evx-empty-mark" aria-hidden="true" />
            <p className="evx-empty-sub">
              Hier findest du die interaktive Turnier-Grafik.
            </p>
          </div>
        )}
      </div>

      {imgOk && (
        <div className="evx-controls">
          <button
            type="button"
            className="evx-ctrl"
            onClick={() => zoomBy(-STEP)}
            disabled={scale <= MIN}
            aria-label="Auszoomen"
          >−</button>
          <span className="evx-scale">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className="evx-ctrl"
            onClick={() => zoomBy(STEP)}
            disabled={scale >= MAX}
            aria-label="Reinzoomen"
          >+</button>
          <button
            type="button"
            className="evx-ctrl evx-ctrl-reset"
            onClick={reset}
            disabled={scale === 1 && tx === 0 && ty === 0}
          >Reset</button>
          <span className="evx-hint">
            Scroll zum Zoomen, Ziehen zum Bewegen
          </span>
        </div>
      )}
    </div>
  );
}
