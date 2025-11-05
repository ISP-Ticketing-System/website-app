import { NextResponse } from "next/server";
import UserModel from "@/db/models/UserModel";
import { dateFormat } from "@/helpers/format";

export async function POST(req: Request) {
  const { tickets } = await req.json();

  const combinedRows: any[] = [];

  // HEADER sesuai gambar
  combinedRows.push({
    code: "Kode Tiket",
    description: "Deskripsi",
    category: "Kategori",
    durationInMinutes: "Batas Waktu SLA",
    status: "Status",
    createdBy: "Pembuat Tiket",
    currentHandleBy: "Ditangani oleh",
    escalationRequired: "Eskalasi",
    escalationLevel: "Level Eskalasi",
    createdAt: "Created At",
    customerName: "Data Pelanggan",
    customerId: "",
    logDate: "Catatan Aktivitas",
    logHandleBy: "",
    logStatus: "",
    logAssignedRole: "",
    logIsBreached: "",
    logNotes: "",
  });

  combinedRows.push({
    code: "",
    description: "",
    category: "",
    durationInMinutes: "",
    status: "",
    createdBy: "",
    currentHandleBy: "",
    escalationRequired: "",
    escalationLevel: "",
    createdAt: "",
    customerName: "Nama",
    customerId: "CID",
    logDate: "Waktu Pencatatan",
    logHandleBy: "Ditangani Oleh",
    logStatus: "Status",
    logAssignedRole: "Eskalasi Role",
    logIsBreached: "SLA Terlanggar",
    logNotes: "Catatan",
  });

  for (const ticket of tickets) {
    const logs = ticket.logs || [];
    const slas = ticket.slaHistory || [];

    let isFirst = true;

    // Logs
    for (const log of logs) {
      const userHandleLog = await UserModel.getUserById(log.handleBy);
      const userCreatedTicket = await UserModel.getUserById(ticket.createdBy);
      const userCurrentHandleTiket = await UserModel.getUserById(
        ticket.currentHandlerId
      );

      combinedRows.push({
        code: isFirst ? ticket.code : "",
        description: isFirst ? ticket.description : "",
        category: isFirst ? ticket.ticketCategory : "",
        durationInMinutes: isFirst
          ? slas.length > 0
            ? `${slas[0].durationMinutes} Menit`
            : "0 Menit"
          : "",
        status: isFirst ? ticket.status : "",
        createdBy: isFirst
          ? `${userCreatedTicket.firstName} ${userCreatedTicket.lastName} (${userCreatedTicket.role})`
          : "",
        currentHandleBy: isFirst
          ? `${userCurrentHandleTiket.firstName} ${userCurrentHandleTiket.lastName} (${userCurrentHandleTiket.role})`
          : "",
        escalationRequired: isFirst
          ? ticket.escalationRequired === true
            ? "Ya"
            : "Tidak"
          : "",
        escalationLevel: isFirst ? ticket.escalationLevel : "",
        createdAt: isFirst ? dateFormat(ticket.createdAt) : "",
        customerData: "",
        customerName: isFirst
          ? `${ticket.customerData.firstName} ${ticket.customerData.lastName}`
          : "",
        customerId: isFirst ? ticket.customerData.cid : "",
        logs: "",
        logDate: dateFormat(log.date),
        logHandleBy: `${userHandleLog.firstName} ${userHandleLog.lastName} (${userHandleLog.role})`,
        logStatus: log.status,
        logAssignedRole: log.assignedRole,
        logIsBreached: log.slaStatus
          ? log.slaStatus === "green"
            ? "Tidak"
            : "Ya"
          : "-",
        logNotes: log.note || "",
      });

      isFirst = false;
    }

    // SLA
    // for (const sla of slas) {
    //   combinedRows.push({
    //     code: isFirst ? ticket.code : "",
    //     description: isFirst ? ticket.description : "",
    //     status: isFirst ? ticket.status : "",
    //     createdAt: isFirst ? dateFormat(ticket.createdAt) : "",
    //     handleBy: "",
    //     logStatus: "",
    //     logNote: "",
    //     logDate: "",
    //     slaDate: dateFormat(sla.startedAt),
    //     slaLevel: sla.level,
    //     slaNote: sla.note || "",
    //   });

    //   isFirst = false;
    // }

    // Kalau ga ada Log & SLA, tetap push 1 row
    // if (logs.length === 0 && slas.length === 0) {
    //   combinedRows.push({
    //     code: ticket.code,
    //     description: ticket.description,
    //     status: ticket.status,
    //     createdAt: dateFormat(ticket.createdAt),
    //     handleBy: "",
    //     logStatus: "",
    //     logNote: "",
    //     logDate: "",
    //     slaDate: "",
    //     slaLevel: "",
    //     slaNote: "",
    //   });
    // }
  }
  return NextResponse.json({ combinedRows });
}
// export async function POST(req: Request) {
//   const { tickets } = await req.json();

//   const ticketRows = tickets.map((ticket: any) => ({
//     code: ticket.code,
//     description: ticket.description,
//     status: ticket.status,
//     customerFirstName: ticket.customerData?.firstName || "",
//     customerCID: ticket.customerData?.cid || "",
//     escalationRequired: ticket.escalationRequired,
//     escalationLevel: ticket.escalationLevel,
//     createdAt: dateFormat(ticket.createdAt),
//     updatedAt: dateFormat(ticket.updatedAt),
//   }));

//   const logsRows = await Promise.all(
//     tickets.flatMap((ticket: any) =>
//       (ticket.logs || []).map(async (log: any) => {
//         const userHandle = await UserModel.getUserById(log.handleBy);
//         return {
//           code: ticket.code,
//           date: dateFormat(log.date),
//           status: log.status,
//           handleBy: `${userHandle.firstName} ${userHandle.lastName}`,
//           assignedRole: log.assignedRole,
//           note: log.note,
//         };
//       })
//     )
//   );

//   const slaRows = tickets.flatMap((ticket: any) =>
//     (ticket.slaHistory || []).map((sla: any) => ({
//       code: ticket.code,
//       level: sla.level,
//       handlerRole: sla.handlerRole,
//       startedAt: sla.startedAt,
//       endedAt: sla.endedAt,
//       isBreached: sla.isBreached,
//     }))
//   );

//   return NextResponse.json({ ticketRows, logsRows, slaRows });
// }
