// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import NFCService from '../services/NFCService';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function HomeScreen({ navigation }: Props) {
  const [nfcStatus, setNfcStatus] = useState<{
    isSupported: boolean;
    isEnabled: boolean;
  }>({ isSupported: false, isEnabled: false });

  useEffect(() => {
    verificarNFC();
  }, []);

  const verificarNFC = async () => {
    const status = await NFCService.verificarEstado();
    setNfcStatus(status);
    
    if (!status.isSupported) {
      Alert.alert(
        'NFC No Soportado',
        'Este dispositivo no tiene capacidades NFC.',
        [{ text: 'OK', style: 'default' }]
      );
    } else if (!status.isEnabled) {
      Alert.alert(
        'NFC Deshabilitado',
        'Por favor habilita NFC en la configuración del dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configuración', onPress: () => {/* Abrir configuración */} }
        ]
      );
    }
  };

  const navegarARegistro = () => {
    if (!nfcStatus.isSupported) {
      Alert.alert('Error', 'NFC no está soportado en este dispositivo');
      return;
    }
    navigation.navigate('RegisterCard');
  };

  const navegarAEscaneo = () => {
    if (!nfcStatus.isSupported) {
      Alert.alert('Error', 'NFC no está soportado en este dispositivo');
      return;
    }
    navigation.navigate('ScanCard');
  };

  const getStatusColor = () => {
    if (!nfcStatus.isSupported) return '#ff4444';
    if (!nfcStatus.isEnabled) return '#ff9500';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (!nfcStatus.isSupported) return 'NFC No Soportado';
    if (!nfcStatus.isEnabled) return 'NFC Deshabilitado';
    return 'NFC Listo';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📱 Checador NFC</Text>
        <Text style={styles.subtitle}>Control de Acceso Empresarial</Text>
      </View>

      {/* Status del NFC */}
      <View style={[styles.statusCard, { borderLeftColor: getStatusColor() }]}>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <TouchableOpacity onPress={verificarNFC} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Botones principales */}
      <View style={styles.buttonsContainer}>
        
        {/* Botón Registrar Tarjeta */}
        <TouchableOpacity
          style={[
            styles.mainButton,
            styles.registerButton,
            !nfcStatus.isSupported && styles.disabledButton
          ]}
          onPress={navegarARegistro}
          disabled={!nfcStatus.isSupported}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>🆕</Text>
            <Text style={styles.buttonTitle}>Registrar Tarjeta</Text>
            <Text style={styles.buttonDescription}>
              Escanear y registrar nueva tarjeta NFC de empleado
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón Escanear/Checador */}
        <TouchableOpacity
          style={[
            styles.mainButton,
            styles.scanButton,
            !nfcStatus.isSupported && styles.disabledButton
          ]}
          onPress={navegarAEscaneo}
          disabled={!nfcStatus.isSupported}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>🔍</Text>
            <Text style={styles.buttonTitle}>Escanear Tarjeta</Text>
            <Text style={styles.buttonDescription}>
              Validar acceso de empleados registrados
            </Text>
          </View>
        </TouchableOpacity>
        
      </View>

      {/* Footer informativo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Proyecto Escolar - Checador de Empleados
        </Text>
        <Text style={styles.versionText}>
          {Platform.OS === 'ios' ? '📱 iOS' : '🤖 Android'} | Versión 1.0.0
        </Text>
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
    backgroundColor: '#1976D2',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    fontWeight: '300',
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    fontSize: 20,
  },
  buttonsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mainButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  scanButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});