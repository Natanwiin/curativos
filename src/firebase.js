import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- importa Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBtWZM0UM7iIP9ywF8YxNNWy5pzvwwb9Lk",
  authDomain: "curativos-pwa.firebaseapp.com",
  projectId: "curativos-pwa",
  storageBucket: "curativos-pwa.appspot.com",
  messagingSenderId: "217883413373",
  appId: "1:217883413373:web:e56abb04d1b67722de1a14",
  measurementId: "G-PD8HGKN1HC"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Serviços que você vai usar
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- adiciona o Firestore
