import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvg4aX6K9Wb_JZwZ8-dxJ02QU-bzzSIE0",
  authDomain: "cartrade-c1b98.firebaseapp.com",
  projectId: "cartrade-c1b98",
  storageBucket: "cartrade-c1b98.appspot.com",
  messagingSenderId: "101216331663",
  appId: "1:101216331663:web:bd4edbce4667c1c7d94dfa"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };