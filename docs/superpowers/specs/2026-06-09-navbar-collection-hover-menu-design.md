# Menú de categorías en hover sobre "COLECCION" (navbar)

**Fecha:** 2026-06-09
**Componente afectado:** `components/public/SiteHeader.tsx`

## Problema

Las páginas por categoría (`/coleccion/sol` → "Anteojos de sol", `/coleccion/recetados`
→ "Anteojos recetados") solo son accesibles entrando a un producto y clickeando la
palabra "Colección" en el breadcrumb. Desde el navbar, "COLECCION" lleva únicamente a la
colección **unificada** (`/#coleccion`, "Nuestra Coleccion" / todos los modelos), sin forma
de saltar directo a una categoría puntual.

El cliente pidió poder acceder a una colección particular desde el inicio. Solución
acordada: un menú desplegable en el hover de "COLECCION" en el navbar.

## Comportamiento

### Desktop
- "COLECCION" **sigue siendo un `<Link>` navegable** a `/#coleccion` (colección unificada).
  Click = navega, igual que ahora.
- En **hover** sobre "COLECCION" (o **focus** por teclado), aparece un panel desplegable
  debajo con los ítems de categoría: **Sol** (`/coleccion/sol`) y **Recetados**
  (`/coleccion/recetados`).
- El panel se cierra al sacar el mouse del área o perder el foco.

### Mobile (menú hamburguesa)
- En touch no hay hover. Las categorías van **expandidas e indentadas** debajo de
  "Coleccion": el usuario ve "Coleccion" y, debajo, "Sol" y "Recetados" como sub-links
  directos. Cada uno cierra el menú al ser clickeado (igual que los links actuales).

## Implementación

- **No** se usa el `DropdownMenu` de Base UI: su trigger es un `<button>`, y necesitamos
  que "COLECCION" siga siendo un link navegable. Se usa el patrón Tailwind
  **`group` + `group-hover` / `focus-within`**: el `<Link>` "COLECCION" y el panel viven en
  un contenedor `group relative`, y el panel se muestra/oculta con `opacity` +
  `pointer-events` al hacer hover o focus dentro del grupo.
- Las categorías se derivan de `CATEGORIES` + `CATEGORY_META` (`lib/category.ts`). Si se
  agrega una categoría nueva ahí, aparece automáticamente en el menú. Sin hardcodear labels
  ni slugs.
- Solo "Coleccion" obtiene el comportamiento de submenú; el resto de los ítems de
  `SITE_CONFIG.nav.public` (p. ej. "Nosotros") siguen renderizándose como links simples. Se
  detecta el ítem de colección por su `href` (`/#coleccion`).
- Estilo siguiendo el navbar existente: `text-[13px] uppercase tracking-[0.08em]`, colores
  `--color-ink` / `--color-ink-soft` / `--color-line` / `--color-bg`. Panel con borde sutil
  (`border-line`), fondo `bg-bg`, sombra leve y transición de opacidad.
- Accesibilidad: `focus-within` para operación por teclado; el panel mantiene
  `pointer-events-none` cuando está oculto para no capturar clicks invisibles. Se mantiene un
  área de hover contigua (sin gap muerto) entre el trigger y el panel para que no se cierre
  al mover el mouse hacia los ítems.

## Alcance

- Se modifica únicamente `components/public/SiteHeader.tsx`.
- `SITE_CONFIG.nav.public` y `lib/category.ts` quedan sin cambios.

## Fuera de alcance

- Cambiar a dónde navega el click en "COLECCION".
- Agregar un ítem "Ver todos" al desplegable.
- Animaciones complejas más allá de un fade de opacidad.
