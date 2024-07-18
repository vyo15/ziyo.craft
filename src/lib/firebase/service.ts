import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import app from "./init";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string): Promise<any[]> {
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

export async function retrieveDataById(
  collectionName: string,
  id: string
): Promise<any> {
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
): Promise<any[]> {
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
  callback: (success: boolean) => void
): Promise<void> {
  try {
    await addDoc(collection(firestore, collectionName), data);
    callback(true); // Pengguna berhasil dibuat
  } catch (error) {
    console.error("Error signing up:", error);
    callback(false);
  }
}

export async function updateData(
  collectionName: string,
  id: string,
  data: any,
  callback: (success: boolean) => void
): Promise<void> {
  try {
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, data);
    callback(true);
  } catch (error) {
    console.error("Error updating data:", error);
    callback(false);
  }
}

export async function deleteData(
  collectionName: string,
  id: string,
  callback: (success: boolean) => void
): Promise<void> {
  try {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
    callback(true); // Pengguna berhasil dihapus
  } catch (error) {
    console.error("Error deleting data:", error);
    callback(false);
  }
}
