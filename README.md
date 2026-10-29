# Avi Motta — UX Artist

Portfolio web personal e interactivo. Examen final de Programación Multimedial IV.

- **Sitio publicado:** https://portfolio-avi-phi.vercel.app/
- **Repositorio:** https://github.com/avimotta/portfolio-avi
- **Bitácora de proceso y registro de uso de IA:** [PROCESO.md](PROCESO.md)

## La propuesta

Soy UX Artist: diseño interfaces, identidades visuales y productos digitales, y la música y el arte influyen mucho en cómo trabajo. El portfolio presenta cuatro proyectos de diseño, y cada uno está representado por una canción. El visitante puede ver qué canción le corresponde a cada proyecto, escuchar un fragmento de 30 segundos e ir directamente al proyecto.

[completar: qué quiero que entienda o recuerde quien visita el portfolio, y a quién está dirigido]

| Proyecto | Canción |
|---|---|
| UMAI TV (streaming universitario) | Girls Just Want to Have Fun — Cyndi Lauper |
| JukeBox (app de ranking musical) | Espresso — Sabrina Carpenter |
| Babeblade (sitio de artista emergente) | Lo que pidas — Babeblade |
| folklore (landing de merch de Taylor Swift) | mirrorball — Taylor Swift |

El recorrido es: presentación (Hero), quién soy (About), la playlist de proyectos (On repeat), los cuatro proyectos y el contacto. Un menú fijo arriba permite saltar entre secciones y marca en cuál estás.

## Instalación y uso

Requisitos: **Node.js 22.23.4 o superior** (lo exige Astro 7.4; probado con Node 24.22.1) y npm.

```sh
git clone https://github.com/avimotta/portfolio-avi.git
cd portfolio-avi
npm install
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el sitio en modo desarrollo en `http://localhost:4321` |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` para revisarla antes de publicar |

El sitio no necesita variables de entorno ni claves: la API que usa es pública.

## Estructura

```text
src/
  pages/index.astro         la página: arma el sitio con los componentes y los datos
  components/
    Nav.astro               menú fijo y link "Skip to content"
    Hero.astro              nombre, rol y foto
    About.astro             texto de presentación
    OnRepeat.astro          playlist de proyectos y canciones (API)
    ProjectSection.astro    estructura de cada proyecto
    Contact.astro           mail y redes
  data/projects.js          lista de proyectos con su canción
public/
  css/style.css             estilos globales y sistema de lienzo
  js/main.js                animación de entrada del texto de About
  assets/                   imágenes
PROCESO.md                  bitácora de proceso y uso de IA
```

## Tecnologías y decisiones principales

- **Astro**, sin frameworks de componentes adicionales. El sitio es estático: Astro arma el HTML al construir, y el JavaScript que corre en el navegador es solo el de la playlist, el menú y la animación de About.
- **CSS propio, sin Tailwind.** El diseño original lo hice en Readymag y el CSS lo reconstruye con sus medidas exactas; una librería de utilidades no aportaba a eso.
- **Un sistema de lienzo para escritorio.** El diseño está dibujado sobre un ancho de 1024. La variable `--u` equivale a una unidad de ese lienzo (`100cqw / 1024`), y cada elemento se ubica con `--x`, `--y` y `--w` multiplicados por `--u`. Así la composición se mantiene igual en cualquier pantalla de escritorio.
- **Dos lienzos con una sección en flujo entre ellos.** Dentro de un lienzo todo tiene posición absoluta, y eso obliga a fijar su alto. Para las composiciones de los proyectos (mockups superpuestos, degradados) tiene sentido; para On repeat, cuyo contenido viene de una API, no. Por eso la página tiene un lienzo con Hero y About, On repeat en flujo normal (mide lo que ocupa su contenido) y un segundo lienzo con los proyectos y el contacto. El segundo lienzo conserva las coordenadas del diseño original y les resta 1065 con `--off`.
- **Los datos separados de la estructura.** Los proyectos y sus canciones están en `src/data/projects.js`. Los usan On repeat (la playlist) y Nav (el link "Works"): si se agrega un proyecto a la lista, aparece en la playlist y el menú lo reconoce.
- **Los links internos apuntan a los títulos** (`#p1-title`) y no a las secciones, porque en escritorio las secciones tienen `display: contents`: no ocupan lugar y el navegador no tendría adónde ir.

## Componentes

