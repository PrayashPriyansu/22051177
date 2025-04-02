import express, { RequestHandler } from "express";
import getTopUsers from "./services/getTopUsers";
import getPosts from "./services/getPosts";

const app = express();

app.listen(8000, function () {
  console.log("Server is running on port 8000");
});

app.use(express.json());

app.get("/users", getTopUsers as RequestHandler);
app.get("/posts", getPosts as RequestHandler);
