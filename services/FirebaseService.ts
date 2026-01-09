// services/FirebaseService.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Interfaz para los datos del empleado
export interface Employee {
  id?: string;
  uid: string;          // UID único de la tarjeta NFC
  nombre: string;       // Nombre del empleado
  ocupacion: string;    // Puesto de trabajo
  registradoEn: any;    // Fecha de registro
}

// Interfaz para los registros de acceso
export interface AccessLog {
  id?: string;
  employeeUid: string;  // UID de la tarjeta
  empleado: string;     // Nombre del empleado
  ocupacion: string;    // Puesto
  timestamp: any;       // Fecha y hora del acceso
  tipo: 'entrada' | 'salida'; // Tipo de registro
}

class FirebaseService {
  
  // 📝 Registrar nueva tarjeta NFC
  async registrarTarjeta(employeeData: Omit<Employee, 'id' | 'registradoEn'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'empleado'), {
        ...employeeData,
        registradoEn: serverTimestamp()
      });
      console.log('Tarjeta registrada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error registrando tarjeta:', error);
      throw error;
    }
  }

  // 🔍 Buscar empleado por UID de tarjeta NFC
  async buscarEmpleadoPorUID(uid: string): Promise<Employee | null> {
    try {
      const q = query(collection(db, 'empleado'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Employee;
      
    } catch (error) {
      console.error('Error buscando empleado:', error);
      throw error;
    }
  }

  // 📊 Registrar acceso (entrada/salida)
  async registrarAcceso(employeeData: Employee, tipo: 'entrada' | 'salida'): Promise<void> {
    try {
      await addDoc(collection(db, 'registros_acceso'), {
        employeeUid: employeeData.uid,
        empleado: employeeData.nombre,
        ocupacion: employeeData.ocupacion,
        tipo: tipo,
        timestamp: serverTimestamp()
      });
      console.log(`Acceso de ${tipo} registrado para:`, employeeData.nombre);
    } catch (error) {
      console.error('Error registrando acceso:', error);
      throw error;
    }
  }

  // 📋 Verificar si una tarjeta ya existe
  async existeTarjeta(uid: string): Promise<boolean> {
    const empleado = await this.buscarEmpleadoPorUID(uid);
    return empleado !== null;
  }
}

export default new FirebaseService();