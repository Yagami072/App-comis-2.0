import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({ projectId: 'ai-studio-b58d429f-94f9-44f6-ac31-be182a7ba3fd' });
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
  process.exit(0);
}
run();
