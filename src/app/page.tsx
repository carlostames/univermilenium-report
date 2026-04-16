"use client";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  Building2,
  ChevronRight,
  ChevronUp,
  Compass,
  Crosshair,
  GraduationCap,
  MapPinned,
  Menu,
  Radar,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    value?: number | string;
    name?: string;
    color?: string;
    payload?: Record<string, number | string>;
  }>;
};

const summaryMetrics = [
  {
    label: "Keywords orgánicas",
    value: "7,048",
    change: "13x por debajo de UVM / UNITEC",
    tone: "violet",
  },
  {
    label: "Tráfico orgánico",
    value: "154,429",
    change: "Por debajo de ICEL en baseline MX",
    tone: "cyan",
  },
  {
    label: "Concentración en home",
    value: "81.49%",
    change: "Participación de tráfico en la muestra top",
    tone: "amber",
  },
  {
    label: "Baseline AEO",
    value: "39-44",
    change: "Buen punto de partida, no dominante",
    tone: "emerald",
  },
];

const benchmarkData = [
  { name: "Univer", keywords: 7048, traffic: 154429, cost: 29809, fill: "#5b5cf0" },
  { name: "UVM", keywords: 93948, traffic: 668132, cost: 930023, fill: "#06b6d4" },
  { name: "UNITEC", keywords: 92266, traffic: 675346, cost: 575322, fill: "#10b981" },
  { name: "Insurgentes", keywords: 13253, traffic: 101175, cost: 68213, fill: "#f59e0b" },
  { name: "ETAC", keywords: 15333, traffic: 70682, cost: 35893, fill: "#f97316" },
  { name: "ICEL", keywords: 8283, traffic: 160766, cost: 122217, fill: "#ec4899" },
];

/* ── AEO / AI Visibility Metrics (Manual sampling: 12 queries × 3 LLMs) ── */
const aeoMetrics = [
  {
    label: "AI Share of Voice",
    value: "0%",
    detail: "UniverMilenium no fue mencionado en ninguna de las 12 queries genéricas probadas en ChatGPT, Gemini y Perplexity.",
    benchmark: "UVM: 8/12 · UNITEC: 6/12",
    tone: "bad" as const,
  },
  {
    label: "AI Visibility Score",
    value: "0 / 36",
    detail: "Brand mentions vs total respuestas. 12 queries × 3 LLMs = 36 oportunidades. UM: 0 menciones.",
    benchmark: "UVM: 14/36 (39%) · UNITEC: 9/36 (25%)",
    tone: "bad" as const,
  },
  {
    label: "Citations en Perplexity",
    value: "0",
    detail: "URLs de univermilenium.edu.mx citadas como fuente en respuestas de Perplexity: cero.",
    benchmark: "UVM: 5 · UNITEC: 3",
    tone: "bad" as const,
  },
  {
    label: "Branded AEO",
    value: "100%",
    detail: "En queries branded ('UniverMilenium'), sí aparece correctamente en los 3 LLMs con información básica.",
    benchmark: "Todas las marcas: 100%",
    tone: "good" as const,
  },
];

const concentrationData = [
  { name: "Home", value: 81.49, fill: "#5b5cf0" },
  { name: "UM Clases Online", value: 3.29, fill: "#10b981" },
  { name: "UM Academic", value: 2.61, fill: "#06b6d4" },
  { name: "Campuses", value: 3.04, fill: "#f59e0b" },
  { name: "Other", value: 9.57, fill: "#cbd5e1" },
];

const clusterBlocks = [
  {
    tier: "P1",
    name: "Universidades cerca de mí / Toluca",
    volume: "144,120",
    position: "24-45",
    url: "univermilenium.edu.mx/",
    insight: "La demanda local de descubrimiento, que es muy valiosa, hoy está recayendo en la home en lugar de hubs GEO dedicados.",
  },
  {
    tier: "P1",
    name: "Ingeniería Industrial",
    volume: "87,760",
    position: "17-61",
    url: "maestria-en-ingenieria-industrial…",
    insight: "Cluster grande con señal real. La licenciatura está débil; la maestría ya muestra mejor tracción.",
  },
  {
    tier: "P1",
    name: "Administración",
    volume: "75,740",
    position: "17-67",
    url: "diplomado-en-administracion…",
    insight: "Buen volumen y señal parcial; requiere hub más fuerte para presencial y online. UNITEC rankea mucho mejor.",
  },
  {
    tier: "P1",
    name: "Comercio Internacional / Aduanas",
    volume: "64,770",
    position: "2-87",
    url: "licenciatura-en-comercio-internacional…",
    insight: "Tiene posición #2 en una variante, pero la fragmentación de naming y URLs diluye la relevancia total.",
  },
  {
    tier: "P2",
    name: "Nutrición",
    volume: "24,870",
    position: "31+",
    url: "licenciatura-en-nutricion/",
    insight: "Cluster relevante con URL existente pero sin dominio competitivo. UNITEC y UVM capturan mejor.",
  },
  {
    tier: "P2",
    name: "Enfermería",
    volume: "23,600",
    position: "25+",
    url: "licenciatura-en-enfermeria/",
    insight: "Importante para salud; hay que capturar intención transaccional y comparativa.",
  },
  {
    tier: "P2",
    name: "Radiología e Imagen",
    volume: "18,190",
    position: "1",
    url: "licenciatura-en-radiologia-e-imagen/",
    insight: "🏆 Mejor quick win actual: ya rankea #1. Modelo replicable a otros programas.",
  },
  {
    tier: "P2",
    name: "Criminología",
    volume: "15,930",
    position: "8",
    url: "licenciatura-en-criminologia-en-linea/",
    insight: "Tiene ángulo informacional y transaccional. Posición 8 es recuperable a top 5.",
  },
  {
    tier: "P2",
    name: "Gastronomía",
    volume: "14,590",
    position: "18",
    url: "licenciatura-en-gastronomia/",
    insight: "Oportunidad media con URL clara. Cluster más visual y diferenciable.",
  },
  {
    tier: "P2",
    name: "Ingeniería Civil",
    volume: "12,690",
    position: "27",
    url: "licenciatura-en-ingenieria-civil/",
    insight: "Cluster limpio y optimizable. Menos competencia que ingeniería industrial.",
  },
  {
    tier: "P3",
    name: "Mercadotecnia",
    volume: "10,860",
    position: "40",
    url: "licenciatura-en-mercadotecnia/",
    insight: "Hay oportunidad, pero hoy compite débil. Priorizar después de P1/P2.",
  },
  {
    tier: "P3",
    name: "Derecho",
    volume: "10,570",
    position: "20",
    url: "maestria-en-derecho-laboral…",
    insight: "Cluster mixto entre licenciatura y maestría. Primero ordenar arquitectura.",
  },
  {
    tier: "P3",
    name: "QFB (Químico Farmacéutico)",
    volume: "10,260",
    position: "23",
    url: "licenciatura-en-quimico-farmaceutico…",
    insight: "Programa de salud con potencial si es prioridad comercial.",
  },
  {
    tier: "P3",
    name: "Pedagogía",
    volume: "9,700",
    position: "16",
    url: "licenciatura-en-pedagogia-en-linea/",
    insight: "Mejor señal en modalidad online. Oportunidad para captura de demanda flexible.",
  },
  {
    tier: "P3",
    name: "Diseño Gráfico",
    volume: "9,300",
    position: "31",
    url: "licenciatura-en-diseno-grafico/",
    insight: "Optimización posterior salvo prioridad comercial.",
  },
];

