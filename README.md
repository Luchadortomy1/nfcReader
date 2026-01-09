# 📱 Checador NFC - Aplicación de Control de Acceso

## 🎯 Descripción del Proyecto

Esta es una aplicación móvil desarrollada en **React Native** con **Expo** que utiliza la tecnología **NFC** del dispositivo para crear un sistema de checador de empleados. La app permite registrar tarjetas NFC de empleados y validar su acceso mediante Firebase Firestore.

## 🏗️ Arquitectura de la Aplicación

### **Componentes Principales:**

1. **HomeScreen** - Pantalla principal con opciones de registro y escaneo
2. **RegisterCardScreen** - Para registrar nuevas tarjetas NFC de empleados
3. **ScanCardScreen** - Para escanear y validar tarjetas (checador)
4. **ResultScreen** - Mostrar resultado del proceso (éxito/error/no encontrado)

### **Servicios:**

- **NFCService** - Manejo de la funcionalidad NFC (lectura de tarjetas)
- **FirebaseService** - Conexión con Firebase Firestore (CRUD de empleados)

### **Navegación:**

- **React Navigation v6** con Stack Navigator
- Transiciones suaves entre pantallas
- Manejo de parámetros entre rutas

## 🛠️ Tecnologías Utilizadas

### **Framework:**
- **React Native** con **Expo SDK 54**
- **TypeScript** para tipado estático

### **Librerías Principales:**
- `react-native-nfc-manager` - Manejo de NFC
- `@react-navigation/native` - Navegación
- `firebase` - Base de datos y backend
- `expo-dev-client` - Desarrollo y testing

### **Base de Datos:**
- **Firebase Firestore** (NoSQL)

## 📊 Estructura de Firebase Firestore

### **Colección: `empleado`**
```javascript
{
  id: "documento_id_auto",
  uid: "A1B2C3D4E5F6G7H8",      // UID único de la tarjeta NFC
  nombre: "Juan Pérez López",    // Nombre completo
  ocupacion: "Supervisor",       // Puesto de trabajo
  registradoEn: timestamp        // Fecha de registro
}
```

### **Colección: `registros_acceso`**
```javascript
{
  id: "documento_id_auto",
  employeeUid: "A1B2C3D4E5F6G7H8", // UID de la tarjeta
  empleado: "Juan Pérez López",      // Nombre del empleado
  ocupacion: "Supervisor",           // Puesto
  tipo: "entrada",                   // "entrada" o "salida"
  timestamp: timestamp               // Fecha y hora del acceso
}
```

## 🔄 Flujo de Pantallas

```
HomeScreen
    ├── RegisterCardScreen → ResultScreen → HomeScreen
    └── ScanCardScreen → ResultScreen → ScanCardScreen/HomeScreen
```

## 📱 Funcionalidades Implementadas

### **1️⃣ Registrar Tarjeta NFC**
- Escanear tarjeta NFC nueva
- Capturar datos del empleado (nombre, ocupación)
- Validar que la tarjeta no esté ya registrada
- Guardar en Firebase con timestamp

### **2️⃣ Escanear Tarjeta (Checador)**
- Detectar tarjeta NFC
- Buscar empleado en Firebase por UID
- Mostrar información del empleado
- Registrar acceso con fecha/hora
- Vibración de confirmación

### **3️⃣ Pantalla de Resultados**
- Mostrar resultado del proceso
- Información del empleado (si aplica)
- Opciones para continuar o volver

## 🔧 Configuración Inicial

### **1. Firebase Setup:**
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Firestore Database
3. Obtener configuración del proyecto
4. Reemplazar datos en `firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### **2. Instalar Dependencias:**
```bash
npm install
```

### **3. Ejecutar la Aplicación:**
```bash
# Desarrollo
npm start

# Android
npm run android

