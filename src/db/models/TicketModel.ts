import { generateRandomCode } from "@/helpers/generateCode";
import database from "../config/mongodb";
import {
  formCreateValue,
  Log,
  Sla,
  TicketInput,
  TicketOutput,
  TicketSchema,
} from "../schema/ticket_collection";
import { ObjectId } from "mongodb";
import UserModel from "./UserModel";
import CategoryModel from "./CategoryModel";

class TicketModel {
  static collection() {
    return database.collection<TicketOutput>("tickets");
  }

  static async getAllTicket() {
    // const tickets = await this.collection()
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: "customers",
    //         let: { customerIdStr: "$customerId" }, // ambil customerId string dari customer
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: {
    //                 $eq: ["$_id", { $toObjectId: "$$customerIdStr" }],
    //               },
    //             },
    //           },
    //           {
    //             $project: {
    //               firstName: 1, // ambil field yang diperlukan aja
    //               lastName: 1,
    //               idNumber: 1,
    //               idType: 1,
    //               cid: 1,
    //             },
    //           },
    //         ],
    //         as: "customerData",
    //       },
    //     },
    //     {
    //       $unwind: "$customerData",
    //     },
    //     {
    //       $replaceRoot: {
    //         newRoot: {
    //           $mergeObjects: [
    //             "$$ROOT",
    //             {
    //               customerData: {
    //                 firstName: "$customerData.firstName", // rename atau ambil field spesifik
    //                 lastName: "$customerData.lastName", // rename atau ambil field spesifik
    //                 idType: "$customerData.idType", // rename atau ambil field spesifik
    //                 idNumber: "$customerData.idNumber", // rename atau ambil field spesifik
    //                 cid: "$customerData.cid", // rename atau ambil field spesifik
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   ])
    //   .toArray();

