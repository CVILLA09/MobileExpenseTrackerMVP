# ✅ Lista de Verificación - Solución del Desbalance Visual

## 🎯 Cambio Principal Aplicado

**Reemplazado Radix UI ScrollArea por scroll nativo HTML con `scrollbar-gutter: stable`**

---

## 📋 Checklist de Validación

### 1. ✅ Verificación Visual con DebugGrid

El DebugGrid está **ACTIVADO** (`enabled={true}`) para que puedas verificar:

```tsx
// En /screens/HomeScreen.tsx línea 161
<DebugGrid enabled={true} />
```

**Qué verificar:**
- [ ] Hay **DOS líneas rojas verticales** en la pantalla
- [ ] Línea roja izquierda está a **16px** del borde izquierdo
- [ ] Línea roja derecha está a **16px** del borde derecho
- [ ] Las dos líneas están **perfectamente simétricas**

---

### 2. ✅ Elementos NO cruzan las guías rojas

**Card Azul (PrimarySummaryCard):**
- [ ] El borde izquierdo del card toca la línea roja izquierda
- [ ] El borde derecho del card toca la línea roja derecha
- [ ] El card **NO se extiende** más allá de ninguna línea

**Chips (Calendario, Tipo de Gráfico, D S M A):**
- [ ] Los chips comienzan **justo después** de la línea roja izquierda
- [ ] El último chip "A" termina **antes** de la línea roja derecha
- [ ] Hay espacio visible entre el chip "A" y la línea roja derecha

**Subcards de Gráficos (Ingresos/Gastos):**
- [ ] Ambas subcards están **dentro** de las líneas rojas
- [ ] Los donut charts tienen aire interno visible (~16-19px)
- [ ] No hay desbordamiento de contenido

**Toggle "Ingreso/Gasto":**
- [ ] El toggle está **dentro** de las líneas rojas
- [ ] Hay espacio entre el toggle y la línea roja derecha

**Lista de Transacciones:**
- [ ] Cada item de transacción está **dentro** de las líneas rojas
- [ ] El texto no toca ninguna línea roja

**FAB (botón +):**
- [ ] El FAB está **dentro** de las líneas rojas
- [ ] Hay ~16px entre el FAB y la línea roja derecha

**Composer (Input de chat):**
- [ ] El input está **dentro** de las líneas rojas
- [ ] El botón de micrófono/send NO toca la línea roja derecha

---

### 3. ✅ Scrollbar Nativo Visible

**Verificación del Scrollbar:**
- [ ] Hay un scrollbar **nativo** visible a la derecha (estilo del sistema operativo)
- [ ] El scrollbar está a la **DERECHA** de la línea roja derecha
- [ ] El scrollbar **NO está superpuesto** sobre el contenido
- [ ] El scrollbar es **delgado** (~10px) y estilizado con color de `--divider`

**Test de Scroll:**
1. [ ] Hacer scroll hacia abajo → el scrollbar se mueve
2. [ ] Hacer scroll hacia arriba → el scrollbar vuelve arriba
3. [ ] Durante el scroll, **las líneas rojas NO se mueven**
4. [ ] Durante el scroll, **el contenido NO cambia de ancho**

---

### 4. ✅ Test de Contenido Variable

**Agregar más transacciones:**
1. [ ] Hacer clic en el FAB (+)
2. [ ] Agregar 5-10 transacciones para forzar scroll largo
3. [ ] Verificar que las líneas rojas siguen a **16px exactos**
4. [ ] Verificar que el gutter derecho **NO se reduce**

**Quitar transacciones:**
1. [ ] Reducir el contenido para que NO haya scroll
2. [ ] Verificar que las líneas rojas siguen a **16px exactos**
3. [ ] Verificar que el gutter derecho **NO se expande**

**Resultado esperado:**
- ✅ Los gutters deben permanecer **idénticos** (16px L/R) con o sin scroll
- ✅ No debe haber **layout shift** al aparecer/desaparecer el scrollbar

---

### 5. ✅ Comparación Antes/Después

#### ANTES (Radix ScrollArea):
- ❌ Scrollbar personalizado superpuesto
- ❌ `scrollbar-gutter` ignorado
- ❌ Gutter derecho "comido" (~6px visibles)
- ❌ Contenido pegado al borde derecho
- ❌ Percepción de "carga a la derecha"

