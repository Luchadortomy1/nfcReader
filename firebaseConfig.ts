// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase (sustituye con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyBP2fUlP5DK-NWj0x5QvJJw_UVyU_FRBZE",
  authDomain: "nfcreader-73860.firebaseapp.com",
  projectId: "nfcreader-73860",
  storageBucket: "nfcreader-73860.firebasestorage.app",
  messagingSenderId: "851015439574",
  appId: "1:851015439574:web:73409ea3e13b51a1e82577"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);