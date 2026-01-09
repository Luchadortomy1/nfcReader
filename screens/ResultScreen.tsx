// screens/ResultScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Result'>;
}

export default function ResultScreen({ navigation, route }: Props) {
  const { type, message, employee } = route.params;

  const getResultConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          icon: '✅',
          title: 'Acceso Autorizado',
          buttonColor: '#388E3C',
          buttonText: '✨ Perfecto'
        };
      case 'not_found':
        return {
          backgroundColor: '#FF9800',
          icon: '⚠️',
          title: 'Tarjeta No Registrada',
          buttonColor: '#F57C00',
          buttonText: '🔄 Reintentar'
        };
      case 'error':
        return {
          backgroundColor: '#f44336',
          icon: '❌',
          title: 'Error de Proceso',
          buttonColor: '#d32f2f',
          buttonText: '🔄 Reintentar'
        };
      default:
        return {
          backgroundColor: '#9E9E9E',
          icon: 'ℹ️',
          title: 'Resultado',
          buttonColor: '#757575',
          buttonText: '👌 OK'
        };
    }
  };

  const config = getResultConfig();
  const currentTime = new Date().toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const volverAlInicio = () => {
    navigation.navigate('Home');
  };

  const repetirAccion = () => {
    if (type === 'success') {
      // Si fue exitoso, volver al scanner para otro empleado
      navigation.navigate('ScanCard');
    } else {
      // Si hubo error o no se encontró, intentar de nuevo
      navigation.navigate('ScanCard');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      
      {/* Header con resultado */}
      <View style={styles.header}>
        <Text style={styles.resultIcon}>{config.icon}</Text>
        <Text style={styles.resultTitle}>{config.title}</Text>
        <Text style={styles.timestamp}>🕐 {currentTime}</Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        
        {/* Mensaje principal */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        {/* Información del empleado (si existe) */}
        {employee && (
          <View style={styles.employeeCard}>
            <Text style={styles.employeeTitle}>👤 Información del Empleado:</Text>
            <View style={styles.employeeInfo}>
              <View style={styles.employeeRow}>
                <Text style={styles.employeeLabel}>Nombre:</Text>
                <Text style={styles.employeeValue}>{employee.nombre}</Text>
              </View>
              <View style={styles.employeeRow}>
                <Text style={styles.employeeLabel}>Puesto:</Text>
                <Text style={styles.employeeValue}>{employee.ocupacion}</Text>
              </View>
              <View style={styles.employeeRow}>
                <Text style={styles.employeeLabel}>ID Tarjeta:</Text>
                <Text style={styles.employeeValue}>
                  {employee.uid.substring(0, 8)}...
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonsContainer}>
          
          {/* Botón principal (repetir acción) */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: config.buttonColor }]}
            onPress={repetirAccion}
          >
            <Text style={styles.actionButtonText}>{config.buttonText}</Text>
          </TouchableOpacity>

          {/* Botón secundario (volver al inicio) */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={volverAlInicio}
          >
            <Text style={styles.homeButtonText}>🏠 Volver al Inicio</Text>
          </TouchableOpacity>
          
        </View>

        {/* Información adicional según el tipo */}
        <View style={styles.infoSection}>
          {type === 'success' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>✨ Acceso Registrado:</Text>
              <Text style={styles.infoText}>
                • El acceso ha sido registrado correctamente{'\n'}
                • La hora y fecha se guardaron en la base de datos{'\n'}
                • El empleado puede continuar con sus actividades
              </Text>
            </View>
          )}

          {type === 'not_found' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>⚠️ Tarjeta No Registrada:</Text>
              <Text style={styles.infoText}>
                • Esta tarjeta no está en el sistema{'\n'}
                • Contacta al administrador para registrarla{'\n'}
                • Verifica que sea la tarjeta correcta
              </Text>
            </View>
          )}

          {type === 'error' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>❌ Error del Sistema:</Text>
              <Text style={styles.infoText}>
                • Verifica la conexión a internet{'\n'}
                • Asegúrate de que el NFC esté habilitado{'\n'}
                • Intenta acercar más la tarjeta al dispositivo
              </Text>
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
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  employeeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 15,
  },
  employeeInfo: {},
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  employeeLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  employeeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});