# NFC Checador - Sistema de Control de Acceso

Una aplicación móvil desarrollada en React Native/Expo para el control de acceso de empleados mediante tarjetas NFC, con integración a Firebase para el almacenamiento de datos.

## 🚀 Características Principales

- *Lectura de tarjetas NFC*: Detecta y lee tarjetas NFC/RFID para identificación de empleados
- *Registro de empleados*: Permite asociar tarjetas NFC con información de empleados
- *Control de acceso*: Registra entradas y salidas de empleados automáticamente
- *Base de datos en tiempo real*: Utiliza Firebase Firestore para sincronización de datos
- *Interfaz intuitiva*: Navegación simple y amigable para el usuario

## 📱 Tecnologías Utilizadas

- *React Native* (0.81.5) - Framework de desarrollo móvil
- *Expo* (~54.0.31) - Plataforma de desarrollo y despliegue
- *TypeScript* (~5.9.2) - Tipado estático para JavaScript
- *Firebase* (12.7.0) - Base de datos y servicios backend
- *React Navigation* (7.x) - Navegación entre pantallas
- *react-native-nfc-manager* (3.17.2) - Manejo de NFC

## 📂 Estructura del Proyecto

nfcReader/
├── App.tsx                    # Componente principal y configuración de navegación
├── index.ts                   # Punto de entrada de la aplicación
├── package.json              # Dependencias y scripts
├── app.json                  # Configuración de Expo
├── firebaseConfig.ts         # Configuración de Firebase
├── eas.json                  # Configuración para Expo Application Services
├── tsconfig.json             # Configuración de TypeScript
├── assets/                   # Recursos estáticos (imágenes, iconos)
├── components/
│   └── ErrorBoundary.tsx     # Manejo de errores de React
├── screens/
│   ├── HomeScreen.tsx        # Pantalla principal
│   ├── RegisterCardScreen.tsx # Registro de nuevas tarjetas
│   ├── ScanCardScreen.tsx    # Escaneado de tarjetas NFC
│   └── ResultScreen.tsx      # Resultados del escaneo
├── services/
│   ├── NFCService.ts         # Servicio para manejo de NFC
│   └── FirebaseService.ts    # Servicio para Firebase
├── types/
│   └── navigation.ts         # Tipos de TypeScript para navegación
└── scripts/
    └── createTestData.ts     # Script para crear datos de prueba


## 📋 Uso de la Aplicación

### Pantalla Principal (HomeScreen)
- Verifica el estado del NFC del dispositivo
- Navega a las diferentes funcionalidades de la app

### Registro de Tarjetas (RegisterCardScreen)
1. Acerca la tarjeta NFC al dispositivo
2. Introduce los datos del empleado (nombre, ocupación)
3. La aplicación asocia la tarjeta con la información del empleado
4. Confirma el registro exitoso

### Escaneo de Tarjetas (ScanCardScreen)
1. Acerca una tarjeta NFC registrada al dispositivo
2. La aplicación identifica al empleado
3. Registra automáticamente la entrada/salida
4. Muestra información del empleado y horario

### Resultados (ResultScreen)
- Muestra los detalles del último escaneo
- Información del empleado identificado
- Timestamp del registro
- Opciones para continuar o volver al inicio

## 🔥 Configuración de Firebase

### Firestore Collections

*empleado* (Employees)
{
  uid: string,          // UID único de la tarjeta NFC
  nombre: string,       // Nombre del empleado
  ocupacion: string,    // Puesto de trabajo
  registradoEn: timestamp // Fecha de registro
}

*access_logs* (Registros de Acceso)
{
  employeeUid: string,  // UID de la tarjeta
  empleado: string,     // Nombre del empleado
  ocupacion: string,    // Puesto
  timestamp: timestamp, // Fecha y hora del acceso
  tipo: 'entrada' | 'salida' // Tipo de registro
}

## 📱 Comandos de Desarrollo

# Iniciar en modo desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web (limitado para NFC)
npm run web

# Build para producción
expo build:android
expo build:ios

## 🔒 Permisos Requeridos

### Android
- android.permission.NFC - Acceso al hardware NFC
- android.permission.INTERNET - Conexión a Firebase

### iOS
- NFCReaderUsageDescription - Descripción del uso de NFC
- Entitlements para lectura de NDEF y TAG

## 🐛 Solución de Problemas

### NFC No Funciona
- Verificar que el dispositivo tenga NFC
- Asegurar que NFC esté habilitado en configuración
- Reiniciar la aplicación si es necesario

### Problemas de Firebase
- Verificar configuración en firebaseConfig.ts
- Comprobar reglas de Firestore
- Revisar conexión a internet

### Errores de Compilación
- Limpiar caché: expo r -c
- Reinstalar dependencias: rm -rf node_modules && npm install

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (git checkout -b feature/nueva-funcionalidad)
3. Commit tus cambios (git commit -am 'Añade nueva funcionalidad')
4. Push a la rama (git push origin feature/nueva-funcionalidad)
5. Abre un Pull Request