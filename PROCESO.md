Bitácora de proceso — Portfolio de Avi Motta

Examen final de Programación Multimedial IV. Entrega: 19 de noviembre de 2026.

Esta bitácora se va completando a medida que avanza el proyecto. Los textos entre [corchetes] son datos que tengo que completar yo con lo que realmente pasó.

1. Punto de partida

Problema de comunicación que quiero resolver: [completar: qué quiero que entienda alguien que visita mi portfolio, y a quién me dirijo]

Diseño original. El diseño base lo hice yo en Readymag. La primera versión en código reconstruyó ese diseño en HTML, CSS y JavaScript puro, y esta versión lo traslada a Astro.

Primera versión. Armé el portfolio completo con la herramienta de IA opencode, en HTML, CSS y un único archivo de JavaScript, sin frameworks. El sitio presenta mi perfil como UX Artist y cuatro proyectos de diseño: una plataforma de streaming universitario, una app de ranking musical, el sitio de un artista emergente y una landing de merchandising.

Qué pedí a la IA y qué decidí yo: [completar: qué instrucciones le di a opencode, qué referencias usé, qué elegí yo del resultado]

2. 26 de octubre — Descubro que faltan requisitos

Releí la consigna del examen y vi que mi proyecto no cumplía varios requisitos obligatorios. No había leído la consigna completa antes de empezar.

Comparación de la consigna con el proyecto en ese momento:

Requisito	Estado
AstroJS	No cumple (HTML plano)
Tres componentes propios relevantes	No cumple (todo en un solo index.html)
Interacción significativa	No cumple (solo una animación al entrar en pantalla)
API externa o fuente dinámica	No cumple
Estados pertinentes (carga, error, vacío)	No cumple
Responsive	Por verificar
Deploy	Cumple (Vercel), falta el enlace limpio de producción
Repositorio con historial	Cumple, por verificar el historial
README, evidencia de proceso, registro de IA	Pendiente

Decisión: migrar el proyecto existente a Astro en lugar de empezar de cero, reutilizando el contenido, los estilos y los recursos, y sumar lo que falta. [completar: por qué elegí migrar y no rehacer]

Plan por semanas:

Migrar a Astro y dejar el sitio funcionando.
Partir en componentes e integrar la API con sus estados.
Interacción significativa, responsive y accesibilidad.
README, evidencia, registro de IA y preparación de la defensa.
3. 26 de octubre — Migración a Astro

Pasos realizados:

Creé un proyecto nuevo con npm create astro@latest usando la plantilla vacía.
Copié las carpetas assets, css y js a public/, para que Astro las sirva sin procesarlas.
Pasé el contenido del index.html a src/pages/index.astro, agregando el bloque de código inicial delimitado por ---.
Cambié la etiqueta del script a <script is:inline src="/js/main.js" defer> para que Astro no lo procese.
Pasé el proyecto Astro al repositorio portfolio-avi, en una rama nueva llamada astro, y lo subí a GitHub. La rama main sigue con la versión vieja en HTML hasta que unamos las dos.

Problemas encontrados y cómo los resolví:

npm run dev fallaba con "Missing script: dev". Estaba ejecutando el comando en la carpeta equivocada. Había que correrlo dentro de portfolio-astro, no en la carpeta contenedora.
Astro no arrancaba: "Node.js v22.18.0 is not supported". La versión de Astro instalada (7.4.2) exige Node >=22.23.4. Actualicé Node a la v24.22.1 con el instalador .pkg de nodejs.org y volvió a funcionar.
Al pegar el contenido de index.html pegué solo el texto visible, sin las etiquetas. Lo resolví copiando el código fuente real del archivo.
4. 26 de octubre — Primer componente: ProjectSection

Problema. Los cuatro proyectos de la página repetían la misma estructura (sección, título, material visual y texto descriptivo), copiada cuatro veces en el index.astro.

Decisión. Creé el componente ProjectSection.astro, que arma la estructura y recibe como datos el título, el id y los estilos de posición. El contenido que cambia en cada proyecto (imágenes, mockups, texto) entra por slots: uno principal y otro con nombre (body) para el texto.

Por qué. Un solo lugar donde cambiar la estructura, menos código repetido, y la base para después alimentar los proyectos desde una lista de datos.

