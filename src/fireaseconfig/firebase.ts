import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDlyHPrxb0UMh_9gW0_1T1Wh_mxAPHWppA",
    authDomain: "student-d1dca.firebaseapp.com",
    projectId: "student-d1dca",
    storageBucket: "student-d1dca.firebasestorage.app",
    messagingSenderId: "386157693191",
    appId: "1:386157693191:web:cb6d32cbf77077f12e1da2",
    measurementId: "G-B44W6LGQY5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