# iOS  
npm run ios
```

## 📱 Limitaciones de iOS con NFC

### **⚠️ Restricciones iOS:**
1. **iPhone 7 o superior** - Modelos anteriores no tienen NFC
2. **iOS 11+** - Versión mínima del sistema
3. **App Store** - Para distribución necesita Apple Developer Account
4. **Permisos** - Requiere configuración específica en Info.plist
5. **Background** - NFC no funciona en segundo plano en iOS

### **✅ Capacidades iOS:**
- Lectura de tarjetas NDEF
- Detección de Tags NFC
- Funciona solo cuando la app está activa

### **🤖 Ventajas Android:**
- Mayor compatibilidad con dispositivos
- Funciona en segundo plano
- Menos restricciones de desarrollo
- Mejor integración con Intent Filters

## 🚀 Pasos para Ejecutar el Proyecto

### **1. Preparación del Entorno:**
```bash
# Verificar Node.js
node --version

# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Verificar instalación
expo --version
```

### **2. Configurar Firebase:**
1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear nuevo proyecto o usar existente
3. Habilitar **Firestore Database**
4. Copiar configuración a `firebaseConfig.ts`
5. Configurar reglas de seguridad (para desarrollo):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### **3. Desarrollo:**
```bash
# Iniciar servidor de desarrollo
npm start

# Escanear QR con Expo Go (móvil)
# O usar simulador/emulador
```

### **4. Testing:**
- **Android**: Usar dispositivo físico con NFC habilitado
- **iOS**: iPhone 7+ con iOS 11+
- **Tarjetas NFC**: Cualquier tarjeta compatible (NTAG213, NTAG215, etc.)

## 🔍 Ejemplos de Código

### **Leer Tarjeta NFC:**
```typescript
// Ejemplo simplificado de NFCService
const nfcData = await NFCService.leerTarjeta();
if (nfcData?.uid) {
  console.log('UID:', nfcData.uid);
}
```

### **Guardar Empleado:**
```typescript
// Ejemplo de registro en Firebase
await FirebaseService.registrarTarjeta({
  uid: "A1B2C3D4E5F6G7H8",
  nombre: "Juan Pérez",
  ocupacion: "Supervisor"
});
```

### **Buscar Empleado:**
```typescript
// Consultar por UID
const empleado = await FirebaseService.buscarEmpleadoPorUID("A1B2C3D4E5F6G7H8");
if (empleado) {
  console.log('Encontrado:', empleado.nombre);
}
```

## 🎓 Para Presentación Escolar

### **Puntos Clave a Mencionar:**

1. **Tecnología NFC** - Cómo funciona la comunicación de campo cercano
2. **Firebase** - Base de datos en la nube, escalable y en tiempo real  
3. **React Native** - Desarrollo multiplataforma con JavaScript
4. **Casos de Uso** - Control de acceso, asistencia, inventarios
5. **Seguridad** - Cada tarjeta tiene UID único e irrepetible

### **Demostración Sugerida:**
1. Mostrar pantalla principal
2. Registrar una tarjeta NFC
3. Demostrar el escaneo y validación
4. Mostrar datos en Firebase Console
5. Explicar limitaciones iOS vs Android

## 🛡️ Consideraciones de Seguridad

### **Para Producción:**
- Implementar autenticación de usuarios
- Configurar reglas de seguridad en Firebase
- Validar datos en el lado servidor
- Encriptar información sensible
- Logs de auditoría

### **Para Desarrollo/Escolar:**
- Firebase en modo de prueba (sin autenticación)
- Datos de ejemplo no sensibles
- Focus en funcionalidad, no en seguridad

## 🔄 Posibles Mejoras Futuras

1. **Autenticación** - Login de administradores
2. **Reportes** - Dashboard con estadísticas
3. **Horarios** - Validación de horarios laborales
4. **Fotos** - Agregar foto del empleado
5. **Backup** - Exportación de datos
6. **Notificaciones** - Alertas de accesos
7. **Biometría** - Combinación NFC + huella dactilar

## 📞 Soporte y Recursos

### **Documentación:**
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev)
- [Firebase](https://firebase.google.com/docs)
- [NFC Manager](https://github.com/revtel/react-native-nfc-manager)

### **Herramientas Útiles:**
- [Expo Go](https://expo.dev/client) - Testing en dispositivo
- [Firebase Console](https://console.firebase.google.com) - Gestión de datos
- [NFC Tools](https://apps.apple.com/app/nfc-tools/id1252962749) - Testing de tarjetas

---

**📱 Proyecto Escolar - Checador de Empleados NFC**  
*Desarrollado con React Native + Expo + Firebase*