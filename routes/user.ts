import { Hono } from "hono";
import { users as usersTable } from "../schemas/users";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { scrypt } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const scryptAsync = promisify(scrypt);

export async function verifyPassword(hash: string, password: string) {
  const parts = hash.split(":");
  if (parts.length !== 2) throw new Error("Invalid hash format");
  const [salt, keyHex] = parts as [string, string];
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return derivedKey.toString("hex") === keyHex;
}

export const userRouter = new Hono()
  .post(
    "/login",
    zValidator(
      "json",
      createInsertSchema(usersTable).omit({
        userId: true,
        createdAt: true,
      })
    ),
    async (c) => {
      try {
        const loginInfo = c.req.valid("json");
        const queryResult = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, loginInfo.email));
        const user = queryResult[0];
        if (!user) return c.json({ result: { user: null, token: null } });
        const isPasswordValid = await verifyPassword(
          user.password,
          loginInfo.password
        );
        if (!isPasswordValid) {
          return c.json({ result: { user: null, token: null } });
        }
        const token = jwt.sign(
          { id: user.userId },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "14 days" }
        );
        return c.json({ result: { user, token } });
      } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({ message: "Internal Server Error" });
      }
    }
  )
  .post("/validation", async (c) => {
    try {
      const authHeader = c.req.header("authorization");
      if (!authHeader) {
        c.status(403);
        return c.json({ message: "Header does not exist" });
      }
      const token = authHeader.split(" ")[1]!;
      const decodedUser = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      const response = await db
        .select()
        .from(usersTable)
        //@ts-ignore
        .where(eq(usersTable.userId, decodedUser.id));
      const user = response[0];
      return c.json({ result: { user, token } });
    } catch (err) {
      c.status(401);
      return c.json({ err });
    }
  });
