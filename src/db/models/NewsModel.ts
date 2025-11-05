import { ObjectId } from "mongodb";
import database from "../config/mongodb";
import { NewsInput, NewsSchema } from "../schema/news_collection";

class NewsModel {
  static collection() {
    return database.collection<NewsInput>("news");
  }

  static async getAllNews() {
    return await this.collection()
      .find()
      .sort({ createdAt: -1 }) // sort descending, terbaru di atas
      .toArray();
    // .find({ isDeleted: false })
  }

  static async getNewsById(id: string) {
    const news = await this.collection()
      .find({ _id: new ObjectId(id), isDeleted: false })
      .toArray();

    if (!news.length) {
      throw {
        message: "News not found or already deleted",
        status: 400,
      };
    }

    return news[0];
  }

  static async create(input: NewsInput) {
    const data = NewsSchema.parse(input);

    await this.collection().insertOne({ ...data });
  }

  static async update(body: any, id: string) {
    // 1. validasi news tidak di delete
    const news = await this.collection()
      .find({ _id: new ObjectId(id) })
      .toArray();

    if (!news.length || news[0]?.isDeleted === true) {
      throw {
        message: "News not found or already deleted",
        status: 400,
      };
    }

    const input: NewsInput = {
      title: body.title,
      content: body.content,
      author: news[0].author,
      isDeleted: news[0].isDeleted,
      createdAt: news[0].createdAt,
      updatedAt: new Date(),
      deletedAt: news[0].deletedAt,
    };

    // 2. validasi dan parsing input
    const data = NewsSchema.parse(input);

    // 3. update data di database
    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );

    // 4. cek hasil dan return
    if (!result?._id) {
      throw { message: "News not found or not updated", status: 400 };
    }

    return result;
  }

  static async delete(id: string) {
    const findNews = await this.collection().findOne({
      _id: new ObjectId(id),
    });

    if (!findNews) {
      throw { message: "News not found", status: 404 };
    }

    const isNowDeleted = !findNews.isDeleted;

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
      throw { message: "News not found or already deleted", status: 404 };
    }

    return result;
  }
}

export default NewsModel;
