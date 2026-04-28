import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signToken = async (payload: { _id: string; email: string }) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
};
