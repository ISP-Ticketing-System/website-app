import { hashPassword } from "@/helpers/bcrypt";
import database from "../config/mongodb";
import { UserForm, UserSchema } from "../schema/user_collection";
import { ObjectId } from "mongodb";

class UserModel {
  static collection() {
    return database.collection<UserForm>("users");
  }

  static async create(body: any) {
    // 1. Mengambil hanya field tertentu dari schema UserSchema, sehingga hanya field tersebut yang akan divalidasi.
    // const RegisterSchema = UserSchema.pick({
    //   username: true,
    //   email: true,
    //   password: true,
    //   role: true,
    //   isDeleted: true,
    //   createdAt: true,
    //   updatedAt: true,
    //   deletedAt: true,
    // });

    /* 2. Melakukan parsing & validasi terhadap body (data yang dikirim dari user input)
        safeParse akan mengembalikan objek dengan:
        - success: boolean, apakah validasi berhasil
        - data: hasil parsing jika valid
        - error: detail error jika tidak valid
    */
    const { success, data, error } = UserSchema.safeParse(body);
    // kondisi jika validasi gagal
    if (!success) {
      throw { message: error, status: 400 };
    }

    // 3. Cek duplikat email
    const user = await this.collection().findOne({ email: data.email });
    if (user) {
      throw { message: "email or username already exists", status: 400 };
    }

    // 4. Enkripsi Password
    data.password = hashPassword(data.password);

    // 5. Simpan data ke database
    await this.collection().insertOne({ ...data });
  }

  static async findByEmail(email: string) {
    return await this.collection().findOne({ email });
  }

  static async getAllUser() {
    const users = await this.collection()
      .find({}, { projection: { password: 0 } })
      .toArray();

    return users;
  }

  static async getUserById(id: string) {
    const user = await this.collection()
      .find({ _id: new ObjectId(id) }, { projection: { password: 0 } })
      .toArray();

    return user[0];
  }

  static async update(body: any, id: string) {
    // 1. Ambil schema untuk validasi update (tanpa required password)
    const UpdateSchema = UserSchema.pick({
      username: true,
      email: true,
      password: true,
      role: true,
      firstName: true,
      lastName: true,
      updatedAt: true,
    }).partial(); // <-- bikin semua field jadi optional

    // 2. Validasi input
    const { success, data, error } = UpdateSchema.safeParse(body);
    if (!success) {
      throw { message: error, status: 400 };
    }

    // 3. Cek apakah email baru sudah digunakan oleh user lain (opsional)
    if (data.email) {
      const existingUser = await this.collection().findOne({
        email: data.email,
        _id: { $ne: new ObjectId(id) }, // pastikan bukan user ini sendiri
      });

      if (existingUser) {
        throw { message: "Email already in use", status: 400 };
      }
    }

    // 4. Jika password ada, hash password
    if (data.password) {
      data.password = hashPassword(data.password);
    } else {
      delete data.password; // pastikan tidak mengubah password jika kosong
    }

    // 5. Update waktu update
    data.updatedAt = new Date();

    // 6. Update ke DB
    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );

    if (!result?._id) {
      throw { message: "User not found or not updated", status: 400 };
    }

    const { password, ...user } = result;
    return user;
  }

  static async updatePassword(body: any, id: string) {
    const UpdatePasswordSchema = UserSchema.pick({
      password: true,
      updatedAt: true,
    }).partial(); // <-- bikin semua field jadi optional

    const { success, data, error } = UpdatePasswordSchema.safeParse(body);
    if (!success) {
      throw { message: error, status: 400 };
    }

    if (data.password) {
      data.password = hashPassword(data.password);
    }

    data.updatedAt = new Date();

    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );

    if (!result?._id) {
      throw { message: "User not found or not updated", status: 400 };
    }

    const { password, ...user } = result;
    return user;
  }

  static async delete(id: string) {
    const findUser = await this.collection().findOne({ _id: new ObjectId(id) });

    if (!findUser) {
      throw { message: "User not found", status: 404 };
    }

    const isNowDeleted = !findUser.isDeleted;
    const isActive = findUser.isDeleted === true ? "Active" : "Inactive";

    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: isActive,
          isDeleted: isNowDeleted,
          deletedAt: isNowDeleted ? new Date() : null,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result?._id) {
      throw { message: "User not found or already deleted", status: 404 };
    }

    const { password, ...user } = result;

    return user;
  }
}

export default UserModel;