const serpPresenceData = [
  { query: "licenciatura en enfermeria", results: 10, univerAppears: false, competitorAppears: "UVM, UNITEC, UNAM" },
  { query: "ingenieria industrial universidad", results: 10, univerAppears: false, competitorAppears: "UVM, UNITEC, La Salle, UNAM" },
  { query: "comercio internacional universidad", results: 10, univerAppears: false, competitorAppears: "Ninguno MX directo" },
  { query: "radiologia e imagen universidad", results: 10, univerAppears: false, competitorAppears: "La Salle, UDG" },
  { query: "universidades cerca de mi", results: 10, univerAppears: false, competitorAppears: "UNITEC, U. Insurgentes, UNIMEX" },
  { query: "universidades en nezahualcoyotl", results: 10, univerAppears: false, competitorAppears: "La Salle, UTN, UAEM" },
  { query: "universidades en ecatepec", results: 10, univerAppears: false, competitorAppears: "UNITEC, U. Ecatepec, ETAC" },
  { query: "universidades en toluca", results: 10, univerAppears: false, competitorAppears: "UNITEC, UAEM, TecMilenio" },
  { query: "univermilenium", results: 10, univerAppears: true, competitorAppears: "—" },
  { query: "licenciatura en administracion", results: 10, univerAppears: false, competitorAppears: "UNAM, La Salle, UVM" },
  { query: "licenciatura en nutricion", results: 10, univerAppears: false, competitorAppears: "UNITEC, UVM, UnADM" },
];

const urlDistributionData = [
  { name: "Univer", home: 81.49, campus: 3.04, platform: 5.90, programs: 0, other: 9.57 },
  { name: "UVM", home: 20.65, campus: 11.38, platform: 4.72, programs: 3.44, other: 59.81 },
  { name: "UNITEC", home: 13.13, campus: 13.55, platform: 22.37, programs: 0, other: 50.95 },
  { name: "Insurgentes", home: 28.39, campus: 27.14, platform: 1.90, programs: 0, other: 42.57 },
  { name: "ETAC", home: 1.40, campus: 30.44, platform: 0, programs: 1.71, other: 66.45 },
  { name: "ICEL", home: 6.12, campus: 15.88, platform: 61.30, programs: 0, other: 16.70 },
];

const technicalQuickWins = [
  { finding: "Home sin H1 detectable", impact: "Alta", effort: "Quick win", dep: "Web" },
  { finding: "Oferta educativa sin H1 detectable", impact: "Alta", effort: "Quick win", dep: "Web" },
  { finding: "Blog principal responde 404", impact: "Alta", effort: "Sprint", dep: "Web + Contenido" },
  { finding: "Sitemap incluye URLs de bajo valor (thank-you, landing, test)", impact: "Alta", effort: "Quick win", dep: "SEO técnico" },
  { finding: "Sin FAQ/Course schema en páginas revisadas", impact: "Alta", effort: "Sprint", dep: "Web + SEO" },
  { finding: "Home: 82 imágenes, 68 scripts, 15 iframes", impact: "Media", effort: "Sprint", dep: "Web" },
];

const roadmapPhases = [
  {
    label: "30 días",
    title: "Baseline y quick wins estructurales",
    points: [
      "Limpiar inventario indexable y ruido del sitemap",
      "Cerrar matriz de prioridades por cluster, campus y modalidad",
      "Definir plantillas para hubs de programa y hubs GEO",
      "Construir baseline competitivo con Semrush + herramientas de inteligencia digital",
    ],
  },
  {
    label: "60 días",
    title: "Páginas prioritarias y descubrimiento GEO",
    points: [
      "Lanzar páginas prioridad 1 por programa",
      "Desplegar hubs para búsquedas locales de descubrimiento",
      "Agregar capas de FAQ, comparativas y schema",
      "Mejorar UX para exploración y contacto de alta intención",
    ],
  },
  {
    label: "90 días",
    title: "Autoridad temática y distribución",
    points: [
      "Abrir motor editorial para demanda no-branded",
      "Fortalecer enlazado interno y arquitectura por clusters",
      "Expandir ejecución AEO / GEO en canales clave",
      "Montar monitoreo de share of presence",
    ],
  },
  {
    label: "Anual",
    title: "Sistema continuo de crecimiento",
    points: [
      "Migración completa a la estructura To Be",
      "Optimización continua SEO / AEO / GEO",
      "Autoridad externa, citaciones y cadencia editorial",
      "Monitoreo competitivo y reporting ejecutivo",
    ],
  },
];

const evidenceCards = [
  {
    icon: Crosshair,
    title: "Fricción comercial",
    text: "El cuello de botella principal no está entre cita e inscrito. Está entre lead, interés real y cita.",
  },
  {
    icon: BrainCircuit,
    title: "Señal AEO",
    text: "El AEO Grader de HubSpot muestra presencia detectable, pero no autoridad de categoría ni visibilidad dominante en answer engines.",
  },
  {
    icon: Building2,
    title: "Debilidad de arquitectura",
    text: "La visibilidad top está concentrada en home, campus y plataformas, no en hubs sólidos de programa.",
  },
  {
    icon: BookOpenText,
    title: "Patrón competitivo",
    text: "ETAC captura top-of-funnel con blog. UVM y UNITEC distribuyen mejor la visibilidad entre oferta y campus.",
  },
];

const reportStatus = [
  {
    title: "Qué ya está confirmado",
    text: "La visibilidad actual depende demasiado de marca, home, campus y plataformas. Los clusters programáticos sí existen, pero casi nunca dominan.",
  },
  {
    title: "Qué todavía falta cerrar",
    text: "Completar la capa de inteligencia digital para ecosistema, señales GEO por campus y share of presence fuera del sitio.",
  },
  {
    title: "Qué cambia la conversación",
    text: "El problema ya no es “hacer SEO”, sino construir una arquitectura de crecimiento con hubs, clusters, páginas prioritarias y señales externas consistentes.",
  },
];

const strengths = [
  "Ya existe una base SEO activa en WordPress con sitemap, canonicals y schema institucional.",
  "Radiología e Imagen ya muestra una señal de quick win replicable a otros programas.",
];

const risks = [
  "Seguir dependiendo de marca, home y plataformas para sostener la mayor parte de la visibilidad.",
  "Invertir más en captación sin corregir la arquitectura de descubrimiento y consideración.",
  "Mantener páginas y activos indexables que dispersan señales y no aportan negocio.",
];

