# CLAUDE.md — Alpha Sites Platform · Store Template

> Este archivo le da contexto completo a Claude Code sobre el proyecto.
> Leelo entero antes de tocar cualquier archivo.

---

## ¿Qué es este proyecto?

Es el **template de tienda online** que usa Alpha Sites (@alphasitess) para crear tiendas
para clientes. El modelo de negocio es similar a Tiendanube pero personalizado: cada cliente
tiene su propio diseño, dominio, base de datos y panel de admin. No hay comisión por venta.

El primer cliente real es **Camisetas Zeus** (camisetaszeus.com) — tienda de camisetas de
rugby premium de La Plata, Argentina.

Este template se clona para cada cliente nuevo. Lo único que cambia entre clientes es
`tenant.config.json` y las variables de entorno de Supabase.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 App Router |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + CSS variables del tenant |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage imágenes | Supabase Storage |
| Estado global | Zustand (carrito) |
| Pagos | MercadoPago SDK |
| Hosting | Vercel |
| DNS / CDN | Cloudflare |

---

## Estructura de archivos

```
/
├── app/
│   ├── layout.tsx              ← layout raíz, aplica CSS vars del tenant
│   ├── page.tsx                ← home: hero + productos destacados + features
│   ├── globals.css             ← estilos base + clases reutilizables
│   ├── catalogo/
│   │   └── page.tsx            ← PENDIENTE: listado con filtros
│   ├── producto/
│   │   └── [slug]/
│   │       └── page.tsx        ← PENDIENTE: detalle de producto
│   ├── carrito/
│   │   └── page.tsx            ← PENDIENTE: carrito de compras
│   ├── checkout/
│   │   └── page.tsx            ← PENDIENTE: formulario + MercadoPago
│   ├── actions/
│   │   └── crear-pedido.ts     ← PENDIENTE: server action para guardar pedido
│   └── admin/
│       ├── page.tsx            ← PENDIENTE: dashboard con stats y pedidos
│       ├── login/
│       │   └── page.tsx        ← PENDIENTE: login con Supabase Auth
│       ├── productos/
│       │   └── page.tsx        ← PENDIENTE: gestión de productos (CRUD)
│       └── pedidos/
│           └── page.tsx        ← PENDIENTE: gestión de pedidos
├── components/
│   └── Navbar.tsx              ← nav fija con carrito y links
├── lib/
│   ├── config.ts               ← carga tenant.config.json con tipos y helpers
│   ├── supabase.ts             ← clientes de Supabase + queries + tipos
│   └── carrito.tsx             ← Zustand store del carrito con persistencia
├── supabase/
│   └── schema.sql              ← schema completo, ejecutar en Supabase SQL Editor
├── public/                     ← imágenes estáticas del cliente
├── tenant.config.json          ← identidad del cliente (ÚNICO ARCHIVO QUE CAMBIA)
├── .env.local                  ← variables de entorno (NO commitear)
├── .env.example                ← template de variables de entorno
└── CLAUDE.md                   ← este archivo
```

---

## tenant.config.json — el corazón del sistema

Este archivo define toda la identidad del cliente. La tienda lo lee en runtime y se adapta.
**Nunca hardcodees datos del cliente en el código — siempre leé desde este archivo.**

```json
{
  "tenant": { "id", "nombre", "descripcion", "url" },
  "marca": {
    "colores": {
      "--color-primario": "#FFD500",      ← color principal (botones, badges, acentos)
      "--color-secundario": "#050505",    ← color de fondo oscuro
      "--color-fondo": "#050505",
      "--color-fondo-card": "#0F0F0F",
      "--color-texto": "#FFFFFF",
      "--color-texto-muted": "#888888",
      "--color-borde": "#1A1A1A",
      "--color-error": "#FF4747",
      "--color-exito": "#2A8A4F"
    },
    "tipografia": { "titulo": "Anton", "cuerpo": "Oswald", "mono": "JetBrains Mono" }
  },
  "contacto": { "email", "whatsapp", "instagram", "tiktok" },
  "pagos": { "mercadopago", "transferencia", "efectivo" },
  "envios": { "retiro_local", "correo_argentino", "oca", "moto", "envio_gratis" },
  "home": { "hero", "stats", "features" }
}
```

### Cómo usar el config en componentes

```typescript
// Server o client component
import { tenant, formatPrecio, getWhatsAppURL } from '@/lib/config'

tenant.tenant.nombre          // "Camisetas Zeus"
tenant.marca.colores          // objeto con todos los colores
tenant.contacto.whatsapp      // "5492216220145"
formatPrecio(70000)           // "$70.000"
getWhatsAppURL()              // "https://wa.me/5492216220145?text=..."
```

---

## CSS Variables y clases base

Los colores del tenant se aplican como CSS variables en el `<body>` desde `layout.tsx`.
**Siempre usar variables CSS para colores, nunca hardcodear hex.**

