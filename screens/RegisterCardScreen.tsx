// screens/RegisterCardScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import NFCService from '../services/NFCService';
import FirebaseService from '../services/FirebaseService';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

interface FormData {
  nombre: string;
  ocupacion: string;
  uid?: string;
}

export default function RegisterCardScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    ocupacion: '',
    uid: undefined
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cardDetected, setCardDetected] = useState(false);

  // 📖 Escanear tarjeta NFC para registro
  const escanearTarjeta = async () => {
    setIsScanning(true);
    
    // Ir directo al escaneo sin mostrar cuadro de diálogo
    procederConEscaneo();
  };

  const procederConEscaneo = async () => {
    try {
      const nfcData = await NFCService.leerTarjeta();
      
      if (nfcData && nfcData.uid) {
        // Verificar si la tarjeta ya está registrada
        const yaExiste = await FirebaseService.existeTarjeta(nfcData.uid);
        
        if (yaExiste) {
          Alert.alert(
            'Tarjeta ya registrada',
            'Esta tarjeta NFC ya está registrada en el sistema.',
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          setFormData(prev => ({ ...prev, uid: nfcData.uid }));
          setCardDetected(true);
          Alert.alert(
            'Tarjeta Detectada',
            `Ahora completa la información del empleado.`,
            [{ text: 'Continuar', style: 'default' }]
          );
        }
      } else {
        // Solo mostrar error si realmente falló la lectura (no por cancelación)
        console.log('No se recibió data de NFC (posible cancelación)');
      }
      
    } catch (error) {
      // Solo mostrar error si no fue una cancelación del usuario
      const isCancellation = error.message && (
        error.message.includes('cancelled') || 
        error.message.includes('canceled') ||
        error.message.includes('User canceled') ||
        error.message.includes('Operation was cancelled')
      );
      
      if (!isCancellation) {
        console.error('❌ Error leyendo tarjeta:', error);
        Alert.alert('❌ Error', 'Ocurrió un error al leer la tarjeta');
      } else {
        console.log('ℹ️ Registro de tarjeta cancelado por el usuario');
      }
    } finally {
      setIsScanning(false);
    }
  };

  // 💾 Guardar registro en Firebase
  const guardarRegistro = async () => {
    // Validaciones
    if (!formData.uid) {
      Alert.alert('Error', 'Primero debe escanear una tarjeta NFC');
      return;
    }

    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!formData.ocupacion.trim()) {
      Alert.alert('Error', 'La ocupación es obligatoria');
      return;
    }

    setIsSaving(true);

    try {
      // Guardar en Firebase
      const documentId = await FirebaseService.registrarTarjeta({
        uid: formData.uid,
        nombre: formData.nombre.trim(),
        ocupacion: formData.ocupacion.trim()
      });

      console.log('Empleado registrado con ID:', documentId);

      // Navegar a pantalla de resultado exitoso
      navigation.navigate('Result', {
        type: 'success',
        message: `Tarjeta registrada exitosamente ${formData.nombre}.  ${formData.ocupacion}`,
        employee: {
          nombre: formData.nombre,
          ocupacion: formData.ocupacion,
          uid: formData.uid
        }
      });

      // Limpiar formulario
      setFormData({ nombre: '', ocupacion: '', uid: undefined });
      setCardDetected(false);

    } catch (error) {
      console.error('❌ Error guardando registro:', error);
      Alert.alert(
        '❌ Error al Guardar',
        'No se pudo registrar la tarjeta. Intenta nuevamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Tarjeta</Text>
        <Text style={styles.subtitle}>Nueva tarjeta de empleado</Text>
      </View>

      <View style={styles.content}>
        
        {/* Paso 1: Escanear tarjeta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paso 1: Escanear Tarjeta NFC</Text>
          
          <TouchableOpacity
            style={[
              styles.scanButton,
              isScanning && styles.scanButtonActive,
              cardDetected && styles.scanButtonSuccess
            ]}
            onPress={escanearTarjeta}
            disabled={isScanning || isSaving}
          >
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.scanButtonText}>Escaneando...</Text>
              </View>
            ) : cardDetected ? (
              <View style={styles.scanningContainer}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.scanButtonText}>
                  Tarjeta Detectada{'\n'}
                  {formData.uid?.substring(0, 12)}...
                </Text>
              </View>
            ) : (
              <View style={styles.scanningContainer}>
                <Text style={styles.scanButtonText}>Tocar para Escanear</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Paso 2: Información del empleado */}
        <View style={[styles.section, !cardDetected && styles.sectionDisabled]}>
          <Text style={styles.sectionTitle}>Paso 2: Datos del Empleado</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre Completo *</Text>
            <TextInput
              style={[styles.textInput, !cardDetected && styles.inputDisabled]}
              placeholder="Ej: Juan Pérez López"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
              editable={cardDetected && !isSaving}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ocupación/Puesto *</Text>
            <TextInput
              style={[styles.textInput, !cardDetected && styles.inputDisabled]}
              placeholder="Ej: Supervisor de Ventas"
              placeholderTextColor="#999"
              value={formData.ocupacion}
              onChangeText={(text) => setFormData(prev => ({ ...prev, ocupacion: text }))}
              editable={cardDetected && !isSaving}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Botón de guardar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!cardDetected || !formData.nombre.trim() || !formData.ocupacion.trim()) && styles.saveButtonDisabled
          ]}
          onPress={guardarRegistro}
          disabled={!cardDetected || !formData.nombre.trim() || !formData.ocupacion.trim() || isSaving}
        >
          {isSaving ? (
            <View style={styles.savingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.saveButtonText}>Guardando...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Guardar Registro</Text>
          )}
        </TouchableOpacity>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
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
    color: '#E8F5E8',
    fontWeight: '300',
  },
  content: {
    padding: 20,
  },
  section: {
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
  sectionDisabled: {
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  scanButtonActive: {
    backgroundColor: '#FF9800',
  },
  scanButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  scanningContainer: {
    alignItems: 'center',
  },
  scanIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  successIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});