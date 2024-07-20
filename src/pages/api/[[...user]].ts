import { retrieveData, updateData, deleteData } from "@/lib/firebase/service";
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
        data: data, // Make sure we are returning the correct data variable
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
    try {
      await updateData("users", id, data, (status: boolean) => {
        if (status) {
          res
            .status(200)
            .json({ status: true, statusCode: 200, message: "successfully" });
        } else {
          res
            .status(400)
            .json({ status: false, statusCode: 400, message: "failed" });
        }
      });
    } catch (error) {
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
          res
            .status(200)
            .json({ status: true, statusCode: 200, message: "successfully" });
        } else {
          res
            .status(400)
            .json({ status: false, statusCode: 400, message: "failed" });
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
