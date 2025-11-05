import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportTicketsToExcel(tickets: any) {
  const res = await fetch("/api/exports-excel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickets }),
  });

  const { combinedRows } = await res.json();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Tickets");

  // ✅ FIX nomor urut block
  let blockNo = 1;
  combinedRows.forEach((row: any) => {
    if (row.code && row.code !== "Kode Tiket") {
      row.no = blockNo; // assign dulu
      blockNo++; // baru increment
    } else {
      row.no = "";
    }
  });

  // Susun urutan kolom
  const finalRows = combinedRows.map((row: any) => ({
    no: row.no,
    code: row.code,
    description: row.description,
    category: row.category,
    durationInMinutes: row.durationInMinutes,
    status: row.status,
    createdBy: row.createdBy,
    currentHandleBy: row.currentHandleBy,
    escalationRequired: row.escalationRequired,
    escalationLevel: row.escalationLevel,
    createdAt: row.createdAt,
    customerName: row.customerName,
    customerId: row.customerId,
    logDate: row.logDate,
    logHandleBy: row.logHandleBy,
    logStatus: row.logStatus,
    logAssignedRole: row.logAssignedRole,
    logIsBreached: row.logIsBreached,
    logNotes: row.logNotes,
  }));

  finalRows.forEach((row: any) => {
    sheet.addRow(Object.values(row));
  });

  // Header merge
  sheet.mergeCells("A1:A2"); // No
  sheet.mergeCells("B1:B2"); // Ticket Code
  sheet.mergeCells("C1:C2"); // Description
  sheet.mergeCells("D1:D2"); // Kategori
  sheet.mergeCells("E1:E2"); // Batas Waktu SLA
  sheet.mergeCells("F1:F2"); // Status
  sheet.mergeCells("G1:G2"); // Pembuat Tiket
  sheet.mergeCells("H1:H2"); // Ditangani oleh
  sheet.mergeCells("I1:I2"); // Eskalasi
  sheet.mergeCells("J1:J2"); // Level Eskalasi
  sheet.mergeCells("K1:K2"); // Tanggal Dibuat
  sheet.mergeCells("L1:M1"); // Data Pelanggan
  sheet.mergeCells("N1:S1"); // Catatan Aktivitas

  sheet.getCell("A1").value = "No";
  sheet.getCell("B1").value = "Kode Tiket";
  sheet.getCell("C1").value = "Deskripsi";
  sheet.getCell("D1").value = "Kategori";
  sheet.getCell("E1").value = "Batas Waktu SLA";
  sheet.getCell("F1").value = "Status";
  sheet.getCell("G1").value = "Pembuat Tiket";
  sheet.getCell("H1").value = "Ditangani oleh";
  sheet.getCell("I1").value = "Eskalasi";
  sheet.getCell("J1").value = "Level Eskalasi";
  sheet.getCell("K1").value = "Tanggal Dibuat";

  sheet.getCell("L2").value = "Nama";
  sheet.getCell("M2").value = "CID";

  sheet.getCell("N2").value = "Waktu Pencatatan";
  sheet.getCell("O2").value = "Ditangani Oleh";
  sheet.getCell("P2").value = "Status";
  sheet.getCell("Q2").value = "Eskalasi Role";
  sheet.getCell("R2").value = "SLA Terlanggar";
  sheet.getCell("S2").value = "Catatan";

  sheet.columns.forEach((col: any) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell: any) => {
      const len = `${cell.value || ""}`.length;
      if (len > maxLength) maxLength = len;
    });
    col.width = maxLength + 2;
  });

  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0070C0" },
  };

  const altRow1 = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF" },
  };
  const altRow2 = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "DCE6F1" },
  };

  for (let i = 1; i <= 2; i++) {
    const row = sheet.getRow(i);
    row.eachCell((cell: any) => {
      cell.fill = headerFill;
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  // === Merge blok A–M + warnai blok per ticket ===
  let rowIdx = 3;
  let isAlt = false;

  while (rowIdx <= sheet.rowCount) {
    const code = sheet.getCell(`B${rowIdx}`).value;
    if (!code) {
      rowIdx++;
      continue;
    }

    let blockSize = 1;
    for (let i = rowIdx + 1; i <= sheet.rowCount; i++) {
      if (sheet.getCell(`B${i}`).value) break;
      blockSize++;
    }

    const start = rowIdx;
    const end = rowIdx + blockSize - 1;

    if (blockSize > 1) {
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].forEach(
        (col) => {
          sheet.mergeCells(`${col}${start}:${col}${end}`);
        }
      );
    }

    for (let i = start; i <= end; i++) {
      sheet.getRow(i).eachCell((cell: any) => {
        cell.fill = isAlt ? altRow2 : altRow1;
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }

    isAlt = !isAlt;
    rowIdx = end + 1;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "tickets.xlsx");
}
