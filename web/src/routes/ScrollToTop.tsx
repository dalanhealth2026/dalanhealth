import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// The browser's automatic scroll restoration replays the previous scroll
// offset after a refresh — on phones it visibly "auto-scrolls" the page right
// after paint. We own scroll position explicitly instead.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/**
 * Every route opens at the top of the page. Hash navigations (/#pricing) are
 * left alone — the landing page scrolls to the section itself.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
