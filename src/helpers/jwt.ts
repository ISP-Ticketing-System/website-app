// Edge Runtime compatible (jose only - no Node.js Buffer dependency)
// referensi : https://github.com/panva/jose/blob/HEAD/docs/jwt/verify/functions/jwtVerify.md#examples
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

// <T> digunakan untuk mengabungkan dinamic type ditambah basic JWT payload dari jose (biar bisa akses value id dan email)
export const verifyWithJose = async <T>(token: string) => {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const { payload } = await jose.jwtVerify<T>(token, secret);

  return payload;
};