Cómo lo verifiqué. Migré primero el proyecto 3 (el más simple) y comprobé en el navegador que se veía idéntico. Después migré los otros tres de a uno, revisando cada vez.

Descubrimiento. Al revisar mi style.css vi que el diseño ya tenía versión para celular: un bloque @media (max-width: 899px) que apila todo en una columna con tipografías fluidas. Había asumido que el diseño con posiciones fijas no era responsive y no era así. Por eso decidí no tocar el CSS por ahora y componentizar primero.

Pendiente de este tramo. De 900 px para arriba el diseño escala proporcionalmente, y la consigna pide más que reducir el contenido. Lo voy a revisar más adelante en tablet y pantallas grandes.

5. 26 de octubre — Componentes Hero, About y Contact

Problema. El hero, el texto de presentación y el contacto seguían escritos a mano dentro del index.astro, mezclados con el resto de la página.

Decisión. Creé tres componentes, uno por sección, que reciben sus datos por props desde el index.astro:

Hero.astro recibe nombre, apellido, rol, foto y texto alternativo de la foto.
About.astro recibe un título y un array de párrafos, y genera un <p> por cada uno con .map().
Contact.astro recibe un título, el mail y un array de links. Genera un botón por link con .map() y calcula su posición vertical con 5499 + i * 61, así cada botón queda 61 unidades más abajo que el anterior.

Por qué. Los textos y links quedan como datos en un solo lugar (el index.astro) y la estructura en el componente. Para agregar un link o un párrafo alcanza con sumar un elemento al array.

Cómo lo verifiqué. [completar: cómo comprobé que se veía igual que antes]

Límite que reconozco. Hero y About solo muestran los datos que reciben, sin lógica propia. La consigna aclara que los bloques sin lógica no cuentan como componentes relevantes, así que no los voy a presentar como mis tres componentes principales.

6. 28 de octubre — Sección On repeat con la iTunes Search API

Problema. El portfolio no consumía ninguna API ni fuente dinámica, que es un requisito obligatorio.

Decisión. Creé el componente OnRepeat.astro, que muestra botones con artistas y, al elegir uno, pide sus canciones a la iTunes Search API de Apple y muestra hasta seis con su carátula y un botón para escuchar el preview de 30 segundos. [completar: por qué elegí la iTunes Search API y no otra, por ejemplo que no pide clave ni registro]

Qué pide y qué recibe. Hace un pedido a https://itunes.apple.com/search con term (el nombre del artista), entity=song, attribute=artistTerm y limit=25. Cada resultado trae, entre otros datos, trackName (canción), collectionName (álbum), artworkUrl100 (carátula) y previewUrl (audio de 30 segundos).

Cómo funciona el código:

clean() se queda con canciones que tengan nombre, descarta las repetidas y corta en seis.
cache guarda los resultados de cada artista ya pedido, para no volver a pedirlos. La API limita a unos 20 pedidos por minuto.
token numera cada pedido. Si llega la respuesta de un artista anterior cuando el usuario ya eligió otro, se descarta.
Solo suena un preview a la vez: al tocar otro, el anterior se pausa.

Estados que maneja (se muestran en un texto con role="status" y aria-live="polite", para que los lectores de pantalla los anuncien):

Cargando: "Loading…" mientras espera la respuesta.
Contenido disponible: se muestran las tarjetas.
Vacío: "No songs found for this artist." si no hay resultados.
Error de límite (respuesta 429 o 403): pide esperar un minuto y volver a tocar el artista.
Error general (sin conexión u otro código): pide revisar la conexión.
Error de reproducción: si el preview no se puede reproducir.

Cambios en el lienzo de escritorio. Para hacerle lugar a la sección bajé el contacto 1100 unidades (--shift:1100), agrandé el alto de la página de 5724 a 6824 (--page-h:6824) y moví la banda índigo de 4889 a 5989. Agregué en style.css un bloque @media (min-width: 900px) que aplica ese desplazamiento al contacto.

Problemas encontrados y cómo los resolví: [completar]

Problema detectado después. En el index.astro la sección está entre About y el proyecto 1, pero en escritorio se ve después del proyecto 4 (por su posición absoluta) y en celular se ve antes de los proyectos. Además, el orden del teclado y de los lectores de pantalla sigue el orden del código. Lo resuelvo en el próximo paso.

