export const THEME_STORAGE_KEY = 'theme'

/**
 * Runs before first paint to apply the stored (or system) theme, so the page
 * never flashes light before switching to dark. It has to be inline and
 * synchronous in <head> — a normal component effect runs too late.
 */
const script = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var dark = stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    /* Private mode can throw on localStorage access — fall back to light. */
  }
})();
`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
