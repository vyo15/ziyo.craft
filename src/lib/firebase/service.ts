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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "./init";

const firestore = getFirestore(app);
const storage = getStorage(app);

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
      return { id: snapshot.id, ...snapshot.data() };
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
  try {
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
  } catch (error) {
    console.error("Error retrieving data by field:", error);
    throw new Error("Gagal mengambil data berdasarkan field");
  }
}

export async function addData(
  collectionName: string,
  data: any,
  callback: (success: boolean, res?: any) => void
): Promise<void> {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), data);
    callback(true, { id: docRef.id });
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
    if (!collectionName || !id || !data) {
      throw new Error("Invalid arguments for updateData");
    }
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
    callback(true);
  } catch (error) {
    console.error("Error deleting data:", error);
    callback(false);
  }
}

export async function uploadFile(userid: string, file: File): Promise<string> {
  if (file.size > 1048576) {
    throw new Error("Ukuran file maksimal 1MB.");
  }

  const newName = "profile." + file.name.split(".").pop();
  const storageRef = ref(storage, `images/users/${userid}/${newName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