    const tickets = await this.collection()
      .aggregate([
        {
          $lookup: {
            from: "customers",
            let: { customerIdStr: "$customerId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", { $toObjectId: "$$customerIdStr" }],
                  },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  idNumber: 1,
                  idType: 1,
                  cid: 1,
                },
              },
            ],
            as: "customerData",
          },
        },
        { $unwind: "$customerData" },

        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$$ROOT",
                {
                  customerData: {
                    firstName: "$customerData.firstName",
                    lastName: "$customerData.lastName",
                    idType: "$customerData.idType",
                    idNumber: "$customerData.idNumber",
                    cid: "$customerData.cid",
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            // tambahkan minDuration dari slaHistory
            minDuration: {
              $min: "$slaHistory.durationMinutes",
            },
          },
        },
        {
          $sort: {
            // urutkan berdasarkan minDuration ascending (tercepat)
            minDuration: 1,
          },
        },

        { $unset: "minDuration" }, // hapus field minDuration dari hasil akhir
      ])
      .toArray();

    let data = await Promise.all(
      tickets.map(async (ticket) => {
        let currentHandleUser = await UserModel.getUserById(
          ticket.currentHandlerId
        );

        let logs = await Promise.all(
          ticket.logs.map(async (log: Log) => {
            let user = await UserModel.getUserById(log.handleBy);
            return {
              ...log,
              handleByUsername: user.username,
              handleByRole: user.role,
            };
          })
        );

        ticket.logs = logs;
        ticket.currentHandleUserData = {
          username: currentHandleUser.username,
          role: currentHandleUser.role,
        };

        return ticket;
      })
    );

    return data;
  }

  static async getTicketById(id: string) {
    const [ticket] = await this.collection()
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        // JOIN: Customer (ambil semua field)
        {
          $lookup: {
            from: "customers",
            let: { customerIdStr: "$customerId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", { $toObjectId: "$$customerIdStr" }],
                  },
                },
              },
              {
                $project: {
                  isDeleted: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  deletedAt: 0,
                },
              },
            ],
            as: "customerData",
          },
        },
        { $unwind: "$customerData" },
        // JOIN: Service (masih boleh pakai project kalau mau)
        {
          $lookup: {
            from: "services",
            let: { serviceIdStr: "$customerData.serviceId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", { $toObjectId: "$$serviceIdStr" }],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  isDeleted: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  deletedAt: 0,
                },
              },
            ],
            as: "customerData.serviceData",
          },
        },
        {
          $unwind: {
            path: "$customerData.serviceData",
            preserveNullAndEmptyArrays: true,
          },
        },

        // REPLACE ROOT (gabungkan service ke customerData.service)
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$$ROOT",
                {
                  customerData: {
                    $mergeObjects: [
                      "$customerData",
                      { service: "$customerData.serviceData" },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          $project: {
            "customerData.serviceData": 0, // opsional: hapus field sementara
          },
        },
      ])
      .toArray();

    if (ticket.length === 0) {
      throw { message: "Data not found", status: 404 };
    }

    let currentHandleUser = await UserModel.getUserById(
      ticket.currentHandlerId
    );

    const logs = await Promise.all(
      ticket.logs.map(async (log: Log) => {
        let user = await UserModel.getUserById(log.handleBy);
        return {
          ...log,
          handleByUsername: user.username,
          handleByRole: user.role,
        };
      })
    );

    ticket.logs = logs;
    ticket.currentHandleUserData = {
      username: currentHandleUser.username,
      role: currentHandleUser.role,
    };

    return ticket;
  }

  static async create(body: formCreateValue, userId: string) {
    let code = `TKT-` + (await generateRandomCode());

    const userHandle = await UserModel.getUserById(userId);
    const selectedCategory = await CategoryModel.getCategoryById(
      body.categoryId
    );

    // jika eskalasi maka buat logSla
    let sla: Sla = {
      level: userHandle.role === "Helpdesk" ? 2 : 1, // level dari sla => 1: Helpdesk, 2: NOC, 3: Super NOC, jika role yang bikin ticket helpdesk maka level 2, jika CS FTTH atau admin maka 1
      handlerRole: userHandle.role === "Helpdesk" ? "NOC" : "Helpdesk", // role user yang di assign. jika role yang bikin ticket helpdesk maka ketika ticket escalate akan ke NOC, jika CS FTTH atau admin maka ke helpdesk
      assignedAt: new Date(), // tanggal ticket di assign ke role tsb
      startedAt: null, // tanggal ticket dikerjakan oleh role tsb, akan muncul data ketika sudah start working oleh helpdesk
      endedAt: null, // tanggal ticket selesai dikerjakan oleh role tsb, akan muncul endedAt ketika sudah ticket selesai (closed atau escalated) di level ini
      durationMinutes: parseInt(selectedCategory.times),
      isBreached: false, // apakah melewati sla atau tidak, false jika tidak melebihi waktu dan true jika melebihi waktu
      isPaused: false, // apakah pause atau tidak, jika mengerjakan ticket lain yang urgent, false jika tidak dan true jika iya
      closedBy: "", // id dari user yang menyelesaikan ticket di tahap ini, akan muncul data ketika ticket sudah ditutup oleh helpdesk
    };

    let log: Log = {
      date: new Date(), // tanggal log ditambahkan
      handleBy: userId, // user yang membuat log (user login)
      assignedRole: body.escalationRequired
        ? userHandle.role === "Helpdesk"
          ? "NOC"
          : "Helpdesk"
        : "-", // assign tugas ke role ["Helpdesk", "NOC", "Super NOC"]
      status: body.escalationRequired ? "Escalated" : "Done",
      note: body.escalationRequired
        ? `Ticket created by ${userHandle.username} (${
            userHandle.role
          }) and assigned to ${
            userHandle.role === "Helpdesk" ? "NOC" : "Helpdesk"
          }`
        : `Ticket created and completed by ${userHandle.username} (${userHandle.role})`,
    };

    let input: TicketInput = {
      ...body,
      ticketCategory: selectedCategory.category,
      code,
      createdBy: userId,
      status: body.escalationRequired ? "Escalated" : "Done",
      currentHandlerId: userId,
      escalationLevel: body.escalationRequired
        ? userHandle.role === "Helpdesk"
          ? 2
          : 1
        : 0,
      slaHistory: body.escalationRequired ? [sla] : [],
      logs: [log],
    };

    const data = TicketSchema.parse({
      ...input,
    });

    await this.collection().insertOne({ ...data });

    return { code };
  }

  static async delete(id: string) {
    // const findTicket = await this.collection().findOne({
    //   _id: new ObjectId(id),
    // });
    // if (!findTicket) {
    //   throw { message: "Data not found", status: 404 };
    // }
    // const isNowDeleted = !findTicket.isDeleted;
    // const lastLog = findTicket.logs?.[findTicket.logs.length - 1];
    // const status = findTicket.isDeleted ? lastLog?.status : "Closed";
    // const result = await this.collection().findOneAndUpdate(
    //   { _id: new ObjectId(id) },
    //   {
    //     $set: {
    //       isDeleted: isNowDeleted,
    //       status,
    //       deletedAt: isNowDeleted ? new Date() : null,
    //       updatedAt: new Date(),
    //     },
    //   },
    //   { returnDocument: "after" }
    // );
    // if (!result?._id) {
    //   throw { message: "Ticket not found or already deleted", status: 404 };
    // }
    // return result;
  }

  static async updateStatus(body: any, id: string, userId: string) {
    const [ticket] = await this.collection()
      .find({ _id: new ObjectId(id) })
      .toArray();

    if (!ticket || ticket.isDeleted === true) {
      throw {
        message: "Ticket not found or already deleted",
        status: 400,
      };
    }

    // update log sla terakhir
    let lastSla = ticket.slaHistory[ticket.slaHistory.length - 1];

    if (body.status === "Started") {
      // jika role tsb klik btn start working
      if (lastSla.isPaused === false) {
        lastSla.startedAt = new Date();
      } else {
        lastSla.isPaused = true;
      }
    } else if (body.status === "Escalated" || body.status === "Done") {
      // jika ticket selesai atau di eskalasi ke role atas
      lastSla.endedAt = new Date();
      lastSla.closedBy = userId;
    } else if (body.status === "In Progress") {
      // jika ada ticket yang lebih urgent dan mengerjakan ticket lain
      lastSla.isPaused = true;
    }

    // menentukan isbreached
    const assignedTime = new Date(lastSla.assignedAt).getTime();
    const now = Date.now(); // Waktu saat ini
    const durationMs = lastSla.durationMinutes * 60 * 1000;

    const breached = now > assignedTime + durationMs;

    lastSla.isBreached = breached;

    const userHandle = await UserModel.getUserById(userId);

    // jika started
    let assignedRole = "-";
    let newStatus = body.status;
    let note = "";
    if (body.status === "Started") {
      if (lastSla.isPaused === false) {
        note = `Ticket processed by ${userHandle.username} (${userHandle.role})`;
      } else {
        note = `Ticket continued by ${userHandle.username} (${userHandle.role})`;
      }
    } else if (body.status === "In Progress") {
      note = `Ticket status changed to In Progress by ${userHandle.username} (${userHandle.role}).\n\n${body.note}`;
    } else if (body.status === "Escalated") {
      // status escalate
      // if (ticket.escalationLevel === 1) {
      //   assignedRole = "NOC";
      // } else if (ticket.escalationLevel === 2) {
      //   assignedRole = "Super NOC";
      // }
      assignedRole = body.assignTo;
      note = `Ticket escalated by ${userHandle.username} (${userHandle.role}), reassigned from ${userHandle.role} to ${assignedRole}\n\n${body.note}`;
    } else if (body.status === "Done") {
      note = `Ticket completed by ${userHandle.username}\n\n${body.note}`;
    }

    let log: Log = {
      date: new Date(),
      handleBy: userId,
      assignedRole,
      status: newStatus,
      slaStatus: lastSla.isBreached ? "red" : "green",
      note,
    };

    //jika status escalated dan terakhir bisa eskalasi ke super NOC
    if (body.status === "Escalated" && lastSla.level < 3) {
      const level = lastSla.level + 1;

      const selectedCategory = await CategoryModel.getCategoryById(
        ticket.categoryId
      );

      const newSla = {
        level,
        // handlerRole: level === 2 ? "NOC" : "Super NOC",
        handlerRole: body.assignTo,
        assignedAt: new Date(),
        startedAt: null,
        endedAt: null,
        durationMinutes: parseInt(selectedCategory.times),
        isBreached: false,
        isPaused: false,
        closedBy: "",
      };

      let result = await this.collection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            escalationLevel: lastSla.level + 1,
          },
          $push: {
            slaHistory: newSla,
          },
        },
        { returnDocument: "after" }
      );

      if (!result?._id) {
        throw { message: "Ticket not found or not updated", status: 400 };
      }
    }

    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: newStatus,
          currentHandlerId: userId,
          [`slaHistory.${ticket.slaHistory.length - 1}`]: lastSla,
          updatedAt: new Date(),
        },
        $push: {
          logs: log,
        },
      },
      { returnDocument: "after" }
    );

    if (!result?._id) {
      throw { message: "Ticket not found or not updated", status: 400 };
    }

    return result;
  }
}

export default TicketModel;
