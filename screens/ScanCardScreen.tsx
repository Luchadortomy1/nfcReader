// screens/ScanCardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Vibration,
  BackHandler
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import NFCService from '../services/NFCService';
import FirebaseService, { Employee } from '../services/FirebaseService';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function ScanCardScreen({ navigation }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    // Auto-iniciar escaneo al entrar a la pantalla
    iniciarEscaneo();
    
    // Manejar el back button para siempre ir al Home
    const backAction = () => {
      limpiarYSalir();
      navigation.navigate('Home');
      return true; // Prevenir el comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
    return () => {
      // Limpiar completamente al salir de la pantalla
      limpiarYSalir();
      backHandler.remove();
    };
  }, []);

  // 🧹 Limpiar estado y procesos NFC
  const limpiarYSalir = () => {
    console.log('🧹 Limpiando estado completamente...');
    setIsScanning(false);
    setScanCount(0);
    
    // Cancelación silenciosa
    NFCService.cancelarDeteccion();
  };

  // 🛑 Solo cancelar escaneo (quedarse en pantalla)
  const cancelarEscaneo = () => {
    console.log('🛑 Cancelando escaneo - quedándose en pantalla');
    setIsScanning(false);
    
    // Cancelación silenciosa
    NFCService.cancelarDeteccion();
  };

  // 🔍 Iniciar proceso de escaneo
  const iniciarEscaneo = () => {
    setIsScanning(true);
    setScanCount(prev => prev + 1);
    
    // Ir directo al escaneo sin mostrar cuadro de diálogo
    procesarEscaneo();
  };

  // 📖 Procesar el escaneo de la tarjeta
  const procesarEscaneo = async () => {
    try {
      const nfcData = await NFCService.leerTarjeta();
      
      if (nfcData && nfcData.uid) {
        console.log('🏷️ Tarjeta escaneada - UID:', nfcData.uid);
        
        // Vibrar para indicar detección
        Vibration.vibrate(200);
        
        // Buscar empleado en Firebase
        await buscarEmpleado(nfcData.uid);
        
      } else {
        // Solo mostrar error si realmente falló la lectura (no por cancelación)
        console.log('ℹ️ No se recibió data de NFC (posible cancelación)');
      }
      
    } catch (error) {
      console.error('❌ Error en procesarEscaneo:', error);
      
      // Si el estado ya se limpió, no hacer nada más
      if (!isScanning) {
        console.log('ℹ️ Estado ya limpiado, ignorando error');
        return;
      }
      
      // Solo mostrar error si no fue una cancelación del usuario
      const isCancellation = error.message && (
        error.message.includes('cancelled') || 
        error.message.includes('canceled') ||
        error.message.includes('User canceled') ||
        error.message.includes('Operation was cancelled') ||
        error.message.includes('Request cancelled')
      );
      
      if (!isCancellation) {
        console.error('❌ Error real en escaneo:', error);
        mostrarErrorEscaneo('Error al procesar la tarjeta');
      } else {
        console.log('ℹ️ Escaneo cancelado por el usuario - quedándose en pantalla');
        // Solo cancelar, no navegar
        setIsScanning(false);
      }
    } finally {
      setIsScanning(false);
    }
  };

  // 🔍 Buscar empleado por UID en Firebase
  const buscarEmpleado = async (uid: string) => {
    try {
      console.log('Buscando empleado con UID:', uid);
      
      const empleado = await FirebaseService.buscarEmpleadoPorUID(uid);
      
      if (empleado) {
        // ✅ Empleado encontrado - registrar acceso
        console.log('Empleado encontrado:', empleado.nombre);
        
        await registrarAcceso(empleado);
        
        // Navegar a pantalla de resultado exitoso
        navigation.navigate('Result', {
          type: 'success',
          message: `Acceso Autorizado ${new Date().toLocaleString('es-MX')}`,
          employee: {
            nombre: empleado.nombre,
            ocupacion: empleado.ocupacion,
            uid: empleado.uid
          }
        });
        
      } else {
        // ❌ Empleado no encontrado
        console.log('Tarjeta no registrada - UID:', uid);
        
        navigation.navigate('Result', {
          type: 'not_found',
          message: `Tarjeta No Registrada, contacta al administrador.`
        });
      }
      
    } catch (error) {
      console.error('Error buscando empleado:', error);
      mostrarErrorEscaneo('Error consultando base de datos');
    }
  };

  // 📊 Registrar el acceso del empleado
  const registrarAcceso = async (empleado: Employee) => {
    try {
      // Determinar tipo de acceso (entrada/salida)
      // Por simplicidad, siempre registramos como "entrada"
      // En un sistema real, aquí podrías implementar lógica más compleja
      const tipoAcceso = 'entrada';
      
      await FirebaseService.registrarAcceso(empleado, tipoAcceso);
      console.log(`Acceso de ${tipoAcceso} registrado para:`, empleado.nombre);
      
    } catch (error) {
      console.error('Error registrando acceso:', error);
      // No interrumpir el flujo, solo loggear el error
    }
  };

  // ❌ Mostrar error de escaneo
  const mostrarErrorEscaneo = (mensaje: string) => {
    navigation.navigate('Result', {
      type: 'error',
      message: `Error de Escaneo, Intenta nuevamente.`
    });
  };

  // 🔄 Reintentar escaneo
  const reintentarEscaneo = () => {
    iniciarEscaneo();
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          limpiarYSalir();
          navigation.navigate('Home');
        }} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checador</Text>
        <Text style={styles.subtitle}>Control de acceso de empleados</Text>
      </View>

      <View style={styles.content}>
        
        {/* Área de escaneo */}
        <View style={styles.scanArea}>
          
          {isScanning ? (
            // Estado escaneando
            <View style={styles.scanningState}>
              <View style={styles.scanningAnimation}>
                <ActivityIndicator size="large" color="#FF9800" />
                <Text style={styles.scanningText}>Escaneando...</Text>
              </View>
              
              <View style={styles.scanningIndicator}>
                <Text style={styles.scanningIcon}>📱</Text>
                <Text style={styles.instructionText}>
                  Mantén la tarjeta NFC cerca{'\n'}del dispositivo hasta detectarla
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelarEscaneo}
              >
                <Text style={styles.cancelButtonText}>Cancelar Escaneo</Text>
              </TouchableOpacity>
            </View>
            
          ) : (
            // Estado inicial/listo para escanear
            <View style={styles.readyState}>
              <Text style={styles.readyIcon}>🎯</Text>
              <Text style={styles.readyTitle}>Listo para Escanear</Text>
              <Text style={styles.readyDescription}>
                Toca el botón para iniciar la detección{'\n'}de tarjetas NFC de empleados
              </Text>
              
              <TouchableOpacity
                style={styles.startScanButton}
                onPress={reintentarEscaneo}
              >
                <Text style={styles.startScanButtonText}>
                  {scanCount === 0 ? '🔍 Iniciar Escaneo' : '🔄 Escanear Otra Vez'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF9800',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF3E0',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scanArea: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 300,
    justifyContent: 'center',
  },
  scanningState: {
    alignItems: 'center',
    width: '100%',
  },
  scanningAnimation: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9800',
    marginTop: 15,
  },
  scanningIndicator: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scanningIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  readyState: {
    alignItems: 'center',
    width: '100%',
  },
  readyIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  readyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  readyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  startScanButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startScanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processInfo: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  processTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  processSteps: {},
  processStep: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 4,
  },
  statsBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#FF8F00',
  },
});