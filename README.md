# ProductsManagment

Aplicación móvil de gestión de inventario y productos construida con **React Native** (Expo) y **SQLite** local. Permite llevar un control completo de productos con operaciones CRUD y autenticación de usuarios.

## ✨ Funcionalidades

- **Autenticación local** — Registro, inicio de sesión y recuperación de contraseña.
- **Catálogo de productos** — Lista scrollable con todos los productos registrados.
- **CRUD completo** — Crear, editar y eliminar productos con validaciones.
- **Base de datos local** — Almacenamiento persistente mediante `expo-sqlite`.
- **Datos de demostración** — 20 productos de ejemplo precargados al iniciar por primera vez.

## 📱 Tecnologías

| Tecnología | Versión |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54.0.33 |
| React | 19.1.0 |
| TypeScript | ~5.9.2 |
| React Navigation | ^7.2.4 |
| expo-sqlite | ~16.0.10 |

## 🏗️ Estructura del proyecto

```
src/
├── types.ts                  # Interfaces y tipos de navegación
├── database/
│   └── database.ts           # Capa de acceso a datos SQLite
├── navigation/
│   └── AppNavigator.tsx      # Configuración del stack de navegación
└── screens/
    ├── LoginScreen.tsx       # Pantalla de inicio de sesión / registro
    ├── MainMenuScreen.tsx    # Menú principal con acciones disponibles
    ├── ProductListScreen.tsx # Listado de productos
    └── ProductFormScreen.tsx # Formulario de creación/edición de productos
```

## 🚀 Ejecutar la aplicación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start

# Plataformas específicas
npx expo start --android
npx expo start --ios
npx expo start --web
```

## 📋 Modelo de datos

### Usuario
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria |
| usuario | TEXT | Nombre de usuario (único) |
| contrasenia | TEXT | Contraseña |

### Producto
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria |
| codigo | TEXT | Código del producto (único) |
| nombre | TEXT | Nombre del producto |
| stock | INTEGER | Cantidad en stock |
| descripcion | TEXT | Descripción del producto |
| precio | REAL | Precio unitario |
| disponibilidad_envio | INTEGER | Disponibilidad de envío (0/1) |

## 🧪 Scripts disponibles

- `npm start` — Inicia el servidor de desarrollo de Expo
- `npm run android` — Inicia en dispositivo/emulador Android
- `npm run ios` — Inicia en simulador iOS
- `npm run web` — Inicia en navegador web

## 📄 Licencia

Proyecto académico — trabajo práctico universitario.
