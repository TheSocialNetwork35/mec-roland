'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function MotionLayer() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    items.forEach((item) => { item.classList.add('reveal-ready'); observer.observe(item); });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
