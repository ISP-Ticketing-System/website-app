import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signToken = (payload: { _id: string; email: string }) => {
  return jwt.sign(payload, JWT_SECRET);
};

// edge vercel runtime tidak support untuk menggunakan crypto module jadi untuk verify tidak bisa pakai jsonwebtoken.
// solusinya pakai package lain yaitu "jose"
// referensi : https://github.com/panva/jose/blob/HEAD/docs/jwt/verify/functions/jwtVerify.md#examples
import * as jose from "jose";

// <T> digunakan untuk mengabungkan dinamic type ditambah basic JWT payload dari jose (biar bisa akses value id dan email)
export const verifyWithJose = async <T>(token: string) => {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const { payload } = await jose.jwtVerify<T>(token, secret);

  return payload;
};
