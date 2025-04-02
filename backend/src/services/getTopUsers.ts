import { Request, Response } from "express";
import { User } from "../types";

const API_URL = "http://20.244.56.144/evaluation-service/users";
const ACCESS_TOKEN = `Bearer ${process.env.ACCESS_TOKEN}`;

export default async function getTopUsers(req: Request, res: Response) {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      res.status(response.status).json({ error: "Failed to fetch users" });
      return;
    }

    const data = (await response.json()) as User[];

    const topUsers = data
      .sort((a, b) => (b.posts?.length || 0) - (a.posts?.length || 0))
      .slice(0, 5)
      .map((user) => ({
        id: user.id,
        name: user.name,
        postCount: user.posts?.length || 0,
      }));

    res.json(topUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