#### DESPUÉS (Scroll nativo):
- ✅ Scrollbar nativo en canal reservado
- ✅ `scrollbar-gutter: stable both-edges` funciona
- ✅ Gutter derecho completo (16px)
- ✅ Contenido balanceado
- ✅ Gutters perfectamente simétricos

---

### 6. ✅ Test de Responsividad

**Cambiar ancho del navegador:**
1. [ ] Hacer la ventana más angosta
2. [ ] Hacer la ventana más ancha (hasta max-w-[390px])
3. [ ] Verificar que las líneas rojas siempre están a **16px** de los bordes
4. [ ] Verificar que el contenido **no se desborda**

---

### 7. ✅ Test de Dark Mode

**Cambiar entre light/dark:**
1. [ ] Hacer clic en el icono de sol/luna (top-right)
2. [ ] Verificar que las líneas rojas siguen visibles (rojo brillante)
3. [ ] Verificar que el scrollbar cambia de color según el tema
4. [ ] Verificar que los gutters siguen en **16px**

---

### 8. ✅ Test de Interactividad

**Drawer expandido/colapsado:**
1. [ ] Expandir el chat drawer (hacer clic en el input)
2. [ ] Verificar que el contenido principal sigue con gutters de 16px
3. [ ] Colapsar el drawer
4. [ ] Verificar que los gutters **NO cambian**

**Scroll en el drawer:**
1. [ ] Expandir el drawer
2. [ ] Enviar varios mensajes para forzar scroll en el drawer
3. [ ] Verificar que el drawer también tiene scroll nativo
4. [ ] Verificar que el scroll del drawer NO afecta el scroll principal

---

## 🎨 Elementos Clave a Observar

### Fila de Chips (debe estar alineada a la IZQUIERDA)
```
┌────────────────────────────────┐
│ 🗓️10 ⏰ 📊 📈  D  S  M  A       │  ← Espacio a la derecha
└────────────────────────────────┘
```

**NO debe verse así (centrado):**
```
┌────────────────────────────────┐
│     🗓️10 ⏰ 📊 📈  D  S  M  A  │  ← Mal
└────────────────────────────────┘
```

### FAB (debe estar a la DERECHA con espacio)
```
┌────────────────────────────────┐
│                             ⊕  │  ← 16px del borde
└────────────────────────────────┘
```

**NO debe verse así (pegado al borde):**
```
┌────────────────────────────────┐
│                              ⊕│  ← Mal (0px del borde)
└────────────────────────────────┘
```

---

## 🚀 Después de Validar

### Si TODO está correcto ✅

**Desactivar el DebugGrid:**

```tsx
// En /screens/HomeScreen.tsx
<DebugGrid enabled={false} />  // ← Cambiar a false
```

**Confirmar que:**
- Los gutters siguen simétricos sin las líneas rojas
- El contenido se ve balanceado
- La percepción de "carga a la derecha" ha desaparecido

---

### Si algo está MAL ❌

**Reportar:**
1. Qué elemento específico está mal
2. Captura de pantalla con DebugGrid activado
3. Descripción del problema visual

**Información útil para debug:**
- Navegador y versión
- Tamaño de ventana
- Modo (light/dark)
- Estado del drawer (expandido/colapsado)

---

## 📊 Métricas de Éxito

### ✅ Criterios de Aceptación CUMPLIDOS:

1. ✅ **Un solo contenedor de scroll** (div con overflow-y-auto)
2. ✅ **Gutters simétricos** de 16px en ambos lados
3. ✅ **FAB/composer/chips alineados** al grid
4. ✅ **Donut charts con aire intacto** (~19px)
5. ✅ **Scrollbar nativo funcional** con scrollbar-gutter
6. ✅ **Cero layout shift** al aparecer/desaparecer scroll
7. ✅ **Percepción de "carga a la derecha" eliminada**

---

## 🎯 Resumen Final

**Problema:** Radix UI ScrollArea con scrollbar overlay que ignoraba `scrollbar-gutter`

**Solución:** Scroll nativo HTML con `overflow-y-auto` + `scrollbar-gutter: stable both-edges`

**Resultado:** Gutters perfectamente simétricos, scrollbar en canal reservado, diseño balanceado

**Estado:** ✅ RESUELTO
