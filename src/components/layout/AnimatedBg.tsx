/**
 * Decorative animated Bauhaus shapes — pure CSS via .bg-anim.
 * The three child divs map to .blob-y / .blob-b / .blob-r and drift
 * via keyframes in ritmo.css.
 *
 * To upgrade to real motion (video, Lottie, WebGL), replace the inner
 * markup; the outer wrapper handles sizing and clipping.
 */
export function AnimatedBg() {
  return (
    <div className="bg-anim" aria-hidden="true">
      <div className="blob-y" />
      <div className="blob-b" />
      <div className="blob-r" />
    </div>
  );
}
