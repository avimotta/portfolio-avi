Bitácora de proceso — Portfolio de Avi Motta

Examen final de Programación Multimedial IV. Entrega: 19 de noviembre de 2026.

1. Punto de partida

Problema de comunicación que quiero resolver: quiero que cuando alguien entre a mi portfolio sepa que soy una persona artística y musical y que vea la creatividad que hay detrás de mi trabajo.

Diseño original. El diseño base lo hice yo en Readymag. La primera versión en código reconstruyó ese diseño en HTML, CSS y JavaScript puro, y esta versión lo traslada a Astro.

Primera versión. Armé el portfolio completo con la herramienta de IA opencode, en HTML, CSS y un único archivo de JavaScript, sin frameworks. El sitio presenta mi perfil como UX Artist y cuatro proyectos de diseño: una plataforma de streaming universitario, una app de ranking musical, el sitio de un artista emergente y una landing de merchandising.

Qué pedí a la IA y qué decidí yo: le pedí a opencode que me ayude a trasladar el portfolio completo y a partir de eso fui haciendo las modificaciones necesarias de diseño para que quede igual a lo que me imaginaba.

2. 26 de octubre — Descubro que faltan requisitos

Releí la consigna del examen y vi que mi proyecto no cumplía varios requisitos obligatorios así que decidí revisar y avanzar uno por uno.

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

Decisión: migrar el proyecto existente a Astro en lugar de empezar de cero, reutilizando el contenido, los estilos y los recursos, y sumar lo que falta.

Plan por semanas:

Migrar a Astro y dejar el sitio funcionando.
Partir en componentes e integrar la API con sus estados.
Interacción significativa, responsive y accesibilidad.
README, evidencia, registro de IA y preparación de la defensa.

3. 26 de octubre — Migración a Astro

Pasos realizados:

1. Creé un proyecto nuevo con npm create astro@latest usando la plantilla vacía.
2. Copié las carpetas assets, css y js a public/ para que Astro las sirva sin procesarlas.
3. Pasé el contenido del index.html a src/pages/index.astro, agregando el bloque de código inicial delimitado por ---.
4. Cambié la etiqueta del script a <script is:inline src="/js/main.js" defer> para que Astro no lo procese.
5. Pasé el proyecto Astro al repositorio portfolio-avi, en una rama nueva llamada astro, y lo subí a GitHub. La rama main sigue con la versión vieja en HTML hasta que unamos las dos.

Problemas encontrados y cómo los resolví:

- npm run dev fallaba con "Missing script: dev". Estaba ejecutando el comando en la carpeta equivocada. Había que correrlo dentro de portfolio-astro, no en la carpeta contenedora.
- Astro no corría, decía "Node.js v22.18.0 is not supported". La versión de Astro instalada (7.4.2) exige Node >=22.23 así que actualicé Node a la v24.22.1 con el instalador .pkg de nodejs.org y volvió a funcionar.

4. 26 de octubre — Primer componente: ProjectSection

Problema: Los cuatro proyectos de la página repetían la misma estructura (sección, título, material visual y texto descriptivo) y esto estaba copiado cuatro veces en el index.astro.

Decisión: Creé el componente ProjectSection.astro, que arma la estructura y recibe como datos el título, el id y los estilos de posición. El contenido que cambia en cada proyecto (imágenes, mockups, texto) entra por slots los cuales son uno principal y otro con nombre (body) para el texto.

Por qué: Un solo lugar donde cambiar la estructura, menos código repetido, y la base para después alimentar los proyectos desde una lista de datos.

Cómo lo verifiqué: Migré primero el proyecto 3 (el más simple) y comprobé en el navegador que se vea igual. Después migré los otros tres de a uno, revisando cada vez.

Descubrimiento: Al revisar mi style.css vi que el diseño ya tenía versión para celular: un bloque @media (max-width: 899px) que apila todo en una columna con tipografías fluidas. Había asumido que el diseño con posiciones fijas no era responsive y no era así. Por eso decidí no tocar el CSS por ahora y hacer los componentes primero.

Pendiente de este tramo: De 900 px para arriba el diseño escala proporcionalmente, y la consigna pide más que reducir el contenido. Lo voy a revisar más adelante en tablet y pantallas grandes.

5. 26 de octubre — Componentes Hero, About y Contact

Problema: El hero, el texto de presentación y el contacto seguían escritos a mano dentro del index.astro, mezclados con el resto de la página.

Decisión: Creé tres componentes, uno por sección, que reciben sus datos por props desde el index.astro:
- Hero.astro recibe nombre, apellido, rol, foto y texto alternativo de la foto.
- About.astro recibe un título y un array de párrafos, y genera un <p> por cada uno con .map().
- Contact.astro recibe un título, el mail y un array de links. Genera un botón por link con .map() y calcula su posición vertical con 5499 + i * 61, así cada botón queda 61 unidades más abajo que el anterior.