const decisionMatrix = [
  { name: "Hubs GEO", impact: 96, effort: 52, phase: "Antes migración", fill: "#f59e0b" },
  { name: "Administración", impact: 94, effort: 56, phase: "Antes migración", fill: "#5b5cf0" },
  { name: "Ing. Industrial", impact: 92, effort: 62, phase: "Mixto", fill: "#06b6d4" },
  { name: "Comercio Intl.", impact: 90, effort: 68, phase: "Antes migración", fill: "#10b981" },
  { name: "Radiología", impact: 85, effort: 30, phase: "Quick win", fill: "#a855f7" },
  { name: "Nutrición", impact: 78, effort: 58, phase: "Mixto", fill: "#ec4899" },
  { name: "Enfermería", impact: 76, effort: 61, phase: "Mixto", fill: "#fb7185" },
  { name: "Criminología", impact: 72, effort: 45, phase: "Mixto", fill: "#14b8a6" },
];

const executionLanes = [
  {
    title: "Antes de migración",
    color: "violet",
    points: [
      "Limpiar indexación y sitemap",
      "Definir matriz de prioridad por páginas y clusters",
      "Fortalecer home, oferta educativa y hubs GEO",
      "Diseñar plantilla To Be para páginas de programa",
    ],
  },
  {
    title: "Durante / mixto",
    color: "cyan",
    points: [
      "Optimizar clusters P1 con contenido y bloques FAQ/comparativas",
      "Unificar naming y arquitectura en Comercio Internacional",
      "Elevar señales AEO en programas de salud e ingeniería",
      "Conectar journeys de descubrimiento con paths de contacto",
    ],
  },
  {
    title: "Post migración",
    color: "amber",
    points: [
      "Escalar páginas prioridad 2 y 3",
      "Abrir motor editorial evergreen",
      "Consolidar enlazado interno y hubs de categoría",
      "Operar optimización SEO / AEO / GEO continua",
    ],
  },
];

const priorityPages = [
  { page: "Hubs GEO por campus", why: "144k volumen + sin cobertura local dedicada", phase: "P1", timing: "Antes migración" },
  { page: "Hub Administración", why: "75k volumen + señal parcial existente", phase: "P1", timing: "Antes migración" },
  { page: "Hub Ingeniería Industrial", why: "87k volumen + brecha alta recuperable", phase: "P1", timing: "Mixto" },
  { page: "Hub Comercio Internacional", why: "64k volumen + fragmentación entre URLs", phase: "P1", timing: "Antes migración" },
  { page: "Radiología e Imagen", why: "Quick win: ya rankea #1. Modelo replicable", phase: "P2", timing: "Inmediato" },
  { page: "Nutrición + Enfermería", why: "48k volumen combinado en salud", phase: "P2", timing: "Mixto" },
  { page: "Criminología", why: "Posición #8 recuperable a top 5", phase: "P2", timing: "Mixto" },
  { page: "Motor editorial / Blog", why: "Blog 404 hoy. ETAC ya captura top-funnel", phase: "P2", timing: "60 días" },
];

const trendData = [
  { month: "Apr", branded: 89, nonBranded: 11 },
  { month: "May", branded: 87, nonBranded: 13 },
  { month: "Jun", branded: 85, nonBranded: 15 },
  { month: "Jul", branded: 84, nonBranded: 16 },
  { month: "Aug", branded: 82, nonBranded: 18 },
  { month: "Now", branded: 81, nonBranded: 19 },
];

const patternData = [
  { name: "UVM", description: "Marca + oferta + campus", color: "from-cyan-500 to-sky-600", homeShare: "20.65%", topUrl: "prepa en línea, medicina veterinaria" },
  { name: "UNITEC", description: "Marca + campus + plataforma", color: "from-emerald-500 to-green-600", homeShare: "13.13%", topUrl: "alumnos, campus, prepa" },
  { name: "ETAC", description: "Campus + blog informacional", color: "from-amber-400 to-orange-500", homeShare: "1.40%", topUrl: "carreras bien pagadas, qué es TI" },
  { name: "Insurgentes", description: "Marca + planteles locales", color: "from-orange-500 to-red-500", homeShare: "28.39%", topUrl: "ermita, norte, san angel" },
  { name: "ICEL", description: "Plataforma + autoservicio", color: "from-fuchsia-500 to-pink-500", homeShare: "6.12%", topUrl: "e-learning, Tlalpan, Ermita" },
  { name: "UniverMilenium", description: "Marca + home + plataforma", color: "from-violet-500 to-indigo-600", homeShare: "81.49%", topUrl: "home, um-clases, um-academic" },
];

const ecosystemScorecards = [
  {
    label: "Presencia en buscadores",
    score: "Parcial",
    detail: "Aparece con fuerza en marca, campus y navegación; la cobertura por programa y discovery sigue corta.",
    tone: "violet",
  },
  {
    label: "Presencia local por campus",
    score: "Mixta",
    detail: "Hay huella local aprovechable, pero falta consistencia de fichas, categorías y reputación por plaza.",
    tone: "amber",
  },
  {
    label: "Presencia social y paid",
    score: "Activa",
    detail: "Sí existe presión de narrativa en redes y anuncios, pero no siempre está conectada a una entidad fuerte.",
    tone: "cyan",
  },
  {
    label: "Presencia en IA",
    score: "Débil",
    detail: "La marca es detectable, pero no domina respuestas ni citas de categoría en answer engines.",
    tone: "emerald",
  },
];

const ecosystemPresenceData = [
  { name: "Buscadores", univer: 42, benchmark: 84, fill: "#5b5cf0" },
  { name: "Maps / Local", univer: 51, benchmark: 79, fill: "#f59e0b" },
  { name: "Social / Paid", univer: 58, benchmark: 76, fill: "#06b6d4" },
  { name: "Presencia IA", univer: 31, benchmark: 71, fill: "#10b981" },
];

const campusSignalRows = [
  { campus: "Chalco", visibility: "Media", local: "Parcial", rating: "4.2", reviews: 33, category: "Universidad privada", issue: "Pocas reseñas (33) vs otros campus. Naming como 'Plantel' en lugar de 'Campus'." },
  { campus: "Cuautitlán", visibility: "Media", local: "Mixta", rating: "4.0", reviews: 131, category: "Universidad privada", issue: "Naming como 'Universidad Univer Milenium'. Ficha sin reclamar." },
  { campus: "Ecatepec", visibility: "Media", local: "Parcial", rating: "4.0", reviews: 233, category: "Universidad privada", issue: "Naming como 'Plantel' en lugar de 'Campus'. Sin horarios publicados." },
  { campus: "Hidalgo", visibility: "Media-baja", local: "Parcial", rating: "4.2", reviews: 262, category: "Universidad privada", issue: "Buena base de reseñas. Debe convertirse en hub GEO junto con Rectoría." },
  { campus: "Ixtapaluca", visibility: "Media", local: "Mixta", rating: "4.0", reviews: 201, category: "Universidad privada", issue: "Naming como 'Plantel'. Categorías duplicadas: 'Universidad privada' + 'Universidad'." },
  { campus: "Nezahualcóyotl", visibility: "Media", local: "Mixta", rating: "4.2", reviews: 272, category: "Universidad", issue: "Categoría genérica sin 'privada'. Solo 1 categoría vs 2 en otros campus." },
  { campus: "Ciencias de la Salud", visibility: "Media", local: "Parcial", rating: "4.1", reviews: 229, category: "Universidad + Escuela", issue: "Categoría 'Escuela' debilita la señal. Oportunidad de consolidar con salud." },
  { campus: "Rectoría / Toluca", visibility: "Alta", local: "Más sólida", rating: "4.2", reviews: 250, category: "Universidad privada", issue: "Ficha más fuerte. Debe convertirse en referencia y hub GEO principal." },
  { campus: "Toluca (secundaria)", visibility: "Baja", local: "Débil", rating: "—", reviews: 0, category: "Escuela universitaria", issue: "Ficha fantasma sin reseñas, sin teléfono, sin reclamar. Riesgo de dilución." },
];

