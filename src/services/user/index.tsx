import instance from "@/lib/axios/instance";

const userServices = {
  getAllUsers: () => instance.get("/api/user"),
  updateUser: (id: string, data: any) => {
    return instance.put("/api/user", { id, data });
  },
  deleteUser: (id: string) => {
    return instance.delete("/api/user", { data: { id } });
  },
  getProfile: (token: string) => {
    return instance.get("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateProfile: (id: string, data: any, token: string) => {
    return instance.put(
      `/api/user/profile/${id}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

export default userServices;