Uso de IA en este tramo: [completar: si escribí OnRepeat yo, con IA o mezclando, y qué partes revisé o cambié]

7. 28 de octubre — Nuevo concepto: cada proyecto es una canción

Idea. Cambiar el concepto de On repeat: en lugar de una lista de artistas que me gustan, cada trabajo del portfolio está simbolizado por una canción que lo representa. El visitante puede ver cuál es y escuchar su preview de 30 segundos desde la iTunes Search API.

Canciones elegidas:

UMAI TV (streaming universitario): Girls Just Want to Have Fun — Cyndi Lauper
JukeBox (app de ranking musical): Espresso — Sabrina Carpenter
Emerging Artist's Website (Babeblade): Lo que pidas — Babeblade
folklore (landing de merch de Taylor Swift): mirrorball — Taylor Swift

Para UMAI TV primero había elegido Vogue de Madonna y la cambié por Girls Just Want to Have Fun de Cyndi Lauper. [completar: por qué]

Por qué. [completar: por qué la música como hilo del portfolio y por qué cada canción representa a su proyecto]

Requisitos que me pongo. Los datos de cada proyecto y su canción tienen que vivir en una lista de datos, no escritos a mano en el HTML, y se tienen que seguir manejando los estados de carga, error y vacío.

Verificación en iTunes (28/10). Antes de escribir el código abrí en el navegador la búsqueda de cada canción en la API (term con título y artista, entity=song, limit=10) y comprobé que las cuatro aparecen con su artista y su previewUrl.

Girls Just Want to Have Fun — Cyndi Lauper	resultCount [n]	previewUrl [sí/no]	[observaciones]
Espresso — Sabrina Carpenter	resultCount [n]	previewUrl [sí/no]	[observaciones]
Lo que pidas — Babeblade	resultCount [n]	previewUrl [sí/no]	[observaciones]
mirrorball — Taylor Swift	resultCount [n]	previewUrl [sí/no]	[observaciones]

Alternativas que consideré:

1. Una canción dentro de cada proyecto, al lado de su material visual. Es la lectura más directa del concepto, pero en escritorio obligaba a ubicar cuatro elementos nuevos en el lienzo absoluto y a deshacer el desplazamiento del contacto.
2. El portfolio como playlist: la sección On repeat muestra los cuatro proyectos como tracks y, al elegir uno, su canción con carátula, preview y un link al proyecto.
3. La playlist más otras canciones del mismo artista. Suma contenido, pero necesita un segundo pedido por track, más estados y le quita peso a la canción de cada proyecto.

Elegí la 2. [completar: por qué]

Cómo quedó:

src/data/projects.js tiene la lista: cada proyecto con su id (p1 a p4, el mismo que su ProjectSection), un nombre corto y su canción (título y artista).
index.astro importa la lista y se la pasa a OnRepeat por la prop tracks.
OnRepeat arma la playlist en el HTML con .map(): un botón por proyecto con los datos de la canción en atributos data-. Así la lista existe aunque falle el JavaScript o la API.
Al elegir un track, el script muestra enseguida el título, el artista y el link "See project", que salen de la lista. Después pide la canción a la API con el título y el artista, y findSong() se queda con el primer resultado de ese artista con ese título, porque la búsqueda también puede devolver covers o canciones de nombre parecido.
Solo la carátula y el botón de play dependen de la API.

Estados:

Cargando: "Loading…", con título y artista ya visibles.
Listo: carátula y botón de play.
Vacío: "This song isn't available right now." si no encuentra la canción, o "There's no preview for this song." si la encuentra sin audio. Título, artista y link se siguen viendo.
Error de límite (429 o 403), error de conexión y error de reproducción, con los mismos criterios que la versión anterior.

Detalles técnicos que tuve que resolver:

La carátula y el botón de play se esconden con el atributo hidden, pero style.css tiene img { display: block }, que le gana a hidden. Agregué .s-repeat [hidden] { display: none } para que funcione dentro de la sección.
La cache guarda también los "no encontrados" (null), para no volver a pedirlos. Por eso se pregunta index in cache y no cache[index], que daría falso con null.
El link "See project" apunta al título del proyecto (#p1-title) y no a la sección, porque en escritorio la sección tiene display: contents, no ocupa lugar y el navegador no tiene adónde ir.

Pendiente: probar en el navegador los estados y la reproducción con la nueva versión (pruebas B y C) y anotar los resultados.

8. 28 de octubre — On repeat después de About y más jerarquía para el link al proyecto

Cambio de decisión. Primero había puesto On repeat entre el proyecto 4 y el contacto. Al verla funcionando decidí moverla después de About, para que quien visita el portfolio la encuentre desde el principio y funcione como presentación de los proyectos que vienen después. [completar con mis palabras]

Problema. En celular alcanzaba con mover el componente en el index.astro, porque ahí todo sigue el orden del código. En escritorio cada elemento está ubicado en el lienzo con su --y, así que había que abrir un hueco después de About y bajar todo lo que viene debajo.

Cómo lo resolví:

En style.css, .w y .t suman al top un desplazamiento opcional: top: calc((var(--y) + var(--off, 0)) * var(--u)). Si nadie define --off vale 0, así que Hero, About y Contact no cambian.
En escritorio, .s-project { --off: var(--shift, 0); } baja los cuatro proyectos sin tocar ninguno de sus --y. Las variables CSS se heredan aunque la sección tenga display: contents.
On repeat empieza en 1065 (donde terminaba About) y su alto es --shift, el mismo valor que bajan los proyectos y el contacto. Un solo número decide cuánto mide la sección y cuánto baja lo que viene después.
Las bandas de color y los degradados no están dentro de las secciones, así que los corrí a mano: la primera lavanda se estira para cubrir On repeat y lo demás baja 1100.

Límite que reconozco. --page-h, las bandas y los degradados tienen los números escritos a mano: si cambio --shift, también los tengo que actualizar.

Link al proyecto. El link "See project" pasaba desapercibido. Lo convertí en un botón índigo debajo del artista, con el nombre del proyecto en el texto ("See UMAI TV ↓"). Así dice adónde lleva, y un lector de pantalla no lee cuatro veces "See project". La flecha anticipa que la página baja y tiene aria-hidden, para que no se lea. En celular el botón ocupa todo el ancho y mide al menos 48 px de alto, para tocarlo fácil.

Pendiente: probar en 900 px (que el texto de About no pise On repeat), 1280 px, 1920 px y 375 px, y revisar si la frase "Keep scrolling and find my works!" del About sigue teniendo sentido ahora que lo siguiente es la playlist.

9. 28 de octubre — Dos lienzos: On repeat deja de tener alto fijo

Problema. No me cerraba que todas las alturas fueran fijas. La solución de la entrada anterior funcionaba, pero era un parche: On repeat medía 1100 escrito a mano, y si su contenido crecía no empujaba nada, se superponía con lo de abajo.

Por qué pasaba. El diseño reconstruye Readymag como un lienzo: cada elemento tiene position: absolute y un --y. Un elemento con posición absoluta sale del flujo, no empuja a los de abajo y su contenedor no sabe cuánto mide. Por eso el lienzo necesita un alto escrito a mano. Para las composiciones de los proyectos tiene sentido, porque es lo que permite superponer mockups y degradados; para una sección con contenido dinámico, no.

Alternativas que consideré:

1. Seguir con el lienzo y calcular los números en el frontmatter de Astro a partir de una constante. Era el cambio más chico, pero las alturas seguían fijas.
2. Partir la página en dos lienzos y dejar On repeat entre los dos, en flujo normal.
3. Rehacer todo el escritorio en flujo (flex o grid), sin posiciones absolutas. No habría ninguna altura fija, pero era rehacer gran parte del CSS con riesgo de perder la composición del diseño original.

Elegí la 2. [completar: por qué]

Cómo quedó:

Lienzo 1 (Hero y About) mide 1100. En el original About terminaba en 1065, pero dejé margen porque el texto de About tiene tamaño fijo y en pantallas angostas termina cerca de ese punto; el lienzo recorta lo que se pasa de su alto.
On repeat va entre los dos lienzos, en flujo normal, y mide lo que ocupa su contenido.
Lienzo 2 (proyectos y Contact) usa las coordenadas del diseño original. Tiene --off:-1065, que resta 1065 a cada --y y --by (el punto donde empezaba el proyecto 1), y mide lo que faltaba del original: 5724 - 1065 = 4659.
--u ahora se define en main y no en cada lienzo, para que On repeat, que quedó afuera, también la pueda usar.
Desaparecieron los parches de la entrada anterior: --shift, el --off de los proyectos y el bloque que posicionaba Contact aparte. Las bandas y los degradados volvieron a sus números originales.

Rediseño de On repeat. Se veía demasiado grande y desconectada del resto. Ahora usa la misma columna que About (174 de margen a cada lado del lienzo de 1024, 676 de ancho), el mismo estilo de título y el mismo texto. La playlist pasó de cajas con borde a filas separadas por una línea fina, y la carátula de 380 a 220. En celular la carátula queda chica, al lado del título, y el botón al proyecto ocupa todo el ancho.

Límites que reconozco. Los dos lienzos siguen teniendo alto fijo, porque adentro todo es absoluto; pero son composiciones que no cambian. De 900 px para arriba el diseño sigue escalando proporcionalmente (pendiente del responsive de escritorio).

Punto de vuelta. Antes de este cambio hice un commit (96dbc91) con la versión anterior, para poder volver si no me gustaba el resultado.

Pruebas: [completar: uniones de color en 900, 1280 y 1920 px; proyectos y Contact iguales que antes; About sin cortes en 900 px; zoom al 200 % (On repeat crece y empuja los proyectos); celular en 375 px]

10. 28 de octubre — Navegación: componente Nav

Problema. No había ninguna forma de recorrer las secciones, y la consigna pide una navegación clara.

Alternativas que consideré:

1. Una barra fija arriba con los nombres de las secciones. Es lo más claro, pero puede tapar el hero.
2. Un índice vertical de puntos o números al costado. Es más editorial, pero menos obvio para quien no lo conoce.
3. Un botón "Menu" que abre un panel. Es lo más limpio, pero agrega estados para resolver (abierto, cerrado, foco, tecla Esc).

Elegí la 1, pero sutil para no tapar el hero. [completar: por qué]

Cómo quedó. No es una barra de lado a lado sino una pastilla chica, centrada arriba, con fondo crema semitransparente y desenfoque (backdrop-filter), para que se lea sobre la foto, la lavanda y el índigo sin ser un bloque sólido. Tiene cuatro links: About, On repeat, Works y Contact.

Por qué "Works" agrupado. Con un link por proyecto serían siete y no entran en un celular. Además, la playlist de On repeat ya funciona como índice de los proyectos. "Works" lleva al proyecto 1 y queda marcado mientras se ve cualquiera de los cuatro. Los títulos que agrupa salen de src/data/projects.js, así que si agrego un proyecto, Works lo reconoce solo.

Cómo marca la sección actual. Cada vez que hay scroll, el script busca el último título que pasó el 40 % de la altura de la pantalla y le pone aria-current="true" a su link. Usa requestAnimationFrame para no calcular más de una vez por cuadro. Primero iba a usar IntersectionObserver, pero en escritorio las secciones tienen display: contents y no ocupan lugar, así que el observer no las puede mirar; por eso se miran los títulos con getBoundingClientRect.

Accesibilidad:

Un link "Skip to content", escondido, que aparece con la primera tecla Tab y lleva al <main>. El <main> tiene tabindex="-1" para que el foco se mueva de verdad, también en Safari.
aria-current en el link activo, para que los lectores de pantalla lo anuncien.
scroll-margin-top en los títulos, para que al saltar a uno no quede escondido debajo del menú.
El link activo usa el mismo lenguaje visual que el track elegido en On repeat (fondo índigo, texto crema).

Límite que reconozco. En celular cada link mide unos 29 px de alto. Supera el mínimo de 24 px de WCAG 2.2, pero está por debajo de los 44 px recomendados. Lo elegí así para que el menú sea sutil; si al probarlo cuesta tocarlo, lo agrando.

Pruebas: [completar: que no tape el hero en 375 px y en escritorio; que se marque la sección correcta al hacer scroll, incluido Works en los cuatro proyectos y Contact al final; que cada link lleve al título sin taparlo; Skip to content con Tab; legibilidad sobre cada fondo]

11. 28 de octubre — Responsive: tablet y pantallas grandes

Problema. La consigna dice que no alcanza con que el contenido se reduzca. El celular ya tenía su versión en columna, pero faltaba revisar los demás tamaños.

Propuesta descartada. Primero se propuso usar la versión en columna hasta unos 1100 px, para cubrir la tablet acostada. Al revisar el CSS se vio que habría sido un error: la versión en columna está pensada para celular (imágenes a todo el ancho, textos sin ancho máximo) y en 1024 px quedarían imágenes enormes y renglones larguísimos. Además, 1024 px es justo el ancho para el que está dibujado el lienzo: ahí se ve exactamente como el diseño.

Qué pasaba en cada ancho:

375 a 600 px (celular): columna. Bien.
600 a 899 px (tablet vertical, por ejemplo iPad de 768): la misma columna estirada, con imágenes de unos 730 px y renglones de más de 100 caracteres. Se leía mal.
900 a 1440 px (tablet acostada, notebook): el lienzo, cerca de su tamaño original. Bien.
Más de 1440 px (monitor grande): el lienzo escala y todo se ve más grande, pero el texto de About no escalaba: quedaba en 16 px mientras los textos de los proyectos llegaban a unos 34 px en 1920.

Cambios:

En la versión en columna, cada sección tiene padding-inline: max(20px, calc((100% - 640px) / 2)). En celular el margen sigue siendo 20 px; en tablet crece lo necesario para que el contenido no pase de 640 px y quede centrado, mientras el fondo de color sigue ocupando todo el ancho. On repeat usa la misma regla.
El texto de About ahora mide calc(16 * var(--u)) en escritorio: en 1024 px mide lo mismo que antes y en pantallas grandes escala como el resto. En celular vuelve a 16 px fijos, porque ahí --u es muy chica. La intro de On repeat hace lo mismo.

Decisión. En escritorio mantengo que el lienzo escale proporcionalmente de 900 px en adelante, para conservar la composición del diseño de Readymag. [completar: por qué]

Pruebas: [completar: 375, 768, 899, 1024 y 1920 px; en 768 la columna centrada con fondos de lado a lado; en 1920 About proporcionado con los proyectos y sin la última línea cortada]

12. 28 de octubre — Animaciones

Problema. El sitio tenía una sola animación (la entrada del texto de About). Quería darle más vida al recorrido, pero con animaciones que tuvieran que ver con el concepto y no fueran solo decoración.

Opciones que consideré: A) entrada de los proyectos al hacer scroll; B) un ecualizador animado en el track que suena; C) la carátula girando como un vinilo mientras suena; D) elevación de las imágenes al pasar el mouse. Elegí A, C y D. [completar: por qué]