```css
/* Colores disponibles en cualquier componente */
var(--color-primario)        /* amarillo Zeus #FFD500 */
var(--color-primario-hover)
var(--color-secundario)      /* negro #050505 */
var(--color-fondo)
var(--color-fondo-card)      /* cards ligeramente más claras */
var(--color-texto)
var(--color-texto-muted)     /* texto secundario #888 */
var(--color-borde)           /* bordes sutiles #1A1A1A */
var(--color-error)
var(--color-exito)
```

### Clases Tailwind reutilizables (definidas en globals.css)

```css
.btn-primario        /* botón amarillo relleno */
.btn-secundario      /* botón con borde */
.producto-card       /* card de producto con hover amarillo */
.badge               /* badge amarillo */
.badge-outline       /* badge solo borde */
.input-base          /* input estilizado */
.font-titulo         /* Anton uppercase */
.font-mono           /* JetBrains Mono */

/* Status de pedidos */
.status-nuevo
.status-confirmado
.status-preparando
.status-enviado
.status-entregado
.status-cancelado
```

---

## Supabase — tipos y queries disponibles

### Tipos principales (en lib/supabase.ts)

```typescript
type Producto {
  id, nombre, slug, descripcion, descripcion_corta,
  precio, precio_tachado,
  imagenes: string[],           // array de URLs
  imagen_principal: string,
  variantes: Variante[],        // [{ tipo: "talle", opciones: ["S","M","L"] }]
  stock: Record<string, number>, // { "S-Negro": 5, "M-Blanco": 0 }
  categoria, tags, es_destacado, es_activo
}

type Pedido {
  id, numero,                   // numero es serial legible (#0042)
  cliente_nombre, cliente_email, cliente_telefono,
  envio_tipo, envio_direccion, envio_costo,
  items: ItemPedido[],
  subtotal, total,
  pago_metodo, pago_estado,     // 'pendiente' | 'pagado' | 'fallido'
  estado: EstadoPedido          // 'nuevo'|'confirmado'|'preparando'|'enviado'|'entregado'|'cancelado'
}

type ItemPedido {
  producto_id, nombre, variante, cantidad, precio_unitario, imagen
}
```

### Clientes de Supabase (usar el correcto según contexto)

```typescript
// En Client Components ('use client')
import { createSupabaseBrowser } from '@/lib/supabase'
const supabase = createSupabaseBrowser()

// En Server Components y Route Handlers
import { createSupabaseServer } from '@/lib/supabase'
const supabase = await createSupabaseServer()

// Para operaciones admin privilegiadas (SOLO en server)
import { createSupabaseAdmin } from '@/lib/supabase'
const supabase = createSupabaseAdmin()
```

### Queries disponibles

```typescript
getProductos(supabase)                    // todos los activos
getProductoBySlug(supabase, slug)         // uno por slug
getProductosDestacados(supabase)          // destacados para el home
crearPedido(supabase, pedido)             // crear pedido en checkout
getStatsAdmin(supabase)                   // stats para el dashboard
```

---

## Carrito (Zustand)

```typescript
import { useCarrito } from '@/lib/carrito'

const { items, totalItems, subtotal, subtotalFormateado,
        agregar, quitar, actualizarCantidad, vaciar } = useCarrito()

// Agregar producto al carrito
agregar(producto, 'L-Negro', 1)

// El carrito persiste en localStorage con key 'carrito-zeus'
```

---

## Variables de entorno necesarias

```bash
# .env.local (copiar desde .env.example)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # solo server, nunca al cliente
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_BASE_URL=           # https://camisetaszeus.com
```

---

## Reglas de desarrollo — LEER ANTES DE ESCRIBIR CÓDIGO

### 1. Colores — siempre CSS variables
```typescript
// ✅ CORRECTO
style={{ background: 'var(--color-primario)', color: 'var(--color-secundario)' }}
className="border-[var(--color-borde)]"

// ❌ INCORRECTO
style={{ background: '#FFD500' }}
className="bg-yellow-400"
```

### 2. Datos del cliente — siempre desde tenant.config.json
```typescript
// ✅ CORRECTO
import { tenant } from '@/lib/config'
<h1>{tenant.tenant.nombre}</h1>

// ❌ INCORRECTO
<h1>Camisetas Zeus</h1>
```

### 3. Precios — siempre con formatPrecio()
```typescript
// ✅ CORRECTO
import { formatPrecio } from '@/lib/config'
formatPrecio(producto.precio)  // "$70.000"

// ❌ INCORRECTO
`$${producto.precio}`
```

### 4. Server vs Client components
- Pages que necesitan datos de Supabase → Server Components (sin 'use client')
- Componentes con hooks (carrito, estado, eventos) → Client Components ('use client')
- Formularios de checkout y admin → Client Components con server actions

### 5. ISR para páginas públicas
```typescript
// En todas las páginas públicas del storefront
export const revalidate = 60  // revalida cada 60 segundos
```

### 6. Rutas del admin — siempre proteger con auth
```typescript
// Al inicio de cada server component del admin
const supabase = await createSupabaseServer()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/admin/login')
```

