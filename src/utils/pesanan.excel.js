import ExcelJS from "exceljs";

export async function pesananExcel(res, result) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Pesanan");

    const { periode, summary, data } = result;

    // ===============================
    // HEADER
    // ===============================
    sheet.mergeCells("A1:I1");
    sheet.getCell("A1").value = "LAPORAN PESANAN";
    sheet.getCell("A1").font = { bold: true, size: 14 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.mergeCells("A2:I2");
    sheet.getCell("A2").value = `Periode: ${periode.from} s/d ${periode.to}`;
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.addRow([]);

    // ===============================
    // TABLE HEADER
    // ===============================
    sheet.columns = [
        { header: "No", key: "no", width: 5 },
        { header: "Customer", key: "customer", width: 20 },
        { header: "No HP", key: "no_hp", width: 15 },
        { header: "Produk", key: "produk", width: 20 },
        { header: "Harga", key: "harga", width: 15 },
        { header: "Qty", key: "qty", width: 8 },
        { header: "Total", key: "total", width: 18 },
        { header: "Bayar", key: "jenis_bayar", width: 15 },
        { header: "Status", key: "status", width: 15 },
    ];

    sheet.getRow(4).font = { bold: true };

    // ===============================
    // TABLE BODY
    // ===============================
    data.forEach((row) => {
        sheet.addRow({
            no: row.no,
            customer: row.customer,
            no_hp: row.no_hp,
            produk: row.produk,
            harga: row.harga,
            qty: row.qty,
            total: row.total,
            jenis_bayar: row.jenis_bayar,
            status: row.status,
        });
    });

    // ===============================
    // FORMAT ANGKA RUPIAH
    // ===============================
    sheet.getColumn("harga").numFmt = '"Rp "#,##0';
    sheet.getColumn("total").numFmt = '"Rp "#,##0';

    // ===============================
    // SUMMARY
    // ===============================
    sheet.addRow([]);
    sheet.addRow(["Total Pesanan", summary.total_pesanan]);
    sheet.addRow(["Total Transaksi", summary.total_transaksi]);
    sheet.addRow([
        "Total Pendapatan",
        summary.total_pendapatan,
    ]);

    const summaryStartRow = sheet.lastRow.number - 2;

    sheet.getRow(summaryStartRow).font = { bold: true };
    sheet.getRow(summaryStartRow + 1).font = { bold: true };
    sheet.getRow(summaryStartRow + 2).font = { bold: true };

    sheet.getCell(`B${summaryStartRow + 2}`).numFmt = '"Rp "#,##0';

    // ===============================
    // RESPONSE
    // ===============================
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-pesanan.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
}