A. Entrada de los textos. Reusa la misma animación de About (el bloque entra bajando y apareciendo), así todo el sitio tiene un solo lenguaje de movimiento. main.js ya animaba todo lo que tuviera la clase reveal, así que solo hubo que agregar esa clase. Primero la puse en los títulos, los textos y las imágenes de los proyectos, pero se veía demasiado lleno de animaciones y poco fluido, así que la dejé solo en los títulos y los textos (desde ProjectSection, para los cuatro proyectos a la vez).

D. Elevación de las imágenes. Al pasar el mouse o llegar con Tab, las imágenes de los proyectos suben un poco y proyectan una sombra. Decidí que se eleven todas, sean links o no. Se usa la propiedad translate y no transform, para no pisar otras transformaciones (por ejemplo, si una imagen tuviera también la animación de entrada), y drop-shadow en lugar de box-shadow, porque sigue la forma del PNG transparente en vez de dibujar un rectángulo. Está dentro de @media (hover: hover), para que en celular no quede trabada después de tocar.

C. Vinilo. En On repeat la carátula es un círculo con surcos (un repeating-radial-gradient encima de la imagen) y gira mientras suena el preview. El botón de play pasó al centro, como la etiqueta de un vinilo, porque en la esquina quedaba fuera del círculo. Funciona con dos clases: is-spinning le da a la imagen la animación de giro, pausada, e is-playing la hace correr. Al pausar se saca solo is-playing, así el disco se queda quieto en su ángulo en lugar de volver de golpe; al cambiar de track se saca is-spinning, así la carátula nueva arranca derecha.

