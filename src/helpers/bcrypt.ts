import bcrypt from "bcryptjs";

export const hashPassword = (passowrd: string) => {
    return bcrypt.hashSync(passowrd, 10);
}

export const comparePassword = (passowrd: string, hash: string) => {
    return bcrypt.compareSync(passowrd, hash);
}