| Componente | Responsabilidad | Recibe |
|---|---|---|
| **OnRepeat** | Muestra la playlist de proyectos, busca la canción elegida en la API, maneja sus estados y reproduce el preview | `title`, `tracks` (la lista de `projects.js`) |
| **Nav** | Menú para recorrer las secciones; marca la sección actual | Lee `projects.js` |
| **ProjectSection** | Estructura común de los cuatro proyectos | `id`, `title`, `class`, `titleStyle`, `bodyStyle` y dos slots |
| Hero | Presentación: nombre, rol y foto | `firstName`, `lastName`, `role`, `photo`, `photoAlt` |
| About | Texto de presentación | `title`, `paragraphs` |
| Contact | Mail y links a redes | `title`, `email`, `links` |

Los tres primeros son los componentes relevantes de la propuesta, porque tienen lógica propia. Hero, About y Contact son componentes de presentación: separan los datos de la estructura, pero no tienen comportamiento.

**OnRepeat.** Astro arma la playlist en el HTML con `.map()`: un botón por proyecto, con los datos de su canción en atributos `data-`. Al elegir un track, el script muestra enseguida el título, el artista y el botón "See [proyecto] ↓" (salen de la lista, no de la API), y después pide la canción a la API para mostrar la carátula y el botón de play. Solo suena un preview a la vez. Ver el detalle en [API](#api-itunes-search-api).

**Nav.** Una pastilla fija arriba con cuatro links: About, On repeat, Works y Contact. "Works" agrupa los cuatro proyectos. Cada vez que hay scroll, el script busca el último título que pasó el 40 % de la altura de la pantalla y le pone `aria-current="true"` a su link. Usa `requestAnimationFrame` para no calcular más de una vez por cuadro. No usa IntersectionObserver porque las secciones, con `display: contents`, no se pueden observar.

**ProjectSection.** Arma la sección, el título y el bloque de texto. El material visual de cada proyecto, que es distinto en los cuatro (mockups de navegador y laptop, tres teléfonos, capturas), entra por el slot principal, y la descripción por el slot `body`.

## API: iTunes Search API

On repeat usa la [iTunes Search API](https://performance-partners.apple.com/search-api) de Apple. Es pública, no necesita clave y permite pedidos desde el navegador.

**Pedido.** Por cada canción: `https://itunes.apple.com/search?term=<título> <artista>&entity=song&limit=10`.

**Qué se usa de la respuesta.** De cada resultado: `trackName`, `artistName`, `collectionName`, `artworkUrl100` (la carátula, que se pide en 400 × 400) y `previewUrl` (el audio de 30 segundos).

**Cómo se elige el resultado.** La búsqueda puede devolver covers o canciones de nombre parecido. `findSong()` se queda con el primer resultado cuyo artista contenga el artista buscado y cuyo título contenga el título buscado, sin distinguir mayúsculas. Si ninguno coincide, devuelve `null`.

**Estados:**

| Estado | Cuándo | Qué se ve |
|---|---|---|
| Cargando | Mientras espera la respuesta | "Loading…", con título y artista ya visibles |
| Listo | Encontró la canción con preview | Carátula y botón de play |
| Vacío | No encontró la canción, o la encontró sin preview | "This song isn't available right now." o "There's no preview for this song." Título, artista y link al proyecto se siguen viendo |
| Error de límite | Respuesta 429 o 403 | Pide esperar un minuto y volver a elegir el track |
| Error de conexión | Sin red u otro error | Pide revisar la conexión y volver a elegir el track |
| Error de reproducción | El navegador no puede reproducir el preview | "Couldn't play this preview. Try again later." |

Los mensajes están en un elemento con `role="status"` y `aria-live="polite"`, para que los lectores de pantalla los anuncien.

**Límites y cómo se manejan.**

- La API admite alrededor de 20 pedidos por minuto. Cada resultado se guarda en una `cache` en memoria mientras dura la visita, así que elegir de nuevo un track no repite el pedido. También se guardan los "no encontrados" (`null`), y por eso se pregunta `index in cache` y no `cache[index]`.
- Si el usuario elige otro track antes de que llegue la respuesta del anterior, esa respuesta se descarta: cada pedido tiene un número (`token`) y solo se muestra el último.
- Un error no se guarda en la `cache`: al volver a elegir el track se intenta de nuevo.

## Responsive

- **Hasta 899 px (celular y tablet vertical):** el lienzo deja de existir y todo pasa a una columna en flujo normal, con tipografías fluidas (`clamp()`). En tablet, el contenido no pasa de 640 px y queda centrado (`padding-inline: max(20px, calc((100% - 640px) / 2))`), mientras los fondos de color ocupan todo el ancho. En On repeat, la carátula queda chica al lado del título y el botón al proyecto ocupa todo el ancho.
- **Desde 900 px (tablet acostada, notebook, monitor):** el lienzo escala proporcionalmente para conservar la composición del diseño original. En 1024 px se ve exactamente como el diseño.

Probado en: [completar: anchos y dispositivos probados, ver PROCESO.md]

## Accesibilidad

- Link "Skip to content" al principio de la página, visible al recibir foco con Tab.
- Foco visible en todos los elementos interactivos.
- Contraste medido con la fórmula de WCAG 2.1: todos los pares de texto y fondo pasan AA. El borde de foco cambia de color según el fondo (ink sobre lavanda y crema, crema sobre el indigo de contacto). El texto del hero, que va sobre la foto, se revisó a ojo.
- `aria-current` en el link del menú de la sección actual, y `aria-pressed` en el track elegido y en el botón de play.
- Mensajes de estado de la API anunciados con `aria-live`.
- Textos alternativos en las imágenes con contenido; las decorativas tienen `alt=""` y `aria-hidden`.
- Cada sección está asociada a su título con `aria-labelledby`, y los links a Behance tienen un `aria-label` que dice a qué proyecto llevan.
- Los textos de los links dicen adónde llevan ("See UMAI TV", no "See project").
- `scroll-margin-top` en los títulos, para que al saltar a uno no quede debajo del menú.
- Se respeta `prefers-reduced-motion` en todas las animaciones: sin scroll suave, los textos aparecen sin animación de entrada, las imágenes muestran la sombra al pasar el mouse sin moverse y la carátula de On repeat no gira. El estado de reproducción no depende del giro: lo indica el botón con `aria-pressed`.
- En celular, los botones de On repeat miden al menos 44 px de alto.

## Limitaciones conocidas y posibles mejoras

- **Los lienzos tienen alto fijo**, porque adentro todo tiene posición absoluta. Si un texto de Hero, About o de los proyectos crece mucho, no empuja lo de abajo.
- **En escritorio el diseño escala, pero no se reorganiza.** Una mejora sería rehacer el escritorio con flex o grid para que se adapte de otra manera en monitores grandes.
- **Los links del menú miden unos 29 px de alto en celular**: superan el mínimo de 24 px de WCAG 2.2, pero no los 44 px recomendados. Se priorizó que el menú fuera sutil.
- **El error por límite de pedidos (429) no se pudo probar en el navegador**: se revisó leyendo el código.
- **Los textos con animación de entrada dependen de JavaScript**: empiezan invisibles y los hace aparecer `main.js`. Si el JavaScript fallara, no se verían.
- **On repeat necesita JavaScript** para la carátula y el audio. Sin JavaScript se ven la playlist, la canción del primer proyecto y su link.
- **El sitio está solo en inglés.**
- **Los proyectos todavía no se generan desde `projects.js`**: su material visual está escrito en `index.astro`. Pasarlos a la lista permitiría agregar un proyecto en un solo lugar.

## Proceso y uso de IA

La bitácora completa, con decisiones, alternativas descartadas, problemas y pruebas, está en [PROCESO.md](PROCESO.md).

Resumen del uso de IA (el detalle está en la sección "Uso de inteligencia artificial" de la bitácora):

- **opencode:** primera versión del sitio en HTML, CSS y JavaScript, a partir de mi diseño en Readymag.
- **Claude (chat):** análisis de la consigna, plan de trabajo y guía paso a paso de la migración a Astro.
- **Claude Code:** revisión del proyecto contra la consigna, propuestas de alternativas y escritura de parte del código (la playlist, la estructura de dos lienzos, Nav, los ajustes de responsive) y de la documentación. Le pedí que me explicara cada cambio antes de hacerlo y esperara mi aprobación; las pruebas en el navegador las hice yo.

Las decisiones de concepto, diseño y estructura fueron mías: entre ellas, que cada proyecto tenga una canción y cuál, resolverlo como playlist, dónde va la sección, no aceptar alturas fijas para On repeat y un menú sutil. [completar: revisar y ajustar este resumen]

## Créditos y licencias

- **Diseño, textos, fotografía e imágenes de los proyectos:** propios. [completar: confirmar, y aclarar si algún material de los proyectos usa imágenes o marcas de terceros]
- **Tipografías:** [Inter](https://fonts.google.com/specimen/Inter) y [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), de Google Fonts, con licencia SIL Open Font License.
- **Datos, carátulas y previews de las canciones:** iTunes Search API, de Apple. Son propiedad de Apple y de sus titulares de derechos; se muestran y reproducen desde los servidores de Apple, sin descargarlos ni guardarlos.
- **Framework:** [Astro](https://astro.build), licencia MIT.
