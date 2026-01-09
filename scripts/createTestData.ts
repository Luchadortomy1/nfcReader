// scripts/createTestData.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// 🧪 Script para crear datos de prueba y colecciones automáticamente
export async function crearDatosDePrueba() {
  try {
    console.log('🚀 Creando datos de prueba...');

    // ✅ Crear colección 'empleado' con datos de ejemplo
    const empleado1 = await addDoc(collection(db, 'empleado'), {
      uid: 'EJEMPLO12345678',
      nombre: 'Juan Pérez López',
      ocupacion: 'Supervisor de Ventas',
      registradoEn: serverTimestamp()
    });

    const empleado2 = await addDoc(collection(db, 'empleado'), {
      uid: 'TEST87654321',
      nombre: 'María González',
      ocupacion: 'Desarrolladora',
      registradoEn: serverTimestamp()
    });

    console.log('✅ Empleados creados:', empleado1.id, empleado2.id);

    // ✅ Crear colección 'registros_acceso' con datos de ejemplo
    const registro1 = await addDoc(collection(db, 'registros_acceso'), {
      employeeUid: 'EJEMPLO12345678',
      empleado: 'Juan Pérez López',
      ocupacion: 'Supervisor de Ventas',
      tipo: 'entrada',
      timestamp: serverTimestamp()
    });

    const registro2 = await addDoc(collection(db, 'registros_acceso'), {
      employeeUid: 'TEST87654321',
      empleado: 'María González',
      ocupacion: 'Desarrolladora',
      tipo: 'entrada',
      timestamp: serverTimestamp()
    });

    console.log('✅ Registros creados:', registro1.id, registro2.id);
    console.log('🎉 ¡Colecciones creadas exitosamente!');

    return {
      empleados: [empleado1.id, empleado2.id],
      registros: [registro1.id, registro2.id]
    };

  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  crearDatosDePrueba()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}