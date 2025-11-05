import { ObjectId } from "mongodb";
import database from "../config/mongodb";
import { SLA, SLAInput, SLASchema } from "../schema/sla_collection";

class SLAModel {
  static collection() {
    return database.collection<SLAInput>("sla");
  }

  static async getAllSLA() {
    return await this.collection().find().toArray();
  }

  static async create(input: SLAInput) {
    const data = SLASchema.parse(input);

    await this.collection().insertOne({ ...data });
  }

  static async update(input: any, id: string) {
    // 1. validasi sla tidak di delete
    const sla = await this.collection()
      .find({ _id: new ObjectId(id) })
      .toArray();

    if (!sla.length || sla[0]?.isDeleted === true) {
      throw {
        message: "SLA not found or already deleted",
        status: 400,
      };
    }

    // 2. validasi dan parsing input
    const data = SLASchema.parse({
      ...input,
    });

    // 3. set tanggal update
    data.updatedAt = new Date();

    // 4. update data di database
    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );

    // 5. cek hasil dan return
    if (!result?._id) {
      throw { message: "SLA not found or not updated", status: 400 };
    }

    return result;
  }

  static async delete(id: string) {
    const findSLA = await this.collection().findOne({
      _id: new ObjectId(id),
    });

    if (!findSLA) {
      throw { message: "SLA not found", status: 404 };
    }

    const isNowDeleted = !findSLA.isDeleted;

    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          isDeleted: isNowDeleted,
          deletedAt: isNowDeleted ? new Date() : null,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result?._id) {
      throw { message: "SLA not found or already deleted", status: 404 };
    }

    return result;
  }
}

export default SLAModel;