const quickFindings = [
  { label: "Sí aparece", value: "Marca, campus, plataformas y algunas búsquedas locales." },
  { label: "No aparece lo suficiente", value: "Queries no-branded de programa, comparativas y decisión asistida por IA." },
  { label: "Señal faltante", value: "Entidad fuerte, citabilidad externa y cobertura consistente por campus/modalidad." },
];

const diagnosisMatrix = [
  { cause: "Cobertura de contenido", level: "Alta", summary: "Faltan hubs más fuertes por programa, modalidad y campus." },
  { cause: "Señal de entidad", level: "Media-alta", summary: "La marca existe, pero no domina suficiente contexto de categoría." },
  { cause: "Señal local", level: "Alta", summary: "Las fichas y señales GEO no están operando como ventaja competitiva." },
  { cause: "Autoridad / citabilidad", level: "Alta", summary: "La IA necesita más fuentes públicas y activos fáciles de citar." },
  { cause: "Consistencia del ecosistema", level: "Media", summary: "Sitio, redes, anuncios y perfiles no siempre cuentan la misma historia." },
  { cause: "Intensidad competitiva", level: "Alta", summary: "Los competidores ya ocupan más superficies y más puntos de descubrimiento." },
];

const ecosystemConclusions = [
  "UniverMilenium sí tiene presencia digital, pero todavía no tiene suficiente densidad de señales para ganar respuestas generativas de forma consistente.",
  "La marca aparece mejor cuando el usuario ya sabe qué buscar; pierde más cuando la búsqueda es exploratoria, comparativa o asistida por IA.",
  "Para salir más en IA no basta con mejorar SEO on-site: hay que fortalecer entidad, cobertura pública, señal local y citabilidad externa.",
  "La capa de inteligencia digital debe cerrar el mapa de ecosistema para demostrar qué superficies hoy alimentan o debilitan la referencia de la marca.",
];

const ecosystemPriorities = [
  {
    action: "Normalizar entidad y mensajes por campus / modalidad",
    problem: "Inconsistencia del ecosistema",
    impact: "Más claridad de marca y mejor lectura por motores e IA",
    type: "Quick win",
    timing: "30 días",
    dependency: "No depende de migración",
  },
  {
    action: "Reforzar hubs GEO de Toluca y campus prioritarios",
    problem: "Señal local débil",
    impact: "Mayor discoverability local y mejor relevancia por plaza",
    type: "Sprint",
    timing: "60 días",
    dependency: "Parcialmente antes de migración",
  },
  {
    action: "Construir activos citables por programa",
    problem: "Baja autoridad / citabilidad",
    impact: "Más probabilidad de mención en AI Overviews y answer engines",
    type: "Sprint",
    timing: "60-90 días",
    dependency: "Plantillas To Be y contenido priorizado",
  },
  {
    action: "Monitorear share of presence en SERP, Maps y IA",
    problem: "Falta de trazabilidad del ecosistema",
    impact: "Visibilidad continua del progreso y la presión competitiva",
    type: "Recurrente",
    timing: "Anual",
    dependency: "Requiere operación continua",
  },
  {
    action: "Escalar cobertura por programa / campus post migración",
    problem: "Cobertura insuficiente",
    impact: "Más amplitud no-branded y menos dependencia de la home",
    type: "Dependiente de migración",
    timing: "90 días",
    dependency: "Nueva arquitectura y despliegue técnico",
  },
];

const paidPressureStats = [
  {
    label: "Mensajes de decisión / conversión",
    value: "72%",
    detail: "La categoría empuja inscripción, becas, precio y cierre inmediato mucho más que construcción de preferencia.",
    tone: "amber",
  },
  {
    label: "Mensajes de consideración",
    value: "20%",
    detail: "Hay algo de comparación y exploración, pero sigue subordinado al cierre comercial.",
    tone: "cyan",
  },
  {
    label: "Mensajes de construcción de demanda",
    value: "8%",
    detail: "La presencia de marca, categoría y memoria futura es claramente insuficiente.",
    tone: "violet",
  },
];

const paidMixData = [
  { name: "Decisión / conversión", category: 72, opportunity: 38, fill: "#f59e0b" },
  { name: "Consideración", category: 20, opportunity: 32, fill: "#06b6d4" },
  { name: "Construcción de demanda", category: 8, opportunity: 30, fill: "#5b5cf0" },
];

const paidEvidenceRows = [
  {
    channel: "Meta Ads",
    message: "Becas, inscripción, inicio inmediato, call to action directo",
    stage: "Decisión",
    implication: "Compite por usuarios ya in-market y presiona el CPA al alza.",
  },
  {
    channel: "Google Ads",
    message: "Programas, campus, intención alta y captura inmediata",
    stage: "Decisión",
    implication: "Refuerza demanda existente, pero no expande memoria ni preferencia futura.",
  },
  {
    channel: "Social orgánico / paid",
    message: "Vida universitaria, oferta y activaciones tácticas",
    stage: "Consideración",
    implication: "Puede ayudar a narrativa, pero hoy no opera como sistema fuerte de demanda futura.",
  },
  {
    channel: "Categoría en general",
    message: "Muy poca educación de categoría, autoridad o diferenciación sostenida",
    stage: "Upper funnel",
    implication: "Se deja desatendido el 95% que todavía no está listo para convertir.",
  },
];

const paidConclusions = [
  "La categoría está compitiendo demasiado por captura inmediata y demasiado poco por construcción de preferencia.",
  "Eso encarece el CPA porque todos persiguen al mismo 5% que ya está en mercado.",
  "Si UniverMilenium solo replica ese patrón, seguirá dependiendo de presión comercial y pauta de decisión.",
  "La oportunidad está en combinar captura del 5% con construcción sistemática de memoria y categoría en el 95% restante.",
];

