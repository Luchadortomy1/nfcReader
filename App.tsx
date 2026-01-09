// App.tsx - Aplicación principal del Checador NFC
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

// 🔇 Suprimir warnings y errores visuales en la app (solo en consola)
LogBox.ignoreAllLogs(true); // Ocultar todos los warnings/errores de la UI
console.disableYellowBox = true; // Para versiones anteriores

// Importar tipos de navegación
import { RootStackParamList } from './types/navigation';

// Importar componentes
import ErrorBoundary from './components/ErrorBoundary';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import RegisterCardScreen from './screens/RegisterCardScreen';
import ScanCardScreen from './screens/ScanCardScreen';
import ResultScreen from './screens/ResultScreen';

// Crear el stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ErrorBoundary>
      <StatusBar style="light" backgroundColor="#1976D2" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Ocultamos el header por defecto
            gestureEnabled: true,
            animation: 'slide_from_right'
          }}
        >
          {/* 🏠 Pantalla Principal */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Checador NFC' }}
          />
          
          {/* 🆕 Pantalla de Registro */}
          <Stack.Screen 
            name="RegisterCard" 
            component={RegisterCardScreen}
            options={{ 
              title: 'Registrar Tarjeta',
              gestureEnabled: true 
            }}
          />
          
          {/* 🔍 Pantalla del Scanner */}
          <Stack.Screen 
            name="ScanCard" 
            component={ScanCardScreen}
            options={{ 
              title: 'Escanear Tarjeta',
              gestureEnabled: true 
            }}
          />
          
          {/* 📋 Pantalla de Resultados */}
          <Stack.Screen 
            name="Result" 
            component={ResultScreen}
            options={{ 
              title: 'Resultado',
              gestureEnabled: false // Prevenir swipe back en resultados
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