Por qué: Los textos y links quedan como datos en un solo lugar (el index.astro) y la estructura en el componente. Para agregar un link o un párrafo alcanza con sumar un elemento al array.

Cómo lo verifiqué: Revisé que todo esté OK en la página.

Límite que reconozco: Hero y About sólo muestran los datos que reciben, sin lógica propia. La consigna aclara que los bloques sin lógica no cuentan como componentes relevantes, así que no los voy a presentar como mis tres componentes principales.

6. 28 de octubre — Sección On repeat con la iTunes Search API

Problema: El portfolio no consumía ninguna API ni fuente dinámica, que es un requisito obligatorio.

Decisión Creé el componente OnRepeat.astro, que muestra botones con artistas y, al elegir uno, pide sus canciones a la iTunes Search API de Apple y muestra hasta seis con su carátula y un botón para escuchar el preview de 30 segundos. Se decidió utilizar iTunes porque no pide clave o registro.

Qué pide y qué recibe. Hace un pedido a https://itunes.apple.com/search con term (el nombre del artista), entity=song, attribute=artistTerm y limit=25. Cada resultado trae, entre otros datos, trackName (canción), collectionName (álbum), artworkUrl100 (carátula) y previewUrl (audio de 30 segundos).

Cómo funciona el código:
- clean() se queda con canciones que tengan nombre, descarta las repetidas y corta en seis.
- cache guarda los resultados de cada artista ya pedido, para no volver a pedirlos. La API limita a unos 20 pedidos por minuto.
- token numera cada pedido. Si llega la respuesta de un artista anterior cuando el usuario ya eligió otro, se descarta.
- Solo suena un preview a la vez: al tocar otro, el anterior se pausa.

Estados que maneja (se muestran en un texto con role="status" y aria-live="polite", para que los lectores de pantalla los anuncien):
- Cargando: "Loading…" mientras espera la respuesta.
- Contenido disponible: se muestran las tarjetas.
- Vacío: "No songs found for this artist." si no hay resultados.
- Error de límite (respuesta 429 o 403): pide esperar un minuto y volver a tocar el artista.
- Error general (sin conexión u otro código): pide revisar la conexión.
- Error de reproducción: si el preview no se puede reproducir.

Cambios en el lienzo de escritorio. Para hacerle lugar a la sección bajé el contacto 1100 unidades (--shift:1100), agrandé el alto de la página de 5724 a 6824 (--page-h:6824) y moví la sección celeste de 4889 a 5989. Agregué en style.css un bloque @media (min-width: 900px) que aplica ese desplazamiento al contacto.

Problema detectado después: En el index.astro la sección está entre About y el proyecto 1, pero en escritorio se ve después del proyecto 4 (por su posición absoluta) y en celular se ve antes de los proyectos. Además, el orden del teclado y de los lectores de pantalla sigue el orden del código. Lo resuelvo en el próximo paso.

7. 29 de octubre — Nuevo concepto: cada proyecto es una canción

Idea. Cambiar el concepto de On repeat: en lugar de una lista de artistas que me gustan, cada trabajo del portfolio está simbolizado por una canción que lo representa. El visitante puede ver cuál es y escuchar su preview de 30 segundos desde la iTunes Search API.

Canciones elegidas:
- UMAI TV (streaming universitario): Girls Just Want to Have Fun — Cyndi Lauper
- JukeBox (app de ranking musical): Espresso — Sabrina Carpenter
- Emerging Artist's Website (Babeblade): Lo que pidas — Babeblade
- folklore (landing de merch de Taylor Swift): mirrorball — Taylor Swift

Para UMAI TV primero había elegido Vogue de Madonna y la cambié por Girls Just Want to Have Fun de Cyndi Lauper debido a que sentía que tenía más coherencia con el proyecto que quería mostrar. 

Por qué: La música es el hilo conductor de mi portfolio ya que es parte de mi identidad y creo que es una forma de darle una personalidad distinta y auténtica a mis trabajos.

Verificación en iTunes (28/10): Antes de escribir el código abrí en el navegador la búsqueda de cada canción en la API (term con título y artista, entity=song, limit=10) y comprobé que las cuatro aparecen con su artista y su previewUrl.

Cómo quedó:
src/data/projects.js tiene la lista: cada proyecto con su id (p1 a p4, el mismo que su ProjectSection), un nombre corto y su canción (título y artista).
index.astro importa la lista y se la pasa a OnRepeat por la prop tracks.
OnRepeat arma la playlist en el HTML con .map(): un botón por proyecto con los datos de la canción en atributos data-. Así la lista existe aunque falle el JavaScript o la API.
Al elegir un track, el script muestra enseguida el título, el artista y el link "See project", que salen de la lista. Después pide la canción a la API con el título y el artista, y findSong() se queda con el primer resultado de ese artista con ese título, porque la búsqueda también puede devolver covers o canciones de nombre parecido.
Solo la carátula y el botón de play dependen de la API.

