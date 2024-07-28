import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { retrieveDataById, updateData } from "@/lib/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Token not found",
    });
  }

  let decoded: any;

  try {
    decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Invalid token",
    });
  }

  if (req.method === "GET") {
    try {
      const profile: any = await retrieveDataById("users", decoded.id);
      if (profile) {
        profile.id = decoded.id;
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Successfully retrieved profile",
          data: profile,
        });
      } else {
        res.status(404).json({
          status: false,
          statusCode: 404,
          message: "Profile not found",
        });
      }
    } catch (fetchError) {
      console.error("Error retrieving profile:", fetchError);
      return res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Error retrieving profile",
      });
    }
  } else if (req.method === "PUT") {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "ID and data are required",
      });
    }

    try {
      await updateData("users", id, data, (status: boolean) => {
        if (status) {
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Successfully updated",
          });
        } else {
          res.status(400).json({
            status: false,
            statusCode: 400,
            message: "Failed to update",
          });
        }
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Failed to update data",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({
      status: false,
      statusCode: 405,
      message: `Method ${req.method} not allowed`,
    });
  }
}