const adExamples = [
  {
    brand: "UniverMilenium",
    body: "Este #BackToSchool, te hacemos el camino más fácil.\n\nEn UniverMilenium, la inscripción es GRATIS. Así de simple, para que puedas enfocarte en lo importante: empezar tu licenciatura.",
    cta: "Sign Up",
    title: "¡Cumple tus Metas!",
    caption: "univermilenium.edu.mx",
    profileImage: "/ads/univermilenium_profile.jpg",
    creativeImage: "/ads/univermilenium_0.jpg",
    stage: "Decisión",
    analysis: "CTA directo a cierre. Mensaje de precio/gratis. Compite solo por el 5% in-market.",
  },
  {
    brand: "UVM",
    body: "Recupera tu tiempo y forma parte de UVM, revalida tus materias y completa tu licenciatura con nosotros.",
    cta: "Learn More",
    title: "Se uno de nuestros egresados",
    caption: "uvm.mx",
    profileImage: "/ads/uvm_profile.jpg",
    creativeImage: "/ads/uvm_0.jpg",
    stage: "Consideración",
    analysis: "Captura + preferencia. 'Revalida materias' posiciona ventaja diferenciada.",
  },
  {
    brand: "UNITEC",
    body: "Estudia una Licenciatura en Línea UNITEC con mensualidades desde $1,295* + Beca Académica hasta del 65%.",
    cta: "Send WhatsApp Message",
    title: "Chat with us",
    caption: "api.whatsapp.com",
    profileImage: "/ads/unitec_profile.jpg",
    creativeImage: "/ads/unitec_0.jpg",
    stage: "Consideración",
    analysis: "Precio + beca + línea directa. Conversational commerce vía WhatsApp.",
  },
  {
    brand: "UniverMilenium",
    body: "Descubre el camino hacia tu éxito profesional\n\n• Estudia en UniverMilenium con un modelo académico flexible que se adapta a ti\n• Prepárate para el mundo laboral desde el primer día",
    cta: "Sign Up",
    title: "¡Inscríbete ahora!",
    caption: "univermilenium.edu.mx",
    profileImage: "/ads/univermilenium_profile.jpg",
    creativeImage: "/ads/univermilenium_1.jpg",
    stage: "Decisión",
    analysis: "Ligeramente más upper funnel pero el CTA sigue siendo registro directo.",
  },
  {
    brand: "UVM",
    body: "Estudia la Lic. en Medicina y promueve la salud de las personas y ten la oportunidad de obtener una Doble Titulación.",
    cta: "Sign Up",
    title: "Dale un plus a tu CV",
    caption: "uvm.mx",
    profileImage: "/ads/uvm_profile.jpg",
    creativeImage: "/ads/uvm_1.jpg",
    stage: "Consideración",
    analysis: "'Doble titulación' como diferenciador. Educa sobre valor antes del CTA.",
  },
  {
    brand: "UNITEC",
    body: "¡Da un paso más en tu carrera! Estudia una Licenciatura en Línea con Beca hasta del 65%* y obtén tu título universitario.",
    cta: "Sign Up",
    title: "Inscríbete desde $645* pesos",
    caption: "unitec.mx",
    profileImage: "/ads/unitec_profile.jpg",
    creativeImage: "/ads/unitec_1.jpg",
    stage: "Decisión",
    analysis: "Precio agresivo + beca. Mismo patrón de captura directa que UM.",
  },
];

const threeQuestions = [
  {
    num: "01",
    question: "¿Cómo está UniverMilenium hoy?",
    answer: "Con presencia digital activa pero concentrada en marca y home. No aparece en búsquedas no-branded de programa ni en respuestas de IA.",
    sections: "Resumen · Benchmark · SERP",
    tone: "violet",
  },
  {
    num: "02",
    question: "¿Por qué no sale en IA y en búsquedas clave?",
    answer: "Falta densidad de señales: hubs por programa débiles, sin blog, sin schema, fichas GEO inconsistentes y poca cobertura citable.",
    sections: "Clusters · Patrones · Ecosistema",
    tone: "cyan",
  },
  {
    num: "03",
    question: "¿Qué hacer primero?",
    answer: "Quick wins técnicos (H1, sitemap, schema), normalizar fichas GEO y construir hubs de programa P1 antes de la migración.",
    sections: "Auditoría · Roadmap",
    tone: "emerald",
  },
];

type NavItem = { type: "link"; id: string; label: string; icon: typeof Compass } | { type: "divider"; label: string };

const nav: NavItem[] = [
  { type: "divider", label: "Cómo están hoy" },
  { type: "link", id: "overview", label: "Resumen", icon: Compass },
  { type: "link", id: "benchmark", label: "Benchmark", icon: BarChart3 },
  { type: "link", id: "aeo", label: "AEO Intelligence", icon: BrainCircuit },
  { type: "divider", label: "Por qué no aparecen" },
  { type: "link", id: "clusters", label: "Clusters", icon: Target },
  { type: "link", id: "patterns", label: "Patrones", icon: Radar },
  { type: "link", id: "ecosystem", label: "Ecosistema IA", icon: BrainCircuit },
  { type: "divider", label: "Qué hacer" },
  { type: "link", id: "roadmap", label: "Roadmap", icon: Sparkles },
];

function cardTone(tone: string) {
  switch (tone) {
    case "cyan":
      return "from-cyan-500/15 to-cyan-200/0 text-cyan-200 border-cyan-400/20";
    case "amber":
      return "from-amber-500/15 to-amber-200/0 text-amber-200 border-amber-400/20";
    case "emerald":
      return "from-emerald-500/15 to-emerald-200/0 text-emerald-200 border-emerald-400/20";
    default:
      return "from-violet-500/15 to-violet-200/0 text-violet-200 border-violet-400/20";
  }
}

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
        {eyebrow}
      </div>
      <h2 className="max-w-4xl font-display text-3xl leading-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
        {copy}
      </p>
    </div>
  );
}

function laneTone(color: string) {
  switch (color) {
    case "cyan":
      return "border-cyan-400/20 bg-cyan-500/8 text-cyan-200";
    case "amber":
      return "border-amber-400/20 bg-amber-500/8 text-amber-200";
    default:
      return "border-violet-400/20 bg-violet-500/8 text-violet-200";
  }
}

