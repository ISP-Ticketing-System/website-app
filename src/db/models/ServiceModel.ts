import { ObjectId } from "mongodb";
import database from "../config/mongodb";
import {
  ServiceInput,
  ServiceOutput,
  ServiceSchema,
} from "../schema/service_collection";
import slug from "slug";

class ServiceModel {
  static collection() {
    return database.collection<ServiceOutput>("services");
  }

  static async create(input: ServiceInput) {
    input.slug = slug(input.serviceName, "-");

    // parse, ga butuh kondisi cek success karena otomatis throw error jika terjadi error
    const data = ServiceSchema.parse({
      ...input,
      slug: slug(input.serviceName, "-"),
    });

    // cek duplikat serviceName
    const service = await this.collection().findOne({
      serviceName: data.serviceName,
    });
    if (service) {
      throw { message: "Service name already exists", status: 400 };
    }

    await this.collection().insertOne({ ...data });
  }

  static async getAllService() {
    const services = await this.collection().find({}).toArray();

    return services;
  }

  static async getServiceById(slug: string) {
    const service = await this.collection()
      .find({ slug, isDeleted: false })
      .toArray();

    return service[0];
  }

  static async update(input: ServiceInput, slugService: string) {
    // 1. validasi service tidak di delete
    const service = await this.collection()
      .find({ slug: slugService })
      .toArray();

    if (!service.length || service[0]?.isDeleted === true) {
      throw {
        message: "Service not found or already deleted",
        status: 400,
      };
    }

    // 2. validasi dan parsing input
    const data = ServiceSchema.parse({
      ...input,
      slug: slug(input.serviceName, "-"),
    });

    // 3. cek duplikasi nama service
    if (data.serviceName) {
      const existingServiceName = await this.collection().findOne({
        serviceName: data.serviceName,
        _id: { $ne: new ObjectId(service[0]._id) }, // pastikan bukan service ini sendiri
      });

      if (existingServiceName) {
        throw { message: "Service name already in use", status: 400 };
      }
    }

    // 4. set tanggal update
    data.updatedAt = new Date();

    // 5. update data di database
    const result = await this.collection().findOneAndUpdate(
      { slug },
      { $set: data },
      { returnDocument: "after" }
    );

    // 6. cek hasil dan return
    if (!result?._id) {
      throw { message: "Service not found or not updated", status: 400 };
    }

    return result;
  }

  static async delete(slug: string) {
    const findService = await this.collection().findOne({
      slug: slug,
    });

    if (!findService) {
      throw { message: "Slug not found", status: 404 };
    }

    const isNowDeleted = !findService.isDeleted;
    const isAvailable =
      findService.isDeleted === true ? "Available" : "Unavailable";

    const result = await this.collection().findOneAndUpdate(
      { slug },
      {
        $set: {
          status: isAvailable,
          isDeleted: isNowDeleted,
          deletedAt: isNowDeleted ? new Date() : null,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result?._id) {
      throw { message: "Service not found or already deleted", status: 404 };
    }

    return result;
  }
}

export default ServiceModel;