Accesibilidad. Las tres animaciones respetan prefers-reduced-motion: los textos aparecen sin animación, las imágenes muestran la sombra sin moverse y el disco no gira. La información no depende del movimiento: el botón de play sigue indicando si suena con aria-pressed.

Límite que reconozco. Los textos con reveal empiezan invisibles y los hace aparecer main.js: si el JavaScript fallara, no se verían.

Pruebas: [completar: scroll en escritorio y celular; hover y Tab en las imágenes; play, pausa, fin del preview y cambio de track con el vinilo; movimiento reducido]

13. 29 de octubre — Contraste y foco

Medí el contraste de todos los pares de texto y fondo con la fórmula de WCAG 2.1 (nivel AA: 4.5:1 para texto común, 3:1 para texto grande y para el borde de foco). Casi todo pasa: el texto principal da entre 9.7 y 13.2, y el indigo sobre lavanda da 4.72, que es el más justo. Encontré dos problemas:

A. El texto del botón de contacto era el azul del original (#0080FF) al 39% de opacidad. Sobre la crema daba 1.64. Lo cambié por un azul sólido, #0066CC, que da 5.04 y mantiene el mismo tono.

B. El borde de foco era crema en todos los links, pero las imágenes de los proyectos están sobre lavanda o crema, y ahí daba entre 1.0 y 1.23: navegando con Tab no se veía dónde estaba el foco. Ahora es ink (9.7 sobre lavanda) y solo queda crema en contacto, donde el fondo es indigo. Esa regla gana por especificidad, también en mobile.

El texto del hero es crema sobre la foto y eso no se puede calcular con la fórmula: lo revisé a ojo. [completar: resultado]

Pruebas: [completar]

14. 29 de octubre — Mockups del proyecto 1 en PNG

Los dos mockups del proyecto 1 se armaban con tres capas cada uno: la captura de pantalla, un marco SVG y una base SVG, posicionados con porcentajes en el CSS. Los reemplacé por dos PNG exportados desde mi diseño, que ya traen la laptop completa y tienen fondo transparente. Los exporté al doble de tamaño (@2x) para que se vean nítidos en pantallas retina y cuando el lienzo escala en monitores grandes.

Ahora cada mockup es un link con una sola imagen y usa la misma clase que las capturas del proyecto 4 (shot), que ya tenía la elevación y el comportamiento en mobile. Eso me dejó borrar todo el CSS de los dispositivos (58 líneas), los cuatro SVG y las dos capturas viejas.

Después los achiqué para que tengan el mismo tamaño y disposición que las capturas de folklore, y centré el par entre el título y el texto. El cartel "click the screens" y la flecha bajaron lo mismo que el primer mockup.

En el proyecto 3 (Babeblade) las puntas de la base de la laptop se veían cortadas. Volví a exportar artist.png con más margen y al doble de tamaño, con el mismo nombre. El PNG nuevo tenía otra proporción y, como la imagen usa object-fit: cover, seguía recortándose a los costados; ajusté la caja a la proporción nueva (685×401) para que no se recorte. En Vercel se seguía viendo la imagen vieja: Vercel manda las imágenes con caché de un año (immutable) y, como el archivo tenía el mismo nombre, el navegador no lo volvía a descargar. Lo renombré a artist-mockup.png. Aprendí que al reemplazar una imagen conviene cambiarle el nombre.

Pruebas: [completar]

15. Uso de inteligencia artificial

La consigna pide registrar el uso de IA. Lo hago en esta sección y la mantengo actualizada.

opencode (primera versión del proyecto):

Tareas para las que lo usé: [completar]
Qué partes revisé, adapté o descarté: [completar]
Problemas o errores que detecté: [completar]
AGENTS.md, en la raíz del repo, no lo generó opencode como había anotado: viene con la plantilla de Astro y tiene instrucciones para agentes de IA y links a la documentación de Astro.

Claude (asistente de chat), desde el 26/10:

Tareas para las que lo usé: analizar la consigna y compararla con mi proyecto, armar el plan de trabajo, explicarme qué es Astro, guiarme en la migración y en el primer componente paso a paso, y armar el borrador de esta bitácora.
Qué hice yo: ejecuté los comandos, copié los archivos, pegué y modifiqué el código, y verifiqué en el navegador que cada cambio se viera igual.
Errores o límites detectados:
Me dijo que mi versión de Node servía y Astro exigía una más nueva. Lo detecté al ejecutar el proyecto.
Supuso que mi diseño no tenía versión para celular. Lo corrigió después de ver mi CSS.
Aprendí que conviene verificar lo que dice la IA contra mi propio código.
Decisiones que tomé yo: migrar a Astro en lugar de rehacer el proyecto, rediseñar con criterio responsive para cumplir la consigna completa, componentizar sin tocar el CSS, y dejar para después la revisión del tramo de escritorio.

Claude Code (agente en la terminal, con acceso al proyecto), desde el 28/10:

Tareas para las que lo usé: leer el proyecto completo y compararlo con la consigna, proponer un plan en pasos chicos y completar esta bitácora con lo que muestran el código y el historial de commits.
Cómo lo usé: le pedí que antes de modificar cada archivo me explicara qué iba a cambiar y por qué, y que esperara mi OK antes de seguir. Las pruebas en el navegador las hago yo.
Código que escribió: src/data/projects.js y la nueva versión de OnRepeat.astro (playlist de proyectos y canciones), a partir de la alternativa que elegí; después, el desplazamiento con --off para mover On repeat después de About y el nuevo estilo del link al proyecto; por último, la división en dos lienzos y el rediseño de On repeat alineado con About; el componente Nav; los ajustes de responsive para tablet y pantallas grandes; las animaciones (entrada de textos, elevación de imágenes y vinilo); la revisión de contraste y foco; y el reemplazo de los mockups del proyecto 1 por PNG. Antes de cada archivo me explicó qué iba a cambiar y por qué.
Qué revisé yo: [completar: qué partes del código leí, entendí o cambié]
Errores o límites detectados: propuso usar la versión en columna hasta 1100 px para la tablet; al revisar el CSS él mismo vio que era un error, porque esa versión no está pensada para pantallas anchas, y lo corrigió antes de aplicarlo. También cambió dos veces lo que había anticipado: en Nav usó scroll y getBoundingClientRect en lugar de IntersectionObserver, y en On repeat agrupó tres textos en un div que no estaba en la explicación; en los dos casos lo avisó. [completar: otros errores que haya detectado yo]
Decisiones que tomé yo: el orden de los pasos, dónde va la sección On repeat (primero después del proyecto 4 y después, al verla, después de About), darle más jerarquía al link al proyecto, achicar On repeat para que sea coherente con About, no aceptar que las alturas quedaran fijas y cambiar la estructura a dos lienzos, una navegación en barra pero sutil para no tapar el hero, qué animaciones sumar, dejar la entrada solo en los textos y que se eleven todas las imágenes, el nuevo concepto de una canción por proyecto, las canciones elegidas (y el cambio de Vogue por Girls Just Want to Have Fun), y resolverlo como playlist entre las tres alternativas que me propuso.
16. Pendiente
 Migrar el proyecto a Astro. (hecho, 26/10)
 Crear el primer componente (ProjectSection) y usarlo en los cuatro proyectos. (hecho, 26/10)
 Hacer los componentes Hero, About y Contact, hasta tener al menos tres relevantes, con responsabilidad clara. (hecho, 26/10)
 Integrar una API o fuente dinámica de datos, con manejo de carga, error y vacío. (hecho, 28/10; adaptada al concepto de una canción por proyecto el mismo día)
 Sumar una interacción que modifique la experiencia o el contenido.
 Revisar el responsive del tramo de escritorio (tablet y pantallas grandes). El de celular ya existe. (revisado, 28/10: columna con ancho máximo en tablet y texto de About que escala; falta registrar las pruebas)
 Revisar accesibilidad: contraste, foco, textos alternativos, navegación. (contraste y foco revisados, 29/10; faltan textos alternativos y navegación)
 Definir la navegación entre secciones. (hecho, 28/10: componente Nav)
 Unir la rama astro con main, publicar con enlace limpio de producción y probarlo en otros dispositivos.
 Escribir el README completo.
 Probar en distintos tamaños de pantalla y registrar los resultados.
 Preparar la defensa: poder explicar cada componente y hacer un cambio en vivo.
17. Registro de próximas entradas

Agregar acá, con fecha, cada decisión, alternativa descartada, problema y solución.

[fecha]
[qué hice]
[qué problema encontré y cómo lo resolví]
[qué decidí y por qué]