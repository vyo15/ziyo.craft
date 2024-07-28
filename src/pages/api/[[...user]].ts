import { retrieveData, updateData, deleteData } from "@/lib/firebase/service";
import { compare, hash } from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const users = await retrieveData("users");
      const data = users.map((user: any) => {
        delete user.password;
        return user;
      });
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Failed to retrieve data",
      });
    }
  } else if (req.method === "PUT") {
    const { id, data } = req.body;
    console.log(`Received PUT request with id: ${id}, data:`, data); // Logging
    try {
      const users = await retrieveData("users");
      const user = users.find((user: any) => user.id === id);
      if (user) {
        console.log(`Found user:`, user); // Logging
        if (user.password && data.oldPassword) {
          const passwordConfirm = await compare(
            data.oldPassword,
            user.password
          );
          if (!passwordConfirm) {
            return res.status(400).json({
              status: false,
              statusCode: 400,
              message: "Kata sandi lama tidak cocok",
            });
          }
        }

        const updatedData = { ...user, ...data };
        delete updatedData.oldPassword; // Hapus oldPassword dari data yang akan diupdate

        await updateData("users", id, updatedData, (status: boolean) => {
          if (status) {
            res.status(200).json({
              status: true,
              statusCode: 200,
              message: "successfully",
            });
          } else {
            res.status(400).json({
              status: false,
              statusCode: 400,
              message: "failed",
            });
          }
        });
      } else {
        res.status(404).json({
          status: false,
          statusCode: 404,
          message: "User tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error during PUT operation:", error); // Logging
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Failed to update data",
      });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await deleteData("users", id, (status: boolean) => {
        if (status) {
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "successfully",
          });
        } else {
          res.status(400).json({
            status: false,
            statusCode: 400,
            message: "failed",
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Failed to delete data",
      });
    }
  }
}
