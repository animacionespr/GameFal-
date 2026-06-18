# Rastreador de Gobierno — Guía de Despliegue

## Requisitos Previos
- Node.js 18+
- Cuenta en Vercel (recomendado) o cualquier proveedor de Next.js
- Cuenta en Supabase (para backend de producción)

## 1. Instalación Local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 2. Base de Datos (Supabase)

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar `src/lib/database.sql`
3. Copiar las credenciales de conexión

## 3. Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
ANTHROPIC_API_KEY=tu_api_key_de_claude
```

## 4. Despliegue en Vercel

```bash
npm install -g vercel
vercel --prod
```

O conectar el repositorio directamente desde [vercel.com](https://vercel.com).

## 5. Funcionalidades del MVP Actual

✅ Dashboard de rendimiento con puntaje visual  
✅ Perfil completo del funcionario  
✅ Rastreador de promesas con filtros y evidencia  
✅ Cronología interactiva de eventos  
✅ Estadísticas con gráficas (Recharts)  
✅ Noticias y comunicados oficiales  
✅ Análisis de IA con fuentes citadas  
✅ Modo oscuro / modo claro  
✅ Diseño mobile-first  
✅ Navegación inferior (Bottom Nav)  
✅ Sistema de verificación visual  
✅ PWA-ready (manifest incluido)  
✅ Schema de base de datos PostgreSQL completo  

## 6. Próximas Funcionalidades

- [ ] Autenticación con Supabase Auth
- [ ] Panel de administración
- [ ] Notificaciones push (Web Push API)
- [ ] Búsqueda global
- [ ] Comparador de gobernadores
- [ ] API de recolección automática de datos
- [ ] Procesamiento de PDFs oficiales
- [ ] Motor de verificación con Claude AI

## 7. Arquitectura de Producción

```
┌─────────────────────────────────────┐
│           Cliente (Next.js)          │
│     React + TailwindCSS + Framer     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Supabase (Backend)           │
│  PostgreSQL + Auth + Storage + RT    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Edge Functions (API Routes)     │
│  Verificación + Claude AI + Cron     │
└─────────────────────────────────────┘
```

## 8. Política Editorial

Esta plataforma sigue estos principios inamovibles:

1. **Solo fuentes oficiales** — Sin excepción
2. **Sin opiniones políticas** — Neutralidad absoluta
3. **Sin especulación** — Solo hechos documentados
4. **Verificación visible** — Cada dato muestra su origen
5. **Sin predicciones** — La IA analiza, no predice
