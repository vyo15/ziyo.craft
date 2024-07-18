import instance from "@/lib/axios/instance";

export const userServices = {
  getAllUsers: () => instance.get("/api/user"),
  updateUser: (id: string, data: any) => {
    return instance.put("/api/user", { id, data });
  },
  deleteUser: (id: string) => {
    return instance.delete("/api/user", { data: { id } });
  },
};

export default userServices;
