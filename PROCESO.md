Bitácora de proceso — Portfolio de Avi Motta

Examen final de Programación Multimedial IV. Entrega: 19 de noviembre de 2026.

Esta bitácora se va completando a medida que avanza el proyecto. Los textos entre [corchetes] son datos que tengo que completar yo con lo que realmente pasó.

1. Punto de partida

Problema de comunicación que quiero resolver: [completar: qué quiero que entienda alguien que visita mi portfolio, y a quién me dirijo]

Primera versión. Armé el portfolio completo con la herramienta de IA opencode, en HTML, CSS y un único archivo de JavaScript, sin frameworks. El sitio presenta mi perfil como UX Artist y cuatro proyectos de diseño: una plataforma de streaming universitario, una app de ranking musical, el sitio de un artista emergente y una landing de merchandising.

Qué pedí a la IA y qué decidí yo: [completar: qué instrucciones le di a opencode, qué referencias usé, qué elegí yo del resultado]

Referencia visual. El comentario del main.js original menciona que el diseño parte de un trabajo hecho en Readymag. [completar: aclarar si el diseño es propio o adaptado de otro, y acreditarlo en el README]

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

Problemas encontrados y cómo los resolví:

npm run dev fallaba con "Missing script: dev". Estaba ejecutando el comando en la carpeta equivocada. Había que correrlo dentro de portfolio-astro, no en la carpeta contenedora.
Astro no arrancaba: "Node.js v22.18.0 is not supported". La versión de Astro instalada (7.4.2) exige Node >=22.23.4. Actualicé Node a la v24.22.1 con el instalador .pkg de nodejs.org y volvió a funcionar.
Al pegar el contenido de index.html pegué solo el texto visible, sin las etiquetas. Lo resolví copiando el código fuente real del archivo.
4. Uso de inteligencia artificial

La consigna pide registrar el uso de IA. Lo hago en esta sección y la mantengo actualizada.

opencode (primera versión del proyecto):

Tareas para las que lo usé: [completar]
Qué partes revisé, adapté o descarté: [completar]
Problemas o errores que detecté: [completar]

Claude (asistente de chat), desde el 26/10:

Tareas para las que lo usé: analizar la consigna y compararla con mi proyecto, armar el plan de trabajo, explicarme qué es Astro y guiarme en la migración paso a paso.
Qué hice yo: ejecuté los comandos, copié los archivos, pegué y modifiqué el código.
Problemas o límites detectados: la guía inicial indicaba que mi versión de Node servía y no era así (Astro exigía una versión más nueva), lo detecté al ejecutar el proyecto.
Decisiones que tomé yo: [completar a medida que avance]
5. Pendiente
 Partir la página en al menos tres componentes con responsabilidad clara.
 Integrar una API o fuente dinámica de datos, con manejo de carga, error y vacío.
 Sumar una interacción que modifique la experiencia o el contenido.
 Resolver el responsive de verdad (el diseño actual usa posiciones fijas, heredadas del original).
 Revisar accesibilidad: contraste, foco, textos alternativos, navegación.
 Definir la navegación entre secciones.
 Publicar con enlace limpio de producción y probarlo en otros dispositivos.
 Escribir el README completo.
 Probar en distintos tamaños de pantalla y registrar los resultados.
 Preparar la defensa: poder explicar cada componente y hacer un cambio en vivo.
6. Registro de próximas entradas

Agregar acá, con fecha, cada decisión, alternativa descartada, problema y solución.

[fecha]
[qué hice]
[qué problema encontré y cómo lo resolví]
[qué decidí y por qué]
