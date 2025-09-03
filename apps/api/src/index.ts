import { Elysia } from "elysia";
const app = new Elysia().get("/", () => "Hello from Elysia API!").listen(3001);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
