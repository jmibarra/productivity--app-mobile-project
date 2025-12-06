# Aplicación de Productividad Mobile 📱

¡Bienvenido al repositorio de la **Versión Mobile** de nuestra Aplicación de Tareas y Productividad! 🚀
Este proyecto es el frontend mobile desarrollado con **React Native** y **Expo**, diseñado para llevar tu productividad a cualquier lugar.

---

## Características Principales

- **Gestión de Tareas**: Visualiza y administra tus pendientes. 📝
- **Notas y Hábitos**: Accede a tus notas y racha de hábitos. 📅
- **Autenticación**: Login seguro integrado con nuestra API. 🔐
- **Navegación Intuitiva**: Interfaz optimizada con pestañas para fácil acceso. 📲

---

## Requisitos Previos

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/client) en tu dispositivo móvil (Android/iOS) o un emulador configurado.
- La API del proyecto corriendo localmente (ver: [productivity-app-ts-api-project](https://github.com/jmibarra/productivity-app-ts-api-project))

## Instalación y Ejecución

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/jmibarra/productivity--app-mobile-project.git
   cd productivity-app-mobile-project
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Configura la API**:
   Asegúrate de configurar la IP de tu servidor backend en `src/constants/config.js`.

   ```javascript
   // src/constants/config.js
   export const API_URL = "http://TU_IP_LOCAL:443";
   // Ejemplo: http://192.168.1.13:443
   ```

   > **Nota**: Para dispositivos físicos, usa la IP de tu red local. Para emulador Android, `10.0.2.2` suele funcionar.

4. **Inicia el proyecto**:
   ```bash
   npx expo start
   ```
   Escanea el código QR con Expo Go o presiona `a` (Android) / `i` (iOS) para abrir en emulador.

---

## Contribuye con Nosotros

¡Todas las contribuciones son bienvenidas! 🎉

### Pasos para contribuir:

1. **Fork del repositorio**.
2. **Clona tu fork**: `git clone https://github.com/TU_USUARIO/productivity--app-mobile-project.git`
3. **Crea una rama**: `git checkout -b feature/nueva-funcionalidad`
4. **Commitea tus cambios**: `git commit -m "Agrega nueva funcionalidad"`
5. **Push a tu fork**: `git push origin feature/nueva-funcionalidad`
6. **Abre un Pull Request**.

---

## Reporta un Problema 🐛

Si encuentras errores o tienes sugerencias, por favor abre un issue en nuestro tablero:
👉 [Reportar Issue](https://github.com/jmibarra/productivity--app-mobile-project/issues)

---

## Comunícate 📬

Dudas o consultas: [jmibarra86@gmail.com](mailto:jmibarra86@gmail.com)

---

## Apoyanos ☕

Tu colaboración nos ayuda a seguir mejorando.

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_1.svg)](https://cafecito.app/jmibarradev)
