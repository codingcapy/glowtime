import { Hono } from "hono";
import { mightFail } from "might-fail";
import { db } from "../db";
import { appointments as appointmentsTable } from "../schemas/appointments";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

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
    return c.json({ appointments: appointmentsQueryResult });
  })
  .post(
    "/",
    zValidator(
      "json",
      createInsertSchema(appointmentsTable)
        .omit({
          appointmentId: true,
          createdAt: true,
        })
        .extend({
          date: z.union([z.date(), z.string().datetime()]),
        })
    ),
    async (c) => {
      const insertValues = c.req.valid("json");
      const appointmentDate =
        typeof insertValues.date === "string"
          ? new Date(insertValues.date)
          : insertValues.date;
      const { error: appointmentInsertError, result: appointmentInsertResult } =
        await mightFail(
          db
            .insert(appointmentsTable)
            .values({
              userId: insertValues.userId,
              date: appointmentDate,
              type: insertValues.type,
              duration: insertValues.duration,
              price: insertValues.price,
            })
            .returning()
        );
      if (appointmentInsertError) {
        console.log("Error while creating appointment");
        throw new HTTPException(500, {
          message: "Error while creating appointment",
          cause: appointmentInsertError,
        });
      }
      return c.json({ appointment: appointmentInsertResult[0] }, 200);
    }
  )
  .get("/", async (c) => {
    const { result: appointmentsQueryResult, error: appointmentsQueryError } =
      await mightFail(db.select().from(appointmentsTable));
    if (appointmentsQueryError) {
      throw new HTTPException(500, {
        message: "Error occurred when fetching user appointments.",
        cause: appointmentsQueryError,
      });
    }
    return c.json({
      appointments: [
        {
          appointmentId: 0,
          userId: "user1",
          date: new Date(),
          type: "hair",
          duration: 123,
          price: 123,
          createdAt: new Date(),
        },
        {
          appointmentId: 1,
          userId: "user2",
          date: new Date(),
          type: "nail",
          duration: 987,
          price: 987,
          createdAt: new Date(),
        },
      ],
    });
  });
