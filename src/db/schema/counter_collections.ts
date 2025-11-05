import { WithId } from "mongodb";
import { z } from "zod";
import database from "../config/mongodb";

export const CounterSchema = z.object({
  code: z.string(),
  seq: z.number(),
});

export type CounterForm = z.infer<typeof CounterSchema>;

export type Counter = WithId<CounterForm>;

export const counterCollection = database.collection<CounterForm>("counters");
