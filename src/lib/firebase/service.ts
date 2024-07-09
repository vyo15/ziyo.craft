import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "./init";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
  try {
    const snapshot = await getDocs(collection(firestore, collectionName));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw new Error("Gagal mengambil data");
  }
}

export async function retrieveDataById(collectionName: string, id: string) {
  try {
    const snapshot = await getDoc(doc(firestore, collectionName, id));
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      throw new Error("Dokumen tidak ditemukan");
    }
  } catch (error) {
    console.error("Error retrieving data by ID:", error);
    throw new Error("Gagal mengambil data berdasarkan ID");
  }
}

export async function retrieveDataByField(
  collectionName: string,
  field: string,
  value: string
) {
  const q = query(
    collection(firestore, collectionName),
    where(field, "==", value)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

export async function addData(
  collectionName: string,
  data: any,
  Callback: Function
) {
  try {
    await addDoc(collection(firestore, collectionName), data);
    Callback(true); // Pengguna berhasil dibuat
  } catch (error) {
    console.error("Error signing up:", error);
    Callback(false);
  }
}
