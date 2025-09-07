import { Hono } from "hono";
import { mightFail } from "might-fail";
import { db } from "../db";
import { appointments as appointmentsTable } from "../schemas/appointments";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";

export const appointmentsRouter = new Hono()
  .get("/:userId", async (c) => {
    const userId = c.req.param("userId");
    if (!userId) {
      return c.json({ error: "userId parameter is required." }, 400);
    }
    const { result: appointmentsQueryResult, error: appointmentsQueryError } =
      await mightFail(
        db
          .select()
          .from(appointmentsTable)
          .where(eq(appointmentsTable.userId, userId))
      );
    if (appointmentsQueryError) {
      throw new HTTPException(500, {
        message: "Error occurred when fetching user appointments.",
        cause: appointmentsQueryError,
      });
    }
    return c.json({ chats: appointmentsQueryResult });
  })
  .post(
    "/",
    zValidator(
      "json",
      createInsertSchema(appointmentsTable).omit({
        appointmentId: true,
        createdAt: true,
      })
    ),
    async (c) => {
      const insertValues = c.req.valid("json");
      const { error: appointmentInsertError, result: appointmentInsertResult } =
        await mightFail(
          db
            .insert(appointmentsTable)
            .values({
              userId: insertValues.userId,
              date: insertValues.date,
              type: insertValues.type,
              duration: insertValues.duration,
              price: insertValues.price,
            })
            .returning()
        );
      if (appointmentInsertError) {
        console.log("Error while creating appointment");
        throw new HTTPException(500, {
          message: "Error while creating chat",
          cause: appointmentInsertError,
        });
      }
      return c.json({ user: appointmentInsertResult[0] }, 200);
    }
  );
