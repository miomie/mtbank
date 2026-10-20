import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnoms0QBuuEK2dXLgWVofBEQHxQsFsASI",
  authDomain: "mtbank-5ac9e.firebaseapp.com",
  projectId: "mtbank-5ac9e",
  storageBucket: "mtbank-5ac9e.firebasestorage.app",
  messagingSenderId: "123524755791",
  appId: "1:123524755791:web:59e055d7f0ef861739153a",
  measurementId: "G-1K9J4B1FY9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Экспортируем базу данных