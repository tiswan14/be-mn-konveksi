import ExcelJS from "exceljs";

export async function pesananExcel(res, result) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Pesanan");

    const { periode, summary, data } = result;

    /* ================= HEADER ================= */
    sheet.mergeCells("A1:H1");
    sheet.getCell("A1").value = "LAPORAN PESANAN";
    sheet.getCell("A1").font = { bold: true, size: 14 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.mergeCells("A2:H2");
    sheet.getCell("A2").value = `Periode ${periode.from} s/d ${periode.to}`;
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.addRow([]);

    /* ================= SUMMARY ================= */
    sheet.addRow([
        "Total Pesanan",
        summary.total_pesanan,
        "",
        "Total Transaksi",
        summary.total_transaksi,
        "",
        "Sisa Tagihan",
        summary.total_sisa_tagihan,
    ]).font = { bold: true };

    sheet.addRow([
        "Nilai Pesanan",
        summary.total_nilai_pesanan,
        "",
        "Pendapatan",
        summary.total_pendapatan,
    ]);

    sheet.addRow([]);
    sheet.addRow([]);

    /* ================= TABLE HEADER ================= */
    sheet.columns = [
        { header: "No", key: "no", width: 6 },
        { header: "Customer", key: "customer", width: 25 },
        { header: "Produk", key: "produk", width: 25 },
        { header: "Qty", key: "qty", width: 8 },
        { header: "Total Pesanan", key: "total", width: 18 },
        { header: "Dibayar", key: "dibayar", width: 18 },
        { header: "Sisa Tagihan", key: "sisa", width: 18 },
        { header: "Status", key: "status", width: 18 },
    ];

    const headerRow = sheet.addRow({
        no: "No",
        customer: "Customer",
        produk: "Produk",
        qty: "Qty",
        total: "Total Pesanan",
        dibayar: "Dibayar",
        sisa: "Sisa Tagihan",
        status: "Status",
    });

    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    /* ================= DATA ================= */
    data.forEach((item, i) => {
        const row = sheet.addRow({
            no: i + 1,
            customer: item.customer,
            produk: item.produk,
            qty: item.qty,
            total: item.total_pesanan,
            dibayar: item.pembayaran.jumlah,
            sisa: item.sisa_tagihan,
            status: item.status,
        });

        // Zebra row
        if (i % 2 === 0) {
            row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F9F9F9" },
            };
        }
    });

    /* ================= FORMAT RUPIAH ================= */
    ["E", "F", "G"].forEach((col) => {
        sheet.getColumn(col).numFmt = '"Rp"#,##0';
        sheet.getColumn(col).alignment = { horizontal: "right" };
    });

    sheet.getColumn("A").alignment = { horizontal: "center" };
    sheet.getColumn("D").alignment = { horizontal: "center" };

    /* ================= RESPONSE ================= */
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="laporan-pesanan.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
}
