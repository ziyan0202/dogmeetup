// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
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
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

async function getPosts() {
  const postCol = collection(db, "posts");
  const postSnapshot = await getDocs(postCol);
  const postList = postSnapshot.docs.map((doc) => doc.data());
  return postList;
}
// export default app;
// export { getPosts };
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();
export { auth, getPosts };
