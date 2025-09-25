Diseña una extensión para monitorizar el tiempo de trabajo, utilizando únicamente el almacenamiento local del navegador (localStorage o IndexedDB, sin servidor backend). La extensión debe mostrar una ventana emergente obligatoria al abrir el navegador, bloqueando la navegación hasta que el usuario seleccione una actividad. Debe incluir un panel de control con un gráfico de tiempo y una lista de sesiones, detección de inactividad, intervalos configurables, gestión de clientes y exportación a CSV.

## Instrucciones detalladas

- **Persistencia:** Avanza hasta que se implementen todas las funciones y flujos de usuario descritos.
- **Razonamiento paso a paso:** Analiza el almacenamiento, las interacciones de la interfaz, el control del tiempo, el bloqueo de navegación y la gestión de sesiones y descansos antes de presentar la solución final.
- **Cumplir con los requisitos:** No modifiques el contenido ni los pasos del flujo de usuario. Aborda cada flujo de usuario, esquema de almacenamiento, elemento de interfaz y funcionalidad descrita.
- **Subpasos:**
- Analiza el formato de almacenamiento de datos (localStorage o IndexedDB), el esquema de sesiones y la lógica de recuperación, actualización y eliminación. 
- Define la lógica de la ventana emergente para la primera interacción del usuario, bloqueando la navegación hasta que se realice una selección. 
- Define la gestión de descansos: temporizadores, cuenta atrás persistente y lógica para desbloquear la navegación. 
- Define el flujo de trabajo para las sesiones: selección, descripción, inicio/pausa, validación periódica (60 min, configurable) y reanudación. 
- Requisitos del panel de control: integración de una librería de gráficos (Chart.js u otra similar), visualización del tiempo acumulado (por día/semana/mes/total) y exportación. 
- Funcionalidades de la lista de sesiones: visualización, edición, eliminación y pausa/reanudación. 
- Interfaz de gestión de clientes para añadir/eliminar clientes. 
- Estructura del manifiesto y de la extensión (MV3), lista de scripts e interacción entre la ventana emergente, el servicio de fondo, las opciones y (si es necesario) los scripts de contenido. 
- Diseño de la interfaz: moderno, minimalista, con controles claros y utilizando un framework CSS.
- **Orden del razonamiento y las conclusiones:**
- **RAZONAMIENTO PRIMERO:** Analiza sistemáticamente cada requisito técnico y funcional con un razonamiento explícito. 
- **CONCLUSIONES AL FINAL:** Tras el análisis completo, presenta la arquitectura final, un resumen de las funciones o el plan de implementación.

---

## Formato de salida

- Presenta un plan estructurado con los pasos de razonamiento detallados, seguido de un resumen claro y ordenado de las conclusiones y decisiones sobre las funciones.
- Usa Markdown con encabezados jerárquicos y viñetas para mayor claridad. - Para el esquema de almacenamiento, los flujos de ventanas emergentes y la estructura de datos del panel de control, utilice JSON (sin bloques de código a menos que se solicite explícitamente).
- Todas las listas (por ejemplo, campos obligatorios, componentes de interfaz de usuario obligatorios, estructura de archivos) deben aparecer en secciones separadas con viñetas.
- Los ejemplos deben ser completos; utilice marcadores de posición donde aparecerían los datos reales.
- Las respuestas deben tener al menos varios párrafos detallados, con subsecciones para cada requisito principal y siempre justificando la decisión antes de resumir o recomendar los pasos de implementación.
- Al final, incluya un **recordatorio**: **"IMPORTANTE: Siempre justifique cada paso antes de llegar a conclusiones o dar respuestas finales".**

---

### Ejemplo

#### [Entrada de ejemplo]
Flujo de usuario:
- Abrir el navegador, ventana emergente obligatoria para seleccionar la actividad.
- Si "No trabajo", ingresar el tiempo de descanso y activar la cuenta regresiva.
- Si "Trabajo", seleccionar el tipo de trabajo, completar la descripción, iniciar la sesión; comprobar periódicamente si se sigue trabajando; mostrar el panel de control con la lista de sesiones; gestionar clientes y exportar a CSV...

#### [Salida de ejemplo]
**JUSTIFICACIÓN:**
- La extensión debe usar localStorage o IndexedDB debido a la falta de backend externo.
- Para bloquear la navegación, un cuadro de diálogo insertado por content.js es la solución más universal; debe ser resistente al cierre de la ventana emergente.
- Diseño de la ventana emergente: obligatoria, controles grandes, selección inicial; modo de descanso con temporizador, reinicia el cuestionario después del descanso.
- Datos: Las sesiones requieren fecha de inicio, fecha de finalización, duración, tipo de tarea, descripción y (opcional) cliente.
- Sesiones y configuración guardadas en JSON estructurado para persistencia...
- Panel de control: Chart.js para la visualización del tiempo; tabla de sesiones con acciones de editar/pausar/eliminar.
- Exportación: Usar la API Blob para crear un archivo CSV descargable a partir de los datos de las sesiones.
- Gestión de clientes: Array de clientes almacenado, añadir/eliminar mediante la interfaz de opciones...

**CONCLUSIONES Y PLAN DE CARACTERÍSTICAS:**
- Almacenamiento mediante IndexedDB (escalable) o localStorage (más simple, menos robusto).
- Archivos principales: manifest.json, popup.html/js/css, dashboard, lógica de background.js, opciones, contenido para el bloqueo...
- El flujo de trabajo coincide con la estructura proporcionada... Todos los flujos principales se mantienen...
- Se incluyen todos los campos de datos, controles de interfaz de usuario y funciones descritos...

**IMPORTANTE: Realice siempre un análisis paso a paso, como se indica, antes de llegar a conclusiones o dar respuestas finales.**

---

**RECORDATORIO:**
**Asegúrese de que todo el análisis y la explicación de los pasos previos se realicen antes de presentar la conclusión o la respuesta final. Respetar las especificaciones del usuario.**