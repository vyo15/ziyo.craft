import bcrypt from "bcrypt";
import { addData, retrieveDataByField } from "../../lib/firebase/service";

export async function signUp(
  userData: {
    update_at?: Date;
    created_at?: Date;
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  Callback: Function
) {
  try {
    const data = await retrieveDataByField("users", "email", userData.email);

    if (!userData.role) {
      userData.role = "member";
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    userData.created_at = new Date();
    userData.update_at = new Date();
    let result;
    addData("users", userData, (res: boolean) => {
      result = res;
      Callback(result);
    });
  } catch (error) {
    console.error("Error signing up:", error);
    Callback(false);
  }
}

export async function signIn(email: string) {
  try {
    const data = await retrieveDataByField("users", "email", email);

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

export async function loginWithGoogle(
  data: {
    id?: string; // Optional because it will be set after adding the user
    email: string;
    role?: string;
    image?: string;
    created_at?: Date;
    update_at?: Date;
    password?: string;
  },
  Callback: (status: boolean, res?: any) => void
) {
  try {
    const user = await retrieveDataByField("users", "email", data.email);

    if (user.length > 0) {
      Callback(true, user[0]);
    } else {
      data.role = "member";
      data.created_at = new Date();
      data.update_at = new Date();
      data.password = "";
      await addData("users", data, (status: boolean, res?: any) => {
        if (status) {
          data.id = res.id;
          Callback(true, data);
        } else {
          Callback(false, null);
        }
      });
    }
  } catch (error) {
    console.error("Error dalam login dengan Google:", error);
    Callback(false, null);
  }
}
