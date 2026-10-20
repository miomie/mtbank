import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Конфигурация из вашего запроса
const firebaseConfig = {
  apiKey: "AIzaSyAdz1trRjspryugNhfMGfDPG49c9Z_UJQI",
  authDomain: "spinlog-ca7b4.firebaseapp.com",
  projectId: "spinlog-ca7b4",
  storageBucket: "spinlog-ca7b4.firebasestorage.app",
  messagingSenderId: "833139573019",
  appId: "1:833139573019:web:9fecd48225bcf7dc3f13be",
  measurementId: "G-MHWJMLYJ6B"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация службы авторизации
export const auth = getAuth(app);