/*
 * Opening curtain: the flyer's blue-and-white stripes, lifted one by one.
 * Pure CSS, so it covers the first paint with no flash. The inline script
 * marks it as skipped for the rest of the browser session — one curtain per
 * visit is a welcome; one per page view is a toll.
 */

const STRIPES = 9;

const skipScript = `try{var c=document.getElementById("site-curtain");if(sessionStorage.getItem("brado-curtain")||matchMedia("(prefers-reduced-motion: reduce)").matches){c.setAttribute("data-skip","")}else{sessionStorage.setItem("brado-curtain","1")}}catch(e){}`;

export function Curtain() {
  return (
    <>
      <div id="site-curtain" className="site-curtain" aria-hidden suppressHydrationWarning>
        {Array.from({ length: STRIPES }, (_, i) => (
          <span key={i} className="site-curtain-stripe" style={{ "--i": i } as React.CSSProperties} />
        ))}
        <div className="site-curtain-mark">
          <span className="site-curtain-word">Brado</span>
          <span className="site-curtain-sub">Training Center</span>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: skipScript }} />
    </>
  );
}
