import { Request, Response } from "express";
import { Post } from "../types";

const API_URL = "http://20.244.56.144/evaluation-service/posts";
const ACCESS_TOKEN = `Bearer ${process.env.ACCESS_TOKEN}`;

export default async function getPosts(req: Request, res: Response) {
  try {
    const type = req.query.type as string;

    if (!type || !["latest", "popular"].includes(type)) {
      return res.status(400).json({
        error: "Invalid type parameter. Must be 'latest' or 'popular'",
      });
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      res.status(response.status).json({ error: "Failed to fetch posts" });
      return;
    }

    const data = (await response.json()) as Post[];

    if (type === "latest") {
      const latestPosts = data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      res.json(latestPosts);
    } else {
      const maxComments = Math.max(
        ...data.map((post) => post.comments?.length || 0)
      );
      const popularPosts = data.filter(
        (post) => (post.comments?.length || 0) === maxComments
      );
      res.json(popularPosts);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