Estados:
- Cargando: "Loading…", con título y artista ya visibles.
- Listo: carátula y botón de play.
- Vacío: "This song isn't available right now." si no encuentra la canción, o "There's no preview for this song." si la encuentra sin audio. Título, artista y link se siguen viendo.
- Error de límite (429 o 403), error de conexión y error de reproducción, con los mismos criterios que la versión anterior.

Detalles técnicos que tuve que resolver:
- La carátula y el botón de play se esconden con el atributo hidden, pero style.css tiene img { display: block }, que le gana a hidden. Agregué .s-repeat [hidden] { display: none } para que funcione dentro de la sección.
- La cache guarda también los "no encontrados" (null), para no volver a pedirlos. Por eso se pregunta index in cache y no cache[index], que daría falso con null.
- El link "See project" apunta al título del proyecto (#p1-title) y no a la sección, porque en escritorio la sección tiene display: contents, no ocupa lugar y el navegador no tiene adónde ir.

Pendiente: probar en el navegador los estados y la reproducción con la nueva versión (pruebas B y C) y anotar los resultados.

Cambio de decisión: Primero había puesto On repeat entre el proyecto 4 y el contacto. Al verla funcionando decidí moverla después de About, para que quien visita el portfolio la encuentre desde el principio y funcione como presentación de los proyectos que vienen después. 

Límite que reconozco: --page-h, las bandas y los degradados tienen los números escritos a mano: si cambio --shift, también los tengo que actualizar.

Link al proyecto. El link "See project" pasaba desapercibido. Lo convertí en un botón celeste pastel abajo del artista, con el nombre del proyecto en el texto ("See UMAI TV ↓"). Así dice a dónde lleva, y un lector de pantalla no lee cuatro veces "See project". La flecha anticipa que la página baja y tiene aria-hidden, para que no se lea. En celular el botón ocupa todo el ancho y mide al menos 48 px de alto, para tocarlo fácil.

Pendiente: probar en 900 px (que el texto de About no pise On repeat), 1280 px, 1920 px y 375 px.

9. 30 de octubre — Dos lienzos: On repeat deja de tener alto fijo

Problema: No me cerraba que todas las alturas fueran fijas. La solución de la entrada anterior funcionaba, pero era un parche: On repeat medía 1100 escrito a mano, y si su contenido crecía no empujaba nada, se superponía con lo de abajo.

Por qué pasaba: El diseño reconstruye Readymag como un lienzo: cada elemento tiene position: absolute y un --y. Un elemento con posición absoluta sale del flujo, no empuja a los de abajo y su contenedor no sabe cuánto mide. Por eso el lienzo necesita un alto escrito a mano. Para las composiciones de los proyectos tiene sentido, porque es lo que permite superponer mockups y degradados; para una sección con contenido dinámico, no.

Solución:
- Lienzo 1 (Hero y About) mide 1100. En el original About terminaba en 1065, pero dejé margen porque el texto de About tiene tamaño fijo y en pantallas angostas termina cerca de ese punto; el lienzo recorta lo que se pasa de su alto.
On repeat va entre los dos lienzos, en flujo normal, y mide lo que ocupa su contenido.
- Lienzo 2 (proyectos y Contact) usa las coordenadas del diseño original. Tiene --off:-1065, que resta 1065 a cada --y y --by (el punto donde empezaba el proyecto 1), y mide lo que faltaba del original: 5724 - 1065 = 4659.
- --u ahora se define en main y no en cada lienzo, para que también pueda usar On repeat como quedó afuera.

Rediseño de On repeat: Se veía demasiado grande y desconectada del resto. 

Límites que reconozco: Los dos lienzos siguen teniendo alto fijo, porque adentro todo es absoluto; pero son composiciones que no cambian. De 900 px para arriba el diseño sigue escalando proporcionalmente.

Punto de vuelta: Antes de este cambio hice un commit (96dbc91) con la versión anterior, para poder volver si no me gustaba el resultado.

Se realizaron pruebas luego a ver si todo estaba OK.

10. 2 de noviembre — Navegación: componente Nav

Problema: No había ninguna forma de recorrer las secciones, y la consigna pide una navegación clara.

Alternativas que consideré:
1. Una barra fija arriba con los nombres de las secciones. Es lo más claro.
2. Un índice vertical de puntos o números al costado. Es más editorial, pero menos obvio para quien no lo conoce.
3. Un botón "Menu" que abre un panel. Es lo más limpio, pero agrega estados para resolver (abierto, cerrado, foco, tecla Esc).

Elegí la 1.

Cómo quedó: No es una barra de lado a lado sino una pastilla chica, centrada arriba, con fondo crema semitransparente y desenfoque (backdrop-filter), para que se lea sobre la foto, la lavanda y el celeste claro sin ser un bloque sólido. Tiene cuatro links: About, On repeat, Works y Contact.

Cómo marca la sección actual. Cada vez que hay scroll, el script busca el último título que pasó el 40 % de la altura de la pantalla y le pone aria-current="true" a su link. Usa requestAnimationFrame para no calcular más de una vez por cuadro. Primero iba a usar IntersectionObserver, pero en escritorio las secciones tienen display: contents y no ocupan lugar, así que el observer no las puede mirar; por eso se miran los títulos con getBoundingClientRect.

Accesibilidad:
Un link "Skip to content", escondido, que aparece con la primera tecla Tab y lleva al <main>. El <main> tiene tabindex="-1" para que el foco se mueva de verdad, también en Safari.
aria-current en el link activo, para que los lectores de pantalla lo anuncien.
scroll-margin-top en los títulos, para que al saltar a uno no quede escondido debajo del menú.
El link activo usa el mismo lenguaje visual que el track elegido en On repeat (fondo índigo, texto crema).

Límite que reconozco: En celular cada link mide unos 29 px de alto. Supera el mínimo de 24 px de WCAG 2.2, pero está por debajo de los 44 px recomendados. Lo elegí así para que el menú sea sutil y si al probarlo cuesta tocarlo, lo agrando.

Pruebas: que se marque la sección correcta al scrollear incluido Works en los cuatro proyectos y Contact al final, que cada link lleve al título sin taparlo, Skip to content con Tab, legibilidad sobre cada fondo.

11. 3 de noviembre — Responsive: tablet y pantallas grandes

Problema: La consigna dice que no alcanza con que el contenido se reduzca. El celular ya tenía su versión en columna, pero faltaba revisar los demás tamaños.

Qué pasaba en cada ancho:
- 375 a 600 px (celular): columna. Bien.
- 600 a 899 px (tablet vertical, por ejemplo iPad de 768): la misma columna estirada, con imágenes de unos 730 px y renglones de más de 100 caracteres. Se leía mal.
- 900 a 1440 px (tablet acostada, notebook): el lienzo, cerca de su tamaño original. Bien.
- Más de 1440 px (monitor grande): el lienzo escala y todo se ve más grande, pero el texto de About no escalaba: quedaba en 16 px mientras los textos de los proyectos llegaban a unos 34 px en 1920.

Cambios:
En la versión en columna, cada sección tiene padding-inline: max(20px, calc((100% - 640px) / 2)). En celular el margen sigue siendo 20 px; en tablet crece lo necesario para que el contenido no pase de 640 px y quede centrado, mientras el fondo de color sigue ocupando todo el ancho. On repeat usa la misma regla.
El texto de About ahora mide calc(16 * var(--u)) en escritorio: en 1024 px mide lo mismo que antes y en pantallas grandes escala como el resto. En celular vuelve a 16 px fijos, porque ahí --u es muy chica. La intro de On repeat hace lo mismo.

Decisión: En escritorio mantengo que el lienzo escale proporcionalmente de 900 px en adelante, para conservar la composición del diseño de Readymag.

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

15. 18 de noviembre — La historia: el portfolio es una canción (Motion)

Problema. El profesor pidió que el portfolio cuente una historia a través de las animaciones y recomendó usar Motion. Las animaciones que tenía (entrada de textos, elevación de imágenes y vinilo) estaban bien, pero eran sueltas: no contaban nada en orden.

Decisión. Usar el concepto que ya tenía, una canción por proyecto, para todo el recorrido: el portfolio es una canción y el scroll es el tema avanzando. Cada sección es una parte de la canción y tiene su propia animación:

Intro (Hero): la foto se acerca suave, "Avi" y "Motta" entran de a una palabra y después el rol. Los puntos del ángulo laten a 120 BPM mientras el hero está en pantalla.
Primera estrofa (About): los párrafos aparecen de a uno, en lugar de todo el bloque junto. La última frase, "Keep scrolling and find my works!", tiene una flecha que rebota para invitar a seguir bajando.
Estribillo (On repeat): el título, la introducción y los cuatro tracks aparecen escalonados, como un tracklist que carga. Al elegir otro track, el título y el artista nuevos entran en vez de cambiar de golpe, y la carátula aparece cuando termina de cargar.
Las canciones (proyectos): cada proyecto entra con su propio movimiento. En UMAI TV y folklore las dos pantallas llegan desde lados opuestos y se encuentran; en UMAI TV, "click the screens and see!" aparece cuando ya están las pantallas. En JukeBox los tres celulares aparecen uno tras otro, como un ranking. En Babeblade el sitio de la artista emergente crece desde un poco más chico, como algo que "emerge".
Outro (Contact): "CONTACT ME" entra un poco más grande y se asienta, como el acorde final, y después aparecen el mail y los links.
Barra de reproducción (Nav): una línea fina debajo del menú se llena a medida que se baja, como el progreso de una canción. Al llegar a Contact, el tema terminó.

Un mismo lenguaje de movimiento: todo sube desde abajo con la misma curva y duraciones parecidas. La única excepción son las pantallas de los proyectos 1 y 4, que llegan desde los costados, porque la idea de "encontrarse" es parte de esa animación. Reemplaza la animación original de Readymag, en la que el texto de About bajaba al entrar: ahora todo sube.

Por qué Motion. Tiene justo las herramientas para esto: animate para animar, inView para disparar una animación cuando un elemento entra en pantalla, stagger para escalonar varios elementos y scroll para conectar algo con el avance del scroll (la barra de reproducción). Se instala con npm (npm install motion) y Astro lo incluye en el sitio al construir. Antes, main.js hacía la entrada de los textos con IntersectionObserver; ahora todo eso está en src/scripts/story.js y main.js se eliminó.

Cómo está hecho.

src/scripts/story.js tiene una función por parte de la canción (intro, verse, chorus, songs, outro). Una función onceInView hace que cada animación se ejecute una sola vez, la primera vez que el elemento entra en pantalla.
En escritorio las secciones tienen display: contents y no se pueden observar, así que inView observa los elementos concretos (títulos, pantallas, celulares).
Solo se animan opacidad y transform (posición y escala), que no cambian el lugar de los elementos en el lienzo: el sistema de --x, --y y --u sigue igual. La elevación al pasar el mouse usa la propiedad translate, que es distinta de transform, así que las dos animaciones no se pisan. La flecha de "click the screens" ya está rotada con transform, así que solo se anima su opacidad.
Las palabras del nombre y la flecha de About pasaron a inline-block, porque transform no funciona sobre elementos en línea.

Problema resuelto de paso. Antes, si el JavaScript fallaba, los textos con animación de entrada no se veían (estaba en las limitaciones del README). Ahora los elementos arrancan invisibles solo si <html> tiene la clase motion, que la pone un script en el <head>. Si Motion no cargó a los 3 segundos, el script saca la clase y todo se ve sin animación. Sin JavaScript, la clase nunca se pone.

Problema que apareció. En la primera prueba, tres animaciones (el título de On repeat, el final de On repeat y los links de Contact) no aparecían y la consola mostraba "Invalid value used as weak map key". Era porque les pasaba a Motion una lista de selectores de texto, y en una lista Motion espera elementos. Se resolvió buscando primero los elementos con querySelectorAll.

Accesibilidad. Con prefers-reduced-motion no hay animaciones de entrada ni pulsos: todo se ve desde el principio. La barra de reproducción se mantiene, porque no es decorativa: acompaña el scroll que hace el usuario, no se mueve sola. Es aria-hidden, porque el menú ya indica la sección actual con aria-current.

Cómo lo verifiqué. Con un navegador automatizado (Playwright) se recorrió la página de arriba abajo en escritorio (1280 px) y en celular (390 px), y se comprobó que al final todos los elementos animados quedan visibles, que la barra llega al 100 % y que no hay errores en la consola. También con prefers-reduced-motion y con el JavaScript desactivado: en los dos casos todo se ve desde el principio. Se probó el cambio de track en On repeat. [completar: cómo lo probé yo en el navegador y en el celular, y qué ajusté]

16. 18 de noviembre — Mini reproductor: la canción elegida te acompaña

Problema. Con las animaciones nuevas la historia se entendía, pero faltaba algo que la hiciera sentir como escuchar música de verdad. Además, al elegir una canción en On repeat y seguir bajando, la música se escuchaba pero ya no se veía nada que la controlara.

Alternativas que se pensaron:

1. Un mini reproductor que cambia solo de canción según el proyecto que se está mirando (al llegar a UMAI TV suena su canción, en JukeBox la suya, etc.). Contaba la historia de forma automática, pero el usuario no elige, y un compañero ya había hecho algo parecido.
2. Un mini reproductor que mantiene la canción que eligió el usuario en la playlist, como Spotify, sin importar en qué proyecto esté.

Decisión. La alternativa 2. [completar: por qué la elegí con mis palabras] El usuario elige la canción en On repeat y el mini reproductor la mantiene sonando mientras recorre el portfolio. Así el vinilo grande y el mini reproductor no compiten: son el mismo reproductor, grande en la playlist y chico en el resto de la página.

Cómo funciona.

Aparece abajo, centrado, cuando On repeat sale de la pantalla: si ya se bajó más allá de la playlist, o si hay algo sonando (por ejemplo, si se vuelve a subir al Hero). Se esconde cuando On repeat está a la vista, porque ahí ya está el disco grande.
Tiene la carátula como un vinilo chico, el título y el artista, un ecualizador, los botones anterior, play/pausa y siguiente, y una barra con el avance del preview de 30 segundos.
Anterior y siguiente cambian de track en la playlist; si había algo sonando, la canción nueva arranca sola. Tocar la carátula o el título vuelve a la playlist.
Si se pausa y se vuelve a dar play, la canción sigue desde donde estaba (antes arrancaba de cero).
Si la canción no tiene preview o la API falló, el botón de play queda desactivado y se lee "no preview" al lado del artista.

Cómo está hecho.

Un solo audio para todo el sitio. Antes el audio estaba adentro del script de OnRepeat. Ahora OnRepeat lo comparte en window.portfolioPlayer (con toggle, next, prev y el estado actual) y avisa cada cambio con un evento player:update. El mini reproductor (MiniPlayer.astro) no tiene audio propio: escucha ese evento y usa esas funciones. Así nunca suenan dos canciones a la vez y la playlist y el mini reproductor siempre muestran lo mismo.
On repeat es una sección en flujo normal (no tiene display: contents), así que se puede observar con IntersectionObserver para saber si está en pantalla.
Animaciones con Motion: el reproductor entra deslizándose desde abajo y sale igual; al cambiar de track, la carátula y el título entran; el vinilo gira mientras suena y se frena donde está al pausar; las barras del ecualizador suben y bajan, cada una a su ritmo.
El reproductor se centra con la propiedad translate y Motion lo mueve con transform, así no se pisan (lo mismo que con la elevación de las imágenes).

Problema que apareció. El ecualizador no se movía: las animaciones de las barras se creaban al cargar, en pausa, y cada vez que el reproductor se actualizaba sin sonar se lanzaba otra animación que bajaba las barras y reemplazaba a la primera. Se resolvió creando las animaciones del ecualizador recién al dar play y frenándolas al pausar.

Otro problema, probando con la API real. Para "Espresso", la API devuelve primero "Espresso (On Vacation Version)" y la versión original recién en segundo lugar, así que sonaba la versión equivocada. findSong ahora busca primero el título exacto y, si no lo encuentra, acepta uno que lo contenga. Con la API real se probaron las cuatro canciones: todas cargan carátula y preview.

Detalles.

En celular el reproductor ocupa casi todo el ancho y no muestra el ecualizador, para que entre el título. La sección de contacto tiene más espacio abajo para que el reproductor no tape los links.
La introducción de On repeat ahora dice "It keeps playing while you scroll", para que se entienda que la música sigue.
Accesibilidad: el reproductor es una región con aria-label "Music player"; los botones tienen nombre ("Previous track", "Next track", "Play Espresso by Sabrina Carpenter") y el de play indica si suena con aria-pressed. Con prefers-reduced-motion aparece y desaparece sin deslizarse, el vinilo no gira y el ecualizador no se mueve.

Cómo lo verifiqué. Con Playwright, simulando la API y el audio: en escritorio y en celular, el reproductor no se ve arriba ni en On repeat, aparece al bajar con la canción elegida sonando, siguiente cambia de canción en los dos lugares y sigue sonando, pausa funciona, y al volver al Hero con música sigue visible. Sin errores en la consola. [completar: cómo lo probé yo con las canciones reales]

17. 18 de noviembre — Cada proyecto se abre como un disco

Problema. Al tocar las imágenes de los proyectos, el sitio mandaba directo a Behance en otra pestaña. Se sentía brusco: quien estaba recorriendo el portfolio se iba a otra página. Además, la imagen de Babeblade y la segunda pantalla de folklore no eran links, así que no hacían nada al tocarlas.

Qué se probó primero. Mostrar el proyecto de Behance adentro del portfolio. La página normal de Behance bloquea los accesos automáticos, y la versión para insertar (behance.net/embed/project/...) solo trae la portada y el título, no las imágenes del proyecto, y al hacer clic igual lleva a Behance. Behance tampoco tiene una API pública. Para mostrar el proyecto completo habría que exportar las imágenes, y no las tengo en este momento.

Decisión. Una vista del proyecto dentro del portfolio, con las imágenes que ya están en el sitio, pero que tenga que ver con la música: cada proyecto se abre como un disco. [completar: por qué me gustó esta idea]

La funda del disco tiene de tapa la imagen del proyecto que se tocó.
El vinilo sale de la funda hacia el costado y empieza a girar, con el nombre del proyecto en la etiqueta del centro.
La contratapa tiene el título del proyecto, "The song of [proyecto]" con un botón para escucharla, la descripción como "Liner notes" (así se llaman los textos de los discos) y un botón "Full project on Behance".
Al cerrar (con la X, con Esc o tocando afuera), el vinilo vuelve a la funda y el disco desaparece.

Coherencia con el mini reproductor. El botón de play del disco solo suena si el usuario lo toca, y suena en el mismo reproductor de siempre: elige ese track en la playlist y aparece en el mini reproductor. Así se mantiene la idea de que la música la elige el usuario.

Cómo está hecho.

Componente nuevo, RecordModal.astro, con un elemento <dialog>. Con showModal() el navegador ya resuelve tres cosas: el foco queda adentro del disco, Esc lo cierra y el resto de la página no se puede usar mientras está abierto. Al cerrar, el foco vuelve a la imagen que lo abrió.
Los datos del disco salen de lugares que ya existían: el nombre y la canción de projects.js (donde se sumó el link de Behance de cada proyecto), el título y la descripción de la misma página (se copian los párrafos del proyecto) y la imagen es la que se tocó. No hay textos repetidos.
Todas las imágenes de los proyectos son links a Behance con data-record. Con JavaScript, el clic abre el disco; sin JavaScript, o con Ctrl/Cmd o la rueda del mouse, el link sigue llevando a Behance. Así se sumaron los links que faltaban (Babeblade y la segunda pantalla de folklore).
Animaciones con Motion: el disco aparece, la funda sube, el vinilo sale y gira, y la contratapa aparece en escalonado. Al cerrar, el vinilo vuelve y después el disco se va. Para que Esc también cierre con animación, se intercepta el evento cancel del <dialog>.
OnRepeat suma playIndex al reproductor compartido: si el track ya es el elegido, play/pausa; si no, lo elige y arranca a sonar.

Problema que apareció. En la funda, la imagen alta de JukeBox (un celular) se salía por arriba y por abajo, porque height: 100% no funciona adentro de un grid sin alto definido. Se resolvió posicionando la imagen en absoluto dentro de la funda, con object-fit: contain, así entra entera sea apaisada (laptops) o alta (celular).

Accesibilidad. El disco tiene como nombre el título del proyecto (aria-labelledby), los botones tienen nombre ("Close", "Play Espresso by Sabrina Carpenter") y el de Behance avisa que abre una pestaña nueva. Las imágenes avisan con aria-haspopup que abren un diálogo. Con prefers-reduced-motion, el disco aparece con el vinilo ya afuera y sin girar.

Cómo lo verifiqué. Con Playwright, en escritorio y en celular: el disco abre con los datos correctos del proyecto (título, descripción, link de Behance), no se abre ninguna pestaña, el play suena y se refleja en el mini reproductor, Esc y el clic afuera lo cierran, el foco vuelve a la imagen y la página vuelve a scrollear. También con prefers-reduced-motion. [completar: cómo lo probé yo]

18. 18 de noviembre — Revisión del código

Antes de entregar, revisé todo el código con Claude Code buscando comentarios viejos, código que sobrara, errores y detalles de contenido. No había console.log olvidados ni notas pendientes, y todas las imágenes tenían texto alternativo. Lo que se encontró y se arregló:

Ícono del sitio. La página tenía el ícono vacío (href="data:,") y en public/ quedaban favicon.svg y favicon.ico con el logo de Astro de la plantilla, sin usar. Se reemplazaron por mi ícono (favicon.ico, favicon.png y apple-touch-icon.png para la pantalla de inicio del celular, con fondo crema) y se borró el logo de Astro.
Imágenes. Pesaban 5 MB en total (artist-mockup.png sola, 2,2 MB). Las siete más pesadas se pasaron a WebP, que mantiene la transparencia: quedaron en 460 KB entre todas, y se ven igual. La de Babeblade además se achicó a 1600 px de ancho, que alcanza para pantallas grandes.
Descripción de JukeBox. Tenía un texto que no era de JukeBox ("a platform for emerging artists to showcase their work…"). Se reemplazó por una descripción de la app de ranking hecha a partir de lo que muestran las pantallas. [completar: revisar que el texto nuevo describa bien el proyecto]
Textos. "Linkedin" pasó a "LinkedIn", y "Emerging Artist's Website" usa el mismo apóstrofo curvo (’) que "University’s".
Comentarios viejos en style.css: el encabezado decía "Reconstrucción en HTML/CSS/JS puro" (ahora es Astro), uno mencionaba "img_14", un nombre de la exportación de Readymag, y un título de sección quedaba arriba de reglas que no eran de esa sección.
Accesibilidad del mini reproductor. El link de la carátula se llamaba "Back to the playlist" para los lectores de pantalla, pero en pantalla muestra la canción. Ahora se lee "Back to the playlist: [canción], [artista]", que incluye lo que se ve.
Código sin usar. El reproductor compartido tenía una función load que nadie usaba, y el CSS del mini reproductor tenía dos reglas iguales seguidas. Se borró y se unió.
El disco de On repeat gira con Motion. Era el único giro hecho con CSS (@keyframes y las clases is-spinning e is-playing); el del mini reproductor y el del disco de cada proyecto ya eran con Motion. Ahora story.js escucha el evento player:update y hace girar el disco mientras suena, lo frena donde está al pausar y lo endereza al cambiar de track. Así todas las animaciones del sitio usan Motion.

Pregunta posible en la defensa: por qué Nav y OnRepeat usan var y function y el resto usa const e import. Los scripts con is:inline Astro no los procesa: van tal cual al navegador. Los otros son módulos que Astro procesa al construir, y por eso pueden importar Motion desde node_modules.

Cómo lo verifiqué. Se repitieron todas las pruebas con Playwright: animaciones en escritorio, celular, con menos movimiento y sin JavaScript; mini reproductor; disco de cada proyecto; que el disco de On repeat gire al sonar y quede quieto en pausa; que todas las imágenes carguen y que los íconos estén enlazados. [completar: cómo lo probé yo]

19. Uso de inteligencia artificial

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
Claude Code, 18 de noviembre (animaciones con Motion). Le pedí ayuda para entender la consigna del profesor ("contar una historia con las animaciones") y para hacerlo con Motion. Revisó el portfolio y propuso la historia de "el portfolio es una canción", con una animación por sección y la barra de reproducción; la elegí yo y le pedí que hiciera todo. Escribió src/scripts/story.js, los cambios en Hero, About, ProjectSection, Nav, index.astro y style.css, y esta entrada de la bitácora. Probó el sitio con un navegador automatizado. [completar: qué revisé yo, qué cambié o pedí cambiar]

Claude Code, 18 de noviembre (mini reproductor). Le conté la idea de un reproductor de verdad. Me propuso primero que cambiara de canción según el proyecto; le dije que prefería que el usuario elija la canción y que se mantenga, y lo hizo así. Escribió MiniPlayer.astro, los cambios en el script de OnRepeat para compartir el audio y la entrada 16 de esta bitácora, y lo probó con un navegador automatizado. [completar: qué revisé yo]

Claude Code, 18 de noviembre (el disco). Le pedí que probara si se podía mostrar Behance adentro de la página; lo probó y no se podía. Me propuso una vista del proyecto con las imágenes que ya tenía y yo le pedí que fuera más creativa y tuviera que ver con la música; propuso el disco y me gustó. Me hizo notar que Babeblade no tenía link y le pasé el de Behance. Escribió RecordModal.astro, los cambios en index.astro, projects.js y OnRepeat, y esta entrada. Con acceso a la API real encontró que "Espresso" traía otra versión y lo arregló. Para probar Behance y la API real creó un entorno de trabajo con acceso solo a esas páginas, que aprobé yo. [completar: qué revisé yo]

Claude Code, 18 de noviembre (revisión del código). Le pedí una revisión de todo el código. Me pasó una lista sin cambiar nada; le dije qué arreglar, le aclaré que la descripción de JukeBox no era la correcta y le pasé mi ícono. Hizo los arreglos de la entrada 18 y repitió todas las pruebas. [completar: qué revisé yo]

20. Pendiente
 Migrar el proyecto a Astro. (hecho, 26/10)
 Crear el primer componente (ProjectSection) y usarlo en los cuatro proyectos. (hecho, 26/10)
 Hacer los componentes Hero, About y Contact, hasta tener al menos tres relevantes, con responsabilidad clara. (hecho, 26/10)
 Integrar una API o fuente dinámica de datos, con manejo de carga, error y vacío. (hecho, 28/10; adaptada al concepto de una canción por proyecto el mismo día)
 Sumar una interacción que modifique la experiencia o el contenido. (hecho: playlist con la API, 28/10; mini reproductor y disco de cada proyecto, 18/11)
 Revisar el responsive del tramo de escritorio (tablet y pantallas grandes). El de celular ya existe. (revisado, 28/10: columna con ancho máximo en tablet y texto de About que escala; falta registrar las pruebas)
 Revisar accesibilidad: contraste, foco, textos alternativos, navegación. (contraste y foco revisados, 29/10; textos alternativos y navegación revisados en la revisión del código, 18/11)
 Definir la navegación entre secciones. (hecho, 28/10: componente Nav)
 Unir la rama astro con main, publicar con enlace limpio de producción y probarlo en otros dispositivos. (unida y publicada; la rama animaciones-motion también se unió a main el 18/11; falta probar en otros dispositivos)
 Escribir el README completo. (hecho; faltan los [completar])
 Probar en distintos tamaños de pantalla y registrar los resultados.
 Completar los [completar] de esta bitácora y del README.
 Preparar la defensa: poder explicar cada componente y hacer un cambio en vivo.
21. Registro de próximas entradas

Agregar acá, con fecha, cada decisión, alternativa descartada, problema y solución.

[fecha]
[qué hice]
[qué problema encontré y cómo lo resolví]
[qué decidí y por qué]