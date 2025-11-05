import { ObjectId } from "mongodb";
import database from "../config/mongodb";
import { CategoryInput, CategorySchema } from "../schema/category_collection";

class CategoryModel {
  static collection() {
    return database.collection<CategoryInput>("categories");
  }

  static async getAllCategory() {
    return await this.collection().find().toArray();
  }

  static async getCategoryById(id: string) {
    const category = await this.collection()
      .find({ _id: new ObjectId(id), isDeleted: false })
      .toArray();

    if (!category) {
      throw {
        message: "Category not found or already deleted",
        status: 400,
      };
    }
    console.log(category, ">>>");

    return category[0];
  }

  static async create(input: CategoryInput) {
    const data = CategorySchema.parse(input);

    await this.collection().insertOne({ ...data });
  }

  static async update(input: any, id: string) {
    // 1. validasi category tidak di delete
    const category = await this.collection()
      .find({ _id: new ObjectId(id) })
      .toArray();

    if (!category.length || category[0]?.isDeleted === true) {
      throw {
        message: "Category not found or already deleted",
        status: 400,
      };
    }

    // 2. validasi dan parsing input
    const data = CategorySchema.parse({
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
      throw { message: "Category not found or not updated", status: 400 };
    }

    return result;
  }

  static async delete(id: string) {
    const findCategory = await this.collection().findOne({
      _id: new ObjectId(id),
    });

    if (!findCategory) {
      throw { message: "Category not found", status: 404 };
    }

    const isNowDeleted = !findCategory.isDeleted;

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
      throw { message: "Category not found or already deleted", status: 404 };
    }

    return result;
  }
}

export default CategoryModel;
