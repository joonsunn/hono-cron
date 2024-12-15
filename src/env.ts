import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MODE: z.string().default("development"),
  USER_TABLE_RESET_ENDPOINT: z.string().optional().default(""),
  ADMIN_SECRET: z.string(),
});

export type Environment = z.infer<typeof envSchema>;

export function getEnv(data: any) {
  const { data: env, error } = envSchema.safeParse(data);

  if (error) {
    const errorMessage = JSON.stringify(error, null, 2);
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  return env;
}
