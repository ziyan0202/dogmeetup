// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlOR4s_0iGskGF0acN-hfi8sWCMqwfyvE",
  authDomain: "dog-meetup.firebaseapp.com",
  projectId: "dog-meetup",
  storageBucket: "dog-meetup.appspot.com",
  messagingSenderId: "38714583083",
  appId: "1:38714583083:web:e5892008ffa66435a8226e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function getPosts() {
  const postCol = collection(db, "posts");
  const postSnapshot = await getDocs(postCol);
  const postList = postSnapshot.docs.map((doc) => doc.data());
  return postList;
}
export default app;
export { getPosts };
