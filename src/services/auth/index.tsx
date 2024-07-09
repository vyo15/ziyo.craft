import { register } from "module";
import { addData, retrieveDataByField } from "../../lib/firebase/service";
import instance from "@/lib/axios/instance";

export const authServices = {
  registerAccount: (data: any) => instance.post("/api/user/register", data),
};

export default authServices;