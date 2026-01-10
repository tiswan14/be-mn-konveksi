import ExcelJS from "exceljs";

export async function pesananExcel(res, result) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Pesanan");

    const { periode, summary, data } = result;

    // ===============================
    // HEADER
    // ===============================
    sheet.mergeCells("A1:G1");
    sheet.getCell("A1").value = "LAPORAN PESANAN";
    sheet.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFF" } };
    sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell("A1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2E75B6" } // Biru Office
    };

    sheet.mergeCells("A2:G2");
    sheet.getCell("A2").value = `Periode: ${periode.from} s/d ${periode.to}`;
    sheet.getCell("A2").font = { color: { argb: "FFFFFF" } };
    sheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell("A2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "5B9BD5" } // Biru lebih muda
    };

    sheet.addRow([]);

    // ===============================
    // SUMMARY
    // ===============================
    const summaryRow = sheet.addRow(["Ringkasan"]);
    summaryRow.font = { bold: true, color: { argb: "FFFFFF" } };
    summaryRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF6F00" } // Orange
    };

    sheet.addRow(["Total Pesanan", summary.total_pesanan]);
    sheet.addRow(["Total Transaksi", summary.total_transaksi]);
    sheet.addRow(["Total Nilai Pesanan", summary.total_nilai_pesanan]);
    sheet.addRow(["Total Pendapatan", summary.total_pendapatan]);
    sheet.addRow(["Sisa Tagihan", summary.total_sisa_tagihan]);

    // Warna alternatif untuk baris summary
    for (let i = 1; i <= 5; i++) {
        const rowNum = summaryRow.number + i;
        const row = sheet.getRow(rowNum);
        if (i % 2 === 0) {
            row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F2F2F2" } // Abu-abu muda
            };
        }
    }

    sheet.addRow([]);
    sheet.addRow([]);

    // ===============================
    // TABLE HEADER
    // ===============================
    sheet.columns = [
        { header: "No", key: "no", width: 8 },
        { header: "Customer", key: "customer", width: 30 },
        { header: "Produk", key: "produk", width: 25 },
        { header: "Qty", key: "qty", width: 10 },
        { header: "Total", key: "total", width: 18 },
        { header: "Pembayaran", key: "pembayaran", width: 40 },
        { header: "Status Pesanan", key: "status", width: 25 }
    ];

    // Tambahkan row header
    sheet.addRow({
        no: "No",
        customer: "Customer",
        produk: "Produk",
        qty: "Qty",
        total: "Total",
        pembayaran: "Pembayaran",
        status: "Status Pesanan"
    });

    // Format header tabel
    const headerRow = sheet.getRow(sheet.lastRow.number);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 25;
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" } // Biru header tabel
    };

    // ===============================
    // DATA
    // ===============================
    data.forEach((item, index) => {
        const row = sheet.addRow({
            no: index + 1,
            customer: item.customer,
            produk: item.produk,
            qty: item.qty,
            total: item.total,
            pembayaran:
                item.pembayaran.jenis === "-"
                    ? "BELUM BAYAR"
                    : `${item.pembayaran.jenis} - Rp ${item.pembayaran.jumlah.toLocaleString("id-ID")} (${item.pembayaran.status})`,
            status: item.status
        });

        // Warna latar belakang baris bergantian
        if (index % 2 === 0) {
            row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F9F9F9" } // Abu-abu sangat muda
            };
        }
    });

    // ===============================
    // FORMAT RUPIAH
    // ===============================
    const dataStartRow = 12; // Header tabel
    const totalColumn = sheet.getColumn("E");
    totalColumn.eachCell((cell, rowNumber) => {
        if (rowNumber > dataStartRow) {
            cell.numFmt = '"Rp"#,##0';
            cell.font = { color: { argb: "1E8449" } }; // Hijau untuk angka
        }
    });

    // ===============================
    // BORDER untuk tabel
    // ===============================
    const dataEndRow = dataStartRow + data.length;

    // Border untuk semua sel dalam tabel
    for (let row = dataStartRow; row <= dataEndRow; row++) {
        for (let col = 1; col <= 7; col++) {
            const cell = sheet.getCell(row, col);
            cell.border = {
                top: { style: 'thin', color: { argb: "D9D9D9" } },
                left: { style: 'thin', color: { argb: "D9D9D9" } },
                bottom: { style: 'thin', color: { argb: "D9D9D9" } },
                right: { style: 'thin', color: { argb: "D9D9D9" } }
            };
        }
    }

    // ===============================
    // OTOMATISKAN LEBAR KOLOM
    // ===============================
    // Set lebar kolom otomatis berdasarkan konten
    for (let i = 1; i <= 7; i++) {
        let maxLength = 0;
        const column = sheet.getColumn(i);

        column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 0;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });

        // Set lebar minimum dan tambahkan buffer
        column.width = Math.min(Math.max(maxLength + 3, column.width), 50);
    }

    // ===============================
    // ALIGNMENT untuk seluruh tabel
    // ===============================
    for (let row = dataStartRow; row <= dataEndRow; row++) {
        const currentRow = sheet.getRow(row);
        currentRow.alignment = { vertical: "middle" };

        // Center untuk kolom No dan Qty
        currentRow.getCell("A").alignment = { horizontal: "center", vertical: "middle" };
        currentRow.getCell("D").alignment = { horizontal: "center", vertical: "middle" };

        // Right align untuk kolom Total
        currentRow.getCell("E").alignment = { horizontal: "right", vertical: "middle" };
    }

    // ===============================
    // RESPONSE
    // ===============================
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