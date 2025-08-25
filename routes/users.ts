import { Hono } from "hono";
import { users as usersTable } from "../schemas/users";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { mightFail } from "might-fail";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { randomUUIDv7 } from "bun";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export const usersRouter = new Hono()
  .post(
    "/",
    zValidator(
      "json",
      createInsertSchema(usersTable).omit({
        userId: true,
        createdAt: true,
      })
    ),
    async (c) => {
      const insertValues = c.req.valid("json");
      const { error: emailQueryError, result: emailQueryResult } =
        await mightFail(
          db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, insertValues.email))
        );
      if (emailQueryError) {
        throw new HTTPException(500, {
          message: "Error while fetching user",
          cause: emailQueryResult,
        });
      }
      if (emailQueryResult.length > 0) {
        return c.json(
          { message: "An account with this email already exists" },
          409
        );
      }
      const encrypted = await hashPassword(insertValues.password);
      const userId = randomUUIDv7();
      const { error: userInsertError, result: userInsertResult } =
        await mightFail(
          db
            .insert(usersTable)
            .values({
              userId: userId,
              email: insertValues.email,
              password: encrypted,
            })
            .returning()
        );
      if (userInsertError) {
        console.log("Error while creating user");
        throw new HTTPException(500, {
          message: "Error while creating user",
          cause: userInsertResult,
        });
      }
      return c.json({ user: userInsertResult[0] }, 200);
    }
  )
  .get(async (c) => {
    const { error: usersQueryError, result: usersQueryResult } =
      await mightFail(db.select().from(usersTable));
    if (usersQueryError) {
      throw new HTTPException(500, {
        message: "Error while fetching users",
        cause: usersQueryError,
      });
    }
    return c.json(
      {
        users: [
          {
            userId: "example",
            email: "example",
            password: "example",
            createdAt: new Date(),
          },
          {
            userId: "example2",
            email: "example2",
            password: "example2",
            createdAt: new Date(),
          },
        ],
      },
      200
    );
  })
  .post(
    "/update/password",
    zValidator(
      "json",
      createInsertSchema(usersTable).omit({
        email: true,
        createdAt: true,
      })
    ),
    async (c) => {
      const updateValues = c.req.valid("json");
      const encrypted = await hashPassword(updateValues.password);
      const { error: queryError, result: newUserResult } = await mightFail(
        db
          .update(usersTable)
          .set({ password: encrypted })
          .where(eq(usersTable.userId, updateValues.userId))
          .returning()
      );
      if (queryError) {
        throw new HTTPException(500, {
          message: "Error updating users table",
          cause: queryError,
        });
      }
      return c.json({ newUser: newUserResult[0] }, 200);
    }
  )
  .get("/:userId", async (c) => {
    const userId = c.req.param("userId");
    if (!userId) {
      return c.json({ error: "userId parameter is required." }, 400);
    }
    const { result: userQueryResult, error: userQueryError } = await mightFail(
      db
        .select({
          userId: usersTable.userId,
          email: usersTable.email,
          password: usersTable.password,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.userId, userId))
    );
    if (userQueryError) {
      throw new HTTPException(500, {
        message: "Error occurred when fetching user chats.",
        cause: userQueryError,
      });
    }
    return c.json({ fetchedUser: userQueryResult });
  });
