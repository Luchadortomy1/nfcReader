// services/NFCService.ts
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Alert, Platform } from 'react-native';

export interface NFCData {
  uid: string;      // Identificador único de la tarjeta
  payload?: string; // Datos adicionales (opcional)
}

class NFCService {
  private isInitialized = false;

  // 🚀 Inicializar NFC
  async inicializar(): Promise<boolean> {
    try {
      console.log('🚀 Iniciando NFC Manager...');
      
      const isSupported = await NfcManager.isSupported();
      console.log('📱 NFC Soportado:', isSupported);
      
      if (!isSupported) {
        Alert.alert(
          'NFC No Soportado', 
          'Este dispositivo no tiene capacidades NFC o están deshabilitadas.'
        );
        return false;
      }

      const isEnabled = await NfcManager.isEnabled();
      console.log('🔛 NFC Habilitado:', isEnabled);
      
      if (!isEnabled) {
        Alert.alert(
          'NFC Deshabilitado',
          'Por favor habilita NFC en la configuración del dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'OK', style: 'default' }
          ]
        );
        return false;
      }

      await NfcManager.start();
      this.isInitialized = true;
      console.log('✅ NFC inicializado correctamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error inicializando NFC:', error);
      console.error('❌ Detalles:', {
        message: error.message,
        stack: error.stack
      });
      
      Alert.alert(
        'Error NFC', 
        `No se pudo inicializar el lector NFC.\n\nDetalle: ${error.message}`
      );
      return false;
    }
  }

  // 📖 Leer tarjeta NFC
  async leerTarjeta(): Promise<NFCData | null> {
    if (!this.isInitialized) {
      const initialized = await this.inicializar();
      if (!initialized) return null;
    }

    try {
      // Solicitar detección de tarjetas NFC
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // Obtener información de la tarjeta
      const tag = await NfcManager.getTag();
      
      if (!tag || !tag.id) {
        throw new Error('No se pudo obtener el ID de la tarjeta');
      }

      // Convertir el ID a string hexadecimal (maneja diferentes formatos)
      const uid = this.procesarUID(tag.id);
      
      console.log('🏷️ Tarjeta NFC detectada - UID:', uid);
      console.log('🔍 Tipo de ID recibido:', typeof tag.id, tag.id);

      // Intentar leer contenido NDEF (opcional)
      let payload = '';
      try {
        const ndefRecords = await NfcManager.getNdefMessage();
        if (ndefRecords && ndefRecords.length > 0) {
          payload = Ndef.text.decodePayload(ndefRecords[0].payload);
        }
      } catch (ndefError) {
        console.log('ℹ️ No hay datos NDEF en la tarjeta');
      }

      return {
        uid: uid,
        payload: payload
      };

    } catch (error) {
      console.error('❌ Error leyendo tarjeta NFC:', error);
      console.error('❌ Detalles del error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      Alert.alert(
        'Error de Lectura', 
        `No se pudo leer la tarjeta NFC.\n\nDetalle: ${error.message}\n\nInténtalo de nuevo.`
      );
      return null;
    } finally {
      // Cancelar la detección NFC
      this.cancelarDeteccion();
    }
  }

  // ✏️ Escribir datos en tarjeta NFC (opcional para proyecto futuro)
  async escribirTarjeta(texto: string): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.inicializar();
      if (!initialized) return false;
    }

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      const bytes = Ndef.encodeMessage([Ndef.textRecord(texto)]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      
      Alert.alert('✅ Éxito', 'Datos escritos en la tarjeta NFC');
      return true;
      
    } catch (error) {
      console.error('❌ Error escribiendo tarjeta:', error);
      Alert.alert('Error', 'No se pudo escribir en la tarjeta NFC');
      return false;
    } finally {
      this.cancelarDeteccion();
    }
  }

  // ❌ Cancelar detección NFC
  cancelarDeteccion(): void {
    try {
      NfcManager.cancelTechnologyRequest();
      console.log('🛑 Detección NFC cancelada');
    } catch (error) {
      console.log('ℹ️ No había detección activa para cancelar');
    }
  }

  // 🔧 Utility: Procesar UID en diferentes formatos
  private procesarUID(id: any): string {
    try {
      // Si ya es un string hexadecimal, devolverlo limpio
      if (typeof id === 'string') {
        return id.replace(/:/g, '').replace(/-/g, '').toUpperCase();
      }
      
      // Si es un array de números
      if (Array.isArray(id)) {
        return this.convertirArrayAHex(id);
      }
      
      // Si es un Uint8Array o similar
      if (id && typeof id.length !== 'undefined' && typeof id[0] === 'number') {
        const array = Array.from(id);
        return this.convertirArrayAHex(array);
      }
      
      // Como fallback, convertir a string y limpiar
      const stringId = String(id);
      return stringId.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
      
    } catch (error) {
      console.error('❌ Error procesando UID:', error);
      // Fallback: usar timestamp + random como UID temporal
      const timestamp = Date.now().toString(16);
      const random = Math.random().toString(16).substring(2, 8);
      return `TEMP${timestamp}${random}`.toUpperCase();
    }
  }

  // 🔧 Utility: Convertir array de bytes a hexadecimal
  private convertirArrayAHex(array: number[]): string {
    if (!Array.isArray(array)) {
      throw new Error('Se esperaba un array de números');
    }
    
    return array
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  // ℹ️ Verificar estado del NFC
  async verificarEstado(): Promise<{ isSupported: boolean, isEnabled: boolean }> {
    try {
      const isSupported = await NfcManager.isSupported();
      const isEnabled = await NfcManager.isEnabled();
      
      return { isSupported, isEnabled };
    } catch (error) {
      return { isSupported: false, isEnabled: false };
    }
  }

  // 🧹 Cleanup
  async limpiar(): Promise<void> {
    try {
      this.cancelarDeteccion();
      await NfcManager.stop();
      this.isInitialized = false;
      console.log('🧹 NFC Service limpiado');
    } catch (error) {
      console.error('Error limpiando NFC Service:', error);
    }
  }
}

export default new NFCService();