function ChartTooltip({
  active,
  label,
  payload,
  valueFormatter,
}: CustomTooltipProps & { valueFormatter?: (value: number | string) => string }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const color = item.color ?? "#7c7dff";
  const formattedValue = valueFormatter
    ? valueFormatter(item.value ?? "")
    : `${item.value ?? ""}`;

  return (
    <div className="max-w-[240px] rounded-2xl border border-white/10 bg-[#071226]/96 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
      {label ? (
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</div>
      ) : null}
      <div className="mt-2 flex items-start gap-3">
        <span
          className="mt-1.5 size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-0">
          <div className="text-sm font-medium text-white">{item.name}</div>
          <div className="mt-1 text-lg font-semibold text-slate-100">{formattedValue}</div>
        </div>
      </div>
    </div>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const map = new Map<string, boolean>();
    ids.forEach((id) => map.set(id, false));

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          map.set(id, entry.isIntersecting);
          for (const sectionId of ids) {
            if (map.get(sectionId)) {
              setActive(sectionId);
              break;
            }
          }
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

const navLinks = nav.filter((n): n is Extract<NavItem, { type: "link" }> => n.type === "link");

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full border border-white/10 bg-violet-600/80 text-white shadow-2xl shadow-violet-950/50 backdrop-blur-xl transition hover:bg-violet-500"
        >
          <ChevronUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function MobileNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#07111f]/90 px-4 py-3 backdrop-blur-xl xl:hidden">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg">
            <GraduationCap className="size-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">UniverMilenium</p>
            <p className="text-sm font-medium text-white">Inteligencia de Crecimiento</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/6 text-slate-300 transition hover:bg-white/10"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-[60px] z-40 border-b border-white/10 bg-[#07111f]/95 p-4 backdrop-blur-2xl xl:hidden"
          >
            <div className="grid gap-1">
              {nav.map((item, i) =>
                item.type === "divider" ? (
                  <div key={`d-${i}`} className="px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    {item.label}
                  </div>
                ) : (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active === item.id
                        ? "bg-violet-500/12 text-white"
                        : "text-slate-400 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </a>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  const sectionIds = navLinks.map((n) => n.id);
  const active = useActiveSection(sectionIds);

      <div className="relative mx-auto flex w-full max-w-[1024px] flex-col gap-6 px-4 pt-12 pb-4 md:px-8 xl:pt-4">

        <main className="w-full space-y-6">
          <section
            id="overview"
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                    <Sparkles className="size-3.5 text-violet-300" />
                    Reporte ejecutivo SEO / AEO / GEO
                  </div>
                  <h1 className="max-w-4xl font-display text-4xl leading-[1.05] text-white md:text-6xl">
                    Sistema de Crecimiento: Reporte Ejecutivo SEO/AEO.
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                    UniverMilenium no tiene un problema de visibilidad aislado. Tiene un problema
                    de arquitectura de crecimiento: demasiada dependencia de tráfico de marca,
                    demasiado peso en la home y muy poca captación no-branded por programa en web,
                    superficies locales y answer engines.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                  <div className="rounded-[24px] border border-white/10 bg-[#0d1830]/80 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                      <TrendingUp className="size-3.5 text-emerald-300" />
                      Presión actual
                    </div>
                    <p className="mt-3 font-display text-2xl text-white">CPA en aumento</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      El CPL va en aumento y existe demasiada dependencia de la pauta en Google y Meta.
                      El presupuesto de marketing no basta para los resultados exigidos.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-[#0d1830]/80 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                      <BrainCircuit className="size-3.5 text-cyan-300" />
                      Diagnóstico núcleo
                    </div>
                    <p className="mt-3 font-display text-2xl text-white">Lead → interesado</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      El cuello de botella principal sigue antes de la cita, no después. Mejor
                      visibilidad solo importa si alimenta mejores journeys y mejor priorización.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.45 }}
                    className={`rounded-[26px] border bg-gradient-to-br p-5 ${cardTone(metric.tone)}`}
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {metric.label}
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <div className="font-display text-4xl text-white">{metric.value}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-300">{metric.change}</div>
                      </div>
                      <ArrowUpRight className="size-5 text-slate-400" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#0b162a]/90 via-[#0d1c36]/80 to-[#0b162a]/90 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
                  Este reporte responde 3 preguntas
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {threeQuestions.map((q) => (
                    <div key={q.num} className={`rounded-[22px] border p-5 ${
                      q.tone === "violet" ? "border-violet-400/20 bg-violet-500/8" :
                      q.tone === "cyan" ? "border-cyan-400/20 bg-cyan-500/8" :
                      "border-emerald-400/20 bg-emerald-500/8"
                    }`}>
                      <div className={`text-3xl font-display ${
                        q.tone === "violet" ? "text-violet-300" :
                        q.tone === "cyan" ? "text-cyan-300" :
                        "text-emerald-300"
                      }`}>{q.num}</div>
                      <h3 className="mt-3 font-display text-lg text-white">{q.question}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{q.answer}</p>
                      <div className="mt-3 text-xs text-slate-500">Secciones: {q.sections}</div>
                    </div>
                  ))}
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-200">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Fortalezas</div>
                  <h2 className="font-display text-3xl text-white">Qué sí existe hoy</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {strengths.map((item) => (
                  <div key={item} className="rounded-[22px] border border-emerald-400/10 bg-[#0b162a]/80 p-4 text-sm leading-7 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-rose-500/12 text-rose-200">
                  <TriangleAlert className="size-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Riesgos</div>
                  <h2 className="font-display text-3xl text-white">Qué pasa si no se corrige</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {risks.map((item) => (
                  <div key={item} className="rounded-[22px] border border-rose-400/10 bg-[#0b162a]/80 p-4 text-sm leading-7 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="benchmark"
            className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"
          >
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
              <SectionHeader
                eyebrow="Benchmark"
                title="Los líderes de categoría no solo son más grandes. Distribuyen mejor la visibilidad."
                copy="UniverMilenium no parte desde cero, pero todavía está lejos de la escala y de la discoverability estructural de UVM y UNITEC. La brecha no es solo de tráfico. Es amplitud de cobertura de keywords, valor del tráfico y capacidad de rankear con algo más que la home."
              />
              <div className="mt-8 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#cbd5e1", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      content={<ChartTooltip valueFormatter={(value) => `${Math.round(Number(value) / 1000)}k keywords`} />}
                      offset={18}
                      allowEscapeViewBox={{ x: true, y: true }}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar dataKey="keywords" radius={[10, 10, 0, 0]}>
                      {benchmarkData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                      <LabelList
                        dataKey="keywords"
                        position="top"
                        formatter={(value) => `${Math.round(Number(value ?? 0) / 1000)}k`}
                        style={{ fill: "#e2e8f0", fontSize: 11 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Riesgo de concentración
                    </div>
                    <h3 className="mt-3 font-display text-2xl text-white">
                      La home está cargando demasiado peso
                    </h3>
                  </div>
                  <MapPinned className="size-5 text-violet-300" />
                </div>
                <div className="mt-6 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={concentrationData}
                        dataKey="value"
                        innerRadius={70}
                        outerRadius={105}
                        stroke="none"
                        paddingAngle={3}
                      >
                        {concentrationData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<ChartTooltip valueFormatter={(value) => `${value}% de la muestra top`} />}
                        offset={12}
                        allowEscapeViewBox={{ x: true, y: true }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-3">
                  {concentrationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-slate-300">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        {item.name === "Home"
                          ? "Home"
                          : item.name === "Campuses"
                            ? "Campus"
                            : item.name === "Other"
                              ? "Otros"
                              : item.name}
                      </div>
                      <span className="font-medium text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Resultado del Análisis SEO</div>
                <h3 className="mt-3 font-display text-2xl text-white">
                  La visibilidad actual de UniverMilenium depende de la marca y la navegación.
                </h3>
                <div className="mt-6 h-[210px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorBranded" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#5b5cf0" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#5b5cf0" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorNonBranded" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        content={<ChartTooltip valueFormatter={(value) => `${value}% del mix estimado`} />}
                        offset={18}
                        allowEscapeViewBox={{ x: true, y: true }}
                      />
                      <Area type="monotone" dataKey="branded" stroke="#7c7dff" fill="url(#colorBranded)" strokeWidth={2} />
                      <Area type="monotone" dataKey="nonBranded" stroke="#22d3ee" fill="url(#colorNonBranded)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#7c7dff]" />
                    Marca / navegación
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#22d3ee]" />
                    Descubrimiento no-branded
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="aeo" className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
            <SectionHeader
              eyebrow="AEO Intelligence"
              title="Visibilidad en respuestas de IA: el nuevo campo de batalla."
              copy="¿Qué tan seguido aparece UniverMilenium cuando un prospecto pregunta a ChatGPT, Gemini o Perplexity sobre universidades? Métricas basadas en muestreo manual de 12 queries genéricos cruzados contra 3 LLMs."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {aeoMetrics.map((m) => (
                <div
                  key={m.label}
                  className={`rounded-[22px] border p-5 ${
                    m.tone === "bad"
                      ? "border-red-400/15 bg-red-500/5"
                      : "border-emerald-400/15 bg-emerald-500/5"
                  }`}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{m.label}</div>
                  <div className={`mt-3 font-display text-3xl ${
                    m.tone === "bad" ? "text-red-300" : "text-emerald-300"
                  }`}>
                    {m.value}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{m.detail}</p>
                  <div className="mt-3 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Benchmark:</span> {m.benchmark}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[18px] border border-amber-400/15 bg-amber-500/8 p-4">
              <p className="text-sm leading-7 text-slate-300">
                <span className="font-medium text-amber-200">⚠️ Metodología:</span> Estas métricas son un <em>baseline muestral</em>, no censal. Se probaron 12 queries representativos (marca, programa, GEO) en ChatGPT-4, Gemini y Perplexity. La medición se repetirá trimestral para medir evolución. No existe aún un estándar de industria para AI share of voice; esta es una proxy operativa.
              </p>
            </div>
          </section>

          <section
            id="clusters"
            className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8"
          >
              <SectionHeader
              eyebrow="Clusters prioritarios"
              title="Las mejores oportunidades ya son visibles en Google. Simplemente aún no son lo bastante fuertes."
              copy="Estos son los clusters donde UniverMilenium ya tiene URLs y cierta relevancia, pero todavía rankea en posiciones medias. Esa es la zona ideal para recuperación estratégica: suficiente señal para ganar, pero suficiente brecha para justificar rediseño, contenido y arquitectura."
            />

            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              {clusterBlocks.map((cluster, index) => (
                <motion.div
                  key={cluster.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="rounded-[28px] border border-white/10 bg-[#0b162a]/85 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${
                        cluster.tier === "P1"
                          ? "border-violet-400/20 bg-violet-500/10 text-violet-200"
                          : cluster.tier === "P2"
                            ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-200"
                            : "border-slate-400/20 bg-slate-500/10 text-slate-300"
                      }`}>
                        {cluster.tier}
                      </div>
                      <h3 className="mt-4 font-display text-2xl text-white">{cluster.name}</h3>
                    </div>
                    <Target className="size-5 text-slate-500" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Volumen agregado
                      </div>
                      <div className="mt-2 font-display text-3xl text-white">{cluster.volume}</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Posición actual
                      </div>
                      <div className={`mt-2 font-display text-3xl ${cluster.position === "1" ? "text-emerald-400" : cluster.position.startsWith("8") || cluster.position.startsWith("2") && !cluster.position.includes("-") ? "text-cyan-300" : "text-white"}`}>
                        {cluster.position === "1" ? "#1 🏆" : `#${cluster.position}`}
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">{cluster.insight}</p>
                  <div className="mt-3 truncate text-xs text-slate-500">
                    <span className="text-slate-400">URL:</span> {cluster.url}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
            <SectionHeader
              eyebrow="Validación SERP — Datos Apify"
              title="En 10 de 11 queries no-branded, UniverMilenium no aparece en los primeros 10 resultados."
              copy="Estas son búsquedas reales ejecutadas desde México en abril 2025. Confirman que la presencia actual depende casi exclusivamente de búsquedas de marca."
            />
            <div className="mt-6 overflow-x-auto rounded-[22px] border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/6 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Query buscada</th>
                    <th className="px-4 py-3 font-medium text-center">Aparece UM</th>
                    <th className="px-4 py-3 font-medium">Competidores que sí aparecen</th>
                  </tr>
                </thead>
                <tbody>
                  {serpPresenceData.map((row) => (
                    <tr key={row.query} className="border-t border-white/8 bg-[#091326]/70">
                      <td className="px-4 py-3 text-white font-medium">&ldquo;{row.query}&rdquo;</td>
                      <td className="px-4 py-3 text-center">
                        {row.univerAppears ? (
            className="flex flex-col gap-6"
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-300">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{row.competitorAppears}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Fuente: Apify Google Search Scraper, abril 2025. Top 10 resultados orgánicos por query.
            </p>
          </section>

          <section
            id="patterns"
            className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]"
          >
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
              <SectionHeader
                eyebrow="Patrones competitivos"
                title="El benchmark enseña tres playbooks distintos de captura."
                copy="UniverMilenium no necesita copiar a uno. Necesita combinar cobertura de categoría de UVM, captura informacional de ETAC y claridad operativa de ICEL."
              />
              <div className="mt-8 space-y-4">
                {patternData.map((pattern) => (
                  <div
                    key={pattern.name}
                    className="rounded-[24px] border border-white/10 bg-[#0c172b] p-4"
                  >
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                {evidenceCards.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-[24px] border border-white/10 bg-[#0b162a]/90 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-2xl bg-white/8 text-violet-200">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display text-xl text-white">{title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="ecosystem"
            className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8"
          >
            <SectionHeader
              eyebrow="Ecosistema IA"
              title="La capa de inteligencia digital debe cerrar la historia fuera del sitio: dónde sí aparece la marca y por qué todavía no domina IA."
              copy="Esta sección conecta SEO técnico con superficies externas: buscadores, señales locales, social, anuncios y answer engines. No sirve para demostrar que hay actividad digital; sirve para explicar por qué hoy la marca aparece más en navegación que en descubrimiento asistido por IA."
            />

              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Hallazgos rápidos
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-white">
                    Sí, no y parcial en una sola lectura
                  </h3>
                  <div className="mt-5 space-y-3">
                    {quickFindings.map((item) => (
                      <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/4 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Qué cambia la lectura
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-white">
                    La IA necesita más señales públicas, no solo mejores páginas internas
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    El sitio explica una parte del problema. La capa de inteligencia digital debe demostrar qué tan visible es la marca fuera del dominio y qué superficies hoy alimentan o limitan su aparición en respuestas generativas.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Presencia local por campus
                </div>
                <h3 className="mt-3 font-display text-2xl text-white">
                  La capa GEO debe leerse plaza por plaza
                </h3>
                <div className="mt-5 overflow-x-auto rounded-[22px] border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/6 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">Campus</th>
                        <th className="px-4 py-3 font-medium">Rating</th>
                        <th className="px-4 py-3 font-medium">Reseñas</th>
                        <th className="px-4 py-3 font-medium">Categoría Maps</th>
                        <th className="px-4 py-3 font-medium">Problema GEO detectado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campusSignalRows.map((row) => (
                        <tr key={row.campus} className="border-t border-white/8 bg-[#091326]/70 align-top">
                          <td className="px-4 py-3 text-white font-medium">{row.campus}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5">
                              <Star className="size-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-white">{row.rating}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{row.reviews > 0 ? row.reviews.toLocaleString() : "—"}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] text-slate-300">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300 max-w-xs">{row.issue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Qué explica ese estado
                </div>
                <h3 className="mt-3 font-display text-2xl text-white">
                  Esto explica por qué la IA sí o no los referencia
                </h3>
                <div className="mt-5 space-y-3">
                  {diagnosisMatrix.map((item) => (
                    <div key={item.cause} className="rounded-[22px] border border-white/10 bg-white/4 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-medium text-white">{item.cause}</div>
                        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-violet-200">
                          {item.level}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Conclusiones
                </div>
                <h3 className="mt-3 font-display text-2xl text-white">
                  Qué debería quedar claro para Rectoría y Marketing
                </h3>
                <div className="mt-5 space-y-3">
                  {ecosystemConclusions.map((item) => (
                    <div key={item} className="flex gap-3 rounded-[22px] border border-white/10 bg-white/4 p-4 text-sm leading-7 text-slate-300">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Prioridades de ejecución
                </div>
                <h3 className="mt-3 font-display text-2xl text-white">
                  Qué hacer primero para cerrar la brecha de presencia
                </h3>
                <div className="mt-5 overflow-hidden rounded-[22px] border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/6 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">Acción</th>
                        <th className="px-4 py-3 font-medium">Problema</th>
                        <th className="px-4 py-3 font-medium">Impacto</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Temporalidad</th>
                        <th className="px-4 py-3 font-medium">Dependencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ecosystemPriorities.map((row) => (
                        <tr key={row.action} className="border-t border-white/8 bg-[#091326]/70 align-top">
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8">
            <SectionHeader
              eyebrow="Auditoría técnica"
              title="6 hallazgos técnicos que se pueden resolver ya, antes de la migración."
              copy="Estos son problemas detectados en la revisión HTML del sitio actual. La mayoría son quick wins que no dependen de la migración y que mejoran inmediatamente la legibilidad semántica y la citabilidad del sitio."
            />
            <div className="mt-6 overflow-x-auto rounded-[22px] border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/6 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Hallazgo</th>
                    <th className="px-4 py-3 font-medium text-center">Impacto</th>
                    <th className="px-4 py-3 font-medium text-center">Esfuerzo</th>
                    <th className="px-4 py-3 font-medium">Dependencia</th>
                  </tr>
                </thead>
                <tbody>
                  {technicalQuickWins.map((row) => (
                    <tr key={row.finding} className="border-t border-white/8 bg-[#091326]/70">
                      <td className="px-4 py-3 text-white font-medium">{row.finding}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${
                          row.impact === "Alta"
                            ? "border-red-400/20 bg-red-500/10 text-red-300"
                            : "border-amber-400/20 bg-amber-500/10 text-amber-300"
                        }`}>
                          {row.impact}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${
                          row.effort === "Quick win"
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                            : "border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                        }`}>
                          {row.effort}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{row.dep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="roadmap"
            className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl md:p-8"
          >
            <SectionHeader
              eyebrow="Secuencia de ejecución"
              title="Convierte el diagnóstico en un orden de construcción."
              copy="El reporte no debe terminar en recomendaciones. Debe convertir el insight en una secuencia de implementación que separe quick wins, dependencias de migración y trabajo recurrente de crecimiento."
            />

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
              {roadmapPhases.map((phase, index) => (
                <motion.div
                  key={phase.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="rounded-[28px] border border-white/10 bg-[#0b162a]/90 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">
                      {phase.label}
                    </div>
                    <Sparkles className="size-4 text-slate-500" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-white">{phase.title}</h3>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    {phase.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Matriz de decisión
                </div>
                <h3 className="mt-3 font-display text-2xl text-white">
                  Qué debería atacarse primero
                </h3>
                <div className="mt-6 h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={decisionMatrix} layout="vertical" margin={{ top: 8, right: 20, left: 12, bottom: 8 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={true} vertical={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#cbd5e1", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                      />
                      <Tooltip
                        content={
                          <ChartTooltip
                            valueFormatter={(value) => `${value}/100 impacto estimado`}
                          />
                        }
                        offset={12}
                        allowEscapeViewBox={{ x: true, y: true }}
                      />
                      <Bar dataKey="impact" radius={[0, 10, 10, 0]}>
                        {decisionMatrix.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Secuencia de ejecución
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-white">
                    Antes, durante y después de migración
                  </h3>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {executionLanes.map((lane) => (
                      <div key={lane.title} className="rounded-[22px] border border-white/10 bg-white/4 p-4">
                        <div
                          className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${laneTone(lane.color)}`}
                        >
                          {lane.title}
                        </div>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                          {lane.points.map((point) => (
                            <li key={point} className="flex gap-3">
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-300" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#0b162a]/88 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Páginas prioridad 1
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-white">
                    Qué debería construirse primero
                  </h3>
                  <div className="mt-5 overflow-hidden rounded-[22px] border border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/6 text-slate-300">
                        <tr>
                          <th className="px-4 py-3 font-medium">Activo</th>
                          <th className="px-4 py-3 font-medium">Por qué</th>
                          <th className="px-4 py-3 font-medium">Fase</th>
                          <th className="px-4 py-3 font-medium">Timing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priorityPages.map((row) => (
                          <tr key={row.page} className="border-t border-white/8 bg-[#091326]/70">
                            <td className="px-4 py-3 text-white">{row.page}</td>
                            <td className="px-4 py-3 text-slate-300">{row.why}</td>
                            <td className="px-4 py-3">
                              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-violet-200">
                                {row.phase}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-300">{row.timing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500/8 via-white/6 to-cyan-500/8 p-6 backdrop-blur-2xl md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-xl shadow-violet-950/40">
                <GraduationCap className="size-7" />
              </div>
              <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight text-white md:text-4xl">
                El diagnóstico ya existe. Lo que sigue es construir el sistema.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                UniverMilenium tiene la base, los datos y la hoja de ruta. El siguiente paso es cerrar la capa cuantitativa con SEMrush, ejecutar los quick wins y diseñar las plantillas que van a capturar demanda real por programa, campus y modalidad.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[22px] border border-violet-400/20 bg-violet-500/10 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-violet-200">Paso inmediato</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">Entregar SEMrush API key y confirmar programas prioritarios por ciclo para cerrar el benchmark cuantitativo.</p>
                </div>
                <div className="rounded-[22px] border border-cyan-400/20 bg-cyan-500/10 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">En paralelo</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">Ejecutar quick wins de indexación, semántica y normalización de fichas por campus que no dependen de migración.</p>
                </div>
                <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">Siguiente entregable</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">Versión final del reporte con benchmark SEO competitivo, priorización cuantitativa y diseño de plantillas To Be.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="rounded-[32px] border border-white/8 bg-white/4 px-6 py-6 text-center backdrop-blur-xl">
            <p className="text-sm text-slate-400">
              Reporte de inteligencia de crecimiento — UniverMilenium — Abril 2026
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Datos: SEMrush · Apify · HubSpot AEO Grader · Revisión técnica del sitio
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
