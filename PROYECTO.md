# Documentación del Proyecto: Organic Editorial

Este documento proporciona una explicación detallada del proyecto **Organic Editorial**, una aplicación web moderna orientada a la nutrición y el bienestar personal. Esta guía está diseñada para ser presentada ante un docente, explicando el proceso de desarrollo, las tecnologías involucradas y el potencial futuro del sistema.

---

## 1. Descripción General del Proyecto
**Organic Editorial** es una plataforma interactiva que permite a los usuarios gestionar su nutrición de manera inteligente. El objetivo principal es ofrecer una herramienta donde se pueda registrar la ingesta diaria de alimentos, visualizar el progreso nutricional y recibir asesoramiento personalizado mediante Inteligencia Artificial.

### Objetivos Principales:
- **Seguimiento Nutricional**: Registro preciso de comidas con datos reales de calorías y macronutrientes.
- **Asistencia Inteligente**: Un coach de IA (Gemini) que responde dudas y da consejos en tiempo real.
- **Experiencia de Usuario Premium**: Interfaz fluida, animada y con retroalimentación sonora.

---

## 2. Tecnologías Utilizadas
El proyecto se apoya en un "stack" moderno que garantiza velocidad y escalabilidad:

### Frontend (Interfaz de Usuario):
- **React 19**: Biblioteca principal para la construcción de interfaces de usuario basadas en componentes.
- **Vite**: Herramienta de construcción (build tool) de última generación que permite un desarrollo extremadamente rápido y recarga en caliente (HMR).
- **TypeScript**: Superconjunto de JavaScript que añade tipado estático, reduciendo errores y mejorando la calidad del código.
- **Tailwind CSS 4**: Marco de trabajo de CSS para un diseño ágil y moderno mediante clases de utilidad.
- **Motion (Framer Motion)**: Utilizado para las transiciones suaves y micro-animaciones que dan vida a la app.
- **Lucide React**: Biblioteca de iconos minimalistas.
- **Howler.js**: Gestión de efectos de sonido para mejorar la interactividad.

### Backend e IA (Lógica y Datos):
- **Node.js**: Entorno de ejecución para el desarrollo y herramientas de construcción.
- **Google Gemini API**: Integración de Inteligencia Artificial para el asistente virtual nutricional.
- **USDA FoodData Central API**: Conexión con una base de datos científica para obtener información nutricional exacta de los alimentos.

---

## 3. Arquitectura y Estructura de Archivos
El proyecto sigue una estructura modular y limpia para facilitar el mantenimiento:

- **`/src`**: Directorio raíz del código fuente.
  - **`/components`**: Contiene los bloques visuales de la app:
    - `Assistant.tsx`: Lógica y UI del chat con la IA.
    - `Dashboard.tsx`: Panel principal de estadísticas y progreso.
    - `FoodLog.tsx`: Sistema de búsqueda y registro de alimentos.
    - `Onboarding.tsx`: Proceso de bienvenida y configuración inicial.
    - `Recipes.tsx`: Catálogo de comidas saludables.
  - **`/lib`**: Lógica de servicios externos y utilidades:
    - `gemini.ts`: Configuración y conexión con la IA de Google.
    - `usda.ts`: Lógica para consultar la base de datos de alimentos.
    - `sounds.ts`: Sistema de efectos sonoros.
  - **`App.tsx`**: Orquestador principal que maneja la navegación y el estado global.
  - **`main.tsx`**: Punto de entrada que renderiza la aplicación en el DOM.

---

## 4. Generación del Entorno de Desarrollo
Para crear este entorno profesional, se siguieron estos pasos:

1. **Inicialización**: Se utilizó Vite para crear el andamiaje básico del proyecto con la plantilla de React y TypeScript (`npm create vite@latest`).
2. **Configuración de Estilos**: Se instaló Tailwind CSS y se integró directamente en el flujo de Vite mediante su nuevo plugin oficial para la versión 4.
3. **Gestión de Dependencias**: Se utilizaron comandos de `npm` para instalar librerías críticas como `@google/generative-ai`, `motion`, y `lucide-react`.
4. **Variables de Entorno**: Se configuró un archivo `.env` para manejar de forma segura las llaves de API (API Keys) de Google y la USDA, evitando que información sensible se suba al repositorio.
5. **Configuración de Tipado**: Se ajustó `tsconfig.json` para asegurar que el editor de código ayude a prevenir errores de lógica.

---

## 5. Funcionalidades y Potencial Futuro
Si bien la base es sólida, el proyecto está diseñado para crecer:

### Lo que tenemos hoy:
- Interfaz 100% responsiva con diseño adaptativo (Full-width en registro, Sidebar en app).
- Seguridad de navegación: Acceso restringido a las funciones de la app hasta completar el registro.
- Sistema de Sesión: Funcionalidad de "Cerrar Sesión" para proteger la privacidad.
- Centro de Soporte: Apartado interactivo con FAQs y canales de contacto técnico.
- Proceso de registro (Onboarding) capturando datos clave: Nombre, Email, Edad, Peso, Altura y Alergias.
- Selector dinámico de alergias e intolerancias.
- Búsqueda de alimentos en tiempo real con datos nutricionales reales.
- Chat interactivo con un nutricionista virtual basado en IA (BioCoach), con **advertencias inteligentes**.
- Sistema de metas diarias (Calorías, Proteínas, Carbohidratos, Grasas).

### Próximos pasos (Hoja de Ruta):
- **Integración con Firebase**:
  - **Auth**: Registro e inicio de sesión de usuarios (Google, Email).
  - **Firestore**: Base de datos en la nube para guardar el historial del usuario de forma permanente.
  - **Storage**: Para que los usuarios suban fotos de sus progresos o comidas.
- **Escaneo de Alimentos**: Uso de la cámara para reconocer productos mediante código de barras o visión artificial.
- **Gamificación**: Sistema de medallas y logros por cumplir metas semanales.
- **Social**: Compartir recetas o progresos con amigos o nutricionistas reales.

---

## 6. Conclusión para el Docente
Este proyecto no es solo una página web, es una **Single Page Application (SPA)** de alto rendimiento que demuestra el uso de tecnologías de vanguardia en la industria actual. Combina la eficiencia de **React** con la potencia de la **Inteligencia Artificial**, siguiendo las mejores prácticas de diseño y desarrollo web moderno.
