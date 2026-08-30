import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Mec Roland', short_name: 'Mec Roland', description: 'Das Restaurant mit Herz in Kaltbrunn', start_url: '/', display: 'standalone', background_color: '#0b0b0b', theme_color: '#c9251b', lang: 'de-CH', icons: [{ src: '/media/10-Mec-Roland-Weiss.png', sizes: '300x215', type: 'image/png' }] };
}