### 7. Estética — dark mode, tipografía Anton/Oswald
- Fondo siempre oscuro (`--color-fondo`, `--color-fondo-card`)
- Títulos con `font-titulo` (Anton uppercase)
- Texto secundario con `font-mono` (JetBrains Mono)
- Acentos con `--color-primario` (amarillo)
- Bordes sutiles con `--color-borde`
- Sin bordes redondeados grandes — usar `rounded-none` o `rounded-sm` máximo
- Animaciones con `animate-fade-up` y `delay-*` definidas en globals.css

---

## Schema de base de datos (resumen)

```sql
productos    -- id, nombre, slug, precio, variantes(jsonb), stock(jsonb), imagenes(text[])
pedidos      -- id, numero(serial), cliente_*, envio_*, items(jsonb), total, estado, pago_estado
clientes     -- id, email, nombre, total_pedidos, total_gastado
configuracion -- 1 sola fila con config editable desde el panel (colores, pagos, etc.)
categorias   -- id, nombre, slug, orden
cupones      -- id, codigo, tipo, valor, usos
```

RLS activado: productos activos son públicos para leer. Todo lo demás requiere auth.

---

## Lo que está PENDIENTE de construir

Construir en este orden:

### 1. app/catalogo/page.tsx
- Server component con ISR (revalidate = 60)
- Fetch todos los productos con getProductos()
- Grid responsivo: 2 cols mobile, 4 cols desktop
- Filtros client-side por categoría y por talle
- Usar producto-card, badge, btn-primario de globals.css
- URL params para filtros (?categoria=rugby&talle=L)

### 2. app/producto/[slug]/page.tsx
- generateStaticParams() con todos los slugs
- getProductoBySlug() para el producto
- Galería de imágenes con thumbnail selector
- Selector de variantes (talle + color si aplica)
- Validación de stock por variante desde producto.stock
- Botón "Agregar al carrito" → useCarrito().agregar()
- Sección de descripción completa

### 3. app/carrito/page.tsx
- Client component
- useCarrito() para leer items
- Controles de cantidad +/- por item
- Botón quitar por item
- Resumen: subtotal formateado
- CTA a /checkout
- Estado vacío con link a /catalogo

### 4. app/checkout/page.tsx + app/actions/crear-pedido.ts
- Paso 1: form con nombre, email, teléfono + selector de envío desde tenant.config.json
- Paso 2: selector de método de pago desde tenant.config.json
- Server action crear-pedido.ts:
  - Llama crearPedido() de lib/supabase.ts
  - Si MercadoPago: crea preferencia con SDK y redirige
  - Si transferencia: redirige a /checkout/gracias con datos del CBU

### 5. app/admin/login/page.tsx
- Form email + password
- supabase.auth.signInWithPassword()
- Redirect a /admin en éxito

### 6. app/admin/page.tsx
- Proteger con auth (redirect si no hay user)
- getStatsAdmin() para las 4 cards
- Tabla de últimos 10 pedidos con estados usando clases status-*
- Sidebar con links a /admin/productos y /admin/pedidos

### 7. app/admin/productos/page.tsx
- CRUD completo de productos
- Subida de imágenes a Supabase Storage
- Builder de variantes (agregar/quitar opciones de talle y color)
- Input de stock por cada combinación de variantes
- Toggle es_activo y es_destacado

### 8. app/admin/pedidos/page.tsx
- Lista de todos los pedidos con filtro por estado
- Click en pedido para ver detalle completo
- Selector para cambiar estado del pedido
- Campo para agregar número de tracking

---

## Contexto del negocio

- **Agencia:** Alpha Sites (@alphasitess) — La Plata, Argentina
- **Modelo:** Crear webs para emprendedoras chicas que usan Tiendanube
- **Diferencial:** Diseño custom, soporte humano, sin comisión por venta
- **Precio:** $80-120K ARS setup + $15-25K ARS/mes
- **Target:** 30 clientes = ~$600K ARS/mes recurrente
- **Stack elegida:** Vercel + Supabase (no Droplets propios hasta 25+ clientes)
- **Cliente demo:** Camisetas Zeus — rugby premium, La Plata

---

## Comandos útiles

```bash
npm run dev          # desarrollo local en localhost:3000
npm run build        # build de producción
npm run lint         # linter

# Instalar dependencias del proyecto
npm install @supabase/supabase-js @supabase/ssr zustand

# Supabase CLI (opcional, para migrations)
npx supabase init
npx supabase db push
```

---

## Notas finales para Claude Code

- Siempre revisar este archivo antes de crear o modificar cualquier componente
- Siempre usar CSS variables para colores, nunca hardcodear
- Siempre leer datos del cliente desde tenant.config.json
- El admin siempre protegido con Supabase Auth
- Server components para datos, client components para interactividad
- Cada página pública con export const revalidate = 60
- El diseño es dark, tipografía Anton/Oswald, estética sport premium
- Sin border-radius grandes, sin colores redondeados, sin Inter o Roboto