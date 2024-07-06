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
import bcrypt from "bcrypt";

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

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  Callback: Function
) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", userData.email)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      Callback(false); // Pengguna sudah ada
      return;
    }

    if (!userData.role) {
      userData.role = "member";
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    await addDoc(collection(firestore, "users"), userData);
    Callback(true); // Pengguna berhasil dibuat
  } catch (error) {
    console.error("Error signing up:", error);
    Callback(false);
  }
}

export async function signIn(email: string) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", email)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("SignIn data:", data);

    if (data.length > 0) {
      return data[0];
    } else {
      return null; // Pengguna tidak ditemukan
    }
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Gagal masuk");
  }
}

export async function loginWithGoogle(data: any, Callback: Function) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", data.email)
    );
    const snapshot = await getDocs(q);
    const user = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("loginWithGoogle data:", user);

    if (user.length > 0) {
      Callback(user[0]);
    } else {
      data.role = "member";
      await addDoc(collection(firestore, "users"), data).then(() => {
        console.log("Pengguna baru dibuat:", data);
        Callback(data);
      });
    }
  } catch (error) {
    console.error("Error dalam login dengan Google:", error);
    Callback(null);
  }
}
