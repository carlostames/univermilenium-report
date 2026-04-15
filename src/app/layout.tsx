import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = "https://carlostames.github.io/univermilenium-report";

export const metadata: Metadata = {
  title: "UniverMilenium · Growth Intelligence Report",
  description: "Diagnóstico ejecutivo SEO / AEO / GEO para UniverMilenium. 12 clusters, 89 anuncios analizados, benchmark competitivo contra UVM, UNITEC y más.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "UniverMilenium · Diagnóstico SEO · AEO · GEO",
    description: "Reporte de inteligencia digital: presencia en buscadores, IA, Maps y presión publicitaria competitiva.",
    url: siteUrl,
    siteName: "Antigravity Growth Intelligence",
    images: [
      {
        url: `${siteUrl}/og.svg`,
        width: 1200,
        height: 630,
        alt: "UniverMilenium Growth Intelligence Report",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniverMilenium · Diagnóstico SEO · AEO · GEO",
    description: "12 clusters de búsqueda, 89 ads activos, benchmark competitivo y roadmap de ejecución.",
    images: [`${siteUrl}/og.svg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
