import { retrieveData, updateData } from "@/lib/firebase/service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const users = await retrieveData("users");
    const data = users.map((user: any) => {
      delete user.password;
      return user;
    });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "successfully",
      data: users,
    });
  } else if (req.method == "PUT") {
    const { id, data } = req.body;
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
  }
}
