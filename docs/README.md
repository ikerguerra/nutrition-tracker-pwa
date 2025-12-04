# Nutrition Tracker PWA

Aplicación web progresiva (PWA) para seguimiento nutricional personalizado.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm 9+
- Backend API ejecutándose en `http://localhost:8080`

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd nutrition-tracker-pwa

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

## 📚 Documentación

- [Arquitectura](./docs/ARCHITECTURE.md) - Estructura y patrones
- [Gestión de Estado](./docs/STATE_MANAGEMENT.md) - Context y hooks
- [Routing](./docs/ROUTING.md) - Configuración de rutas
- [Styling](./docs/STYLING.md) - Sistema de diseño
- [Contribuir](./docs/CONTRIBUTING.md) - Guía para desarrolladores

## 🏗️ Stack Tecnológico

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Styling**: CSS Modules + CSS Variables

## 📦 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # UI components (Button, Input)
├── features/           # Features por módulo
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Dashboard principal
│   ├── profile/       # Perfil de usuario
│   └── foods/         # Gestión de alimentos
├── context/           # React Context providers
├── hooks/             # Custom hooks
├── services/          # API services
├── types/             # TypeScript types
├── styles/            # Estilos globales
└── App.tsx            # Componente raíz
```

## 🔑 Características Principales

- ✅ Autenticación JWT
- ✅ Gestión de perfil de usuario
- ✅ Dashboard con resumen diario
- ✅ Biblioteca de alimentos
- ✅ Registro de comidas por tipo
- ✅ Cálculo automático de macros
- ✅ Diseño responsive
- ✅ Modo oscuro
- ✅ PWA (offline-ready)

## 🎨 Design System

### Colores

```css
--color-primary: #6366f1;
--color-secondary: #8b5cf6;
--color-success: #10b981;
--color-error: #ef4444;
--color-warning: #f59e0b;
```

### Tipografía

```css
--font-family: 'Inter', -apple-system, sans-serif;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
```

### Espaciado

```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en watch mode
npm run test:watch
```

## 🐛 Troubleshooting

### Error: "Network Error"
- Verificar que el backend esté ejecutándose
- Revisar CORS en el backend
- Verificar URL en `apiClient.ts`

### Error: "Module not found"
- Limpiar cache: `rm -rf node_modules package-lock.json`
- Reinstalar: `npm install`

### Build Fails
- Verificar versión de Node.js: `node --version`
- Limpiar dist: `rm -rf dist`
- Rebuild: `npm run build`

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- Desarrollador Principal: [Tu Nombre]
- Contacto: [Tu Email]
