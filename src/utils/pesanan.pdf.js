import PDFDocument from "pdfkit";

export function pesananPDF(res, result) {
    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-pesanan.pdf"
    );
    doc.pipe(res);

    const { periode, summary, data } = result;

    const PAGE_WIDTH = 770;
    const START_X = 40;

    const rupiah = (v = 0) =>
        `Rp ${Number(v).toLocaleString("id-ID")}`;

    const tanggal = (d) =>
        new Date(d).toLocaleDateString("id-ID");

    const statusLabel = (s = "") =>
        s.replace(/_/g, " ").toUpperCase();

    /* ================= HEADER ================= */
    doc.font("Helvetica-Bold")
        .fontSize(20)
        .text("LAPORAN PESANAN", { align: "center" });

    doc.moveDown(0.4);
    doc.font("Helvetica")
        .fontSize(10)
        .text(
            `Periode ${tanggal(periode.from)} s/d ${tanggal(periode.to)}`,
            { align: "center" }
        );

    doc.moveDown(0.8);
    doc.moveTo(START_X, doc.y)
        .lineTo(START_X + PAGE_WIDTH, doc.y)
        .stroke();

    /* ================= SUMMARY ================= */
    doc.moveDown(1);

    const summaryText = [
        `Total Pesanan: ${summary.total_pesanan}`,
        `Total Transaksi: ${summary.total_transaksi}`,
        `Nilai Pesanan: ${rupiah(summary.total_nilai_pesanan)}`,
        `Pendapatan: ${rupiah(summary.total_pendapatan)}`,
        `Sisa Tagihan: ${rupiah(summary.total_sisa_tagihan)}`,
    ].join("   |   ");

    doc.font("Helvetica-Bold")
        .fontSize(10)
        .text(summaryText, START_X, doc.y, {
            width: PAGE_WIDTH,
            align: "center",
        });

    doc.moveDown(1.5);

    /* ================= TABLE HEADER ================= */
    const tableY = doc.y;

    doc.rect(START_X, tableY, PAGE_WIDTH, 20).fill("#0d6efd");
    doc.fillColor("#fff").fontSize(9).font("Helvetica-Bold");

    const cols = [
        { t: "No", x: 45, w: 30, a: "center" },
        { t: "Customer", x: 85, w: 150 },
        { t: "Produk", x: 240, w: 180 },
        { t: "Qty", x: 425, w: 40, a: "center" },
        { t: "Total", x: 470, w: 90, a: "right" },
        { t: "Dibayar", x: 565, w: 90, a: "right" },
        { t: "Sisa", x: 660, w: 80, a: "right" },
        { t: "Status", x: 745, w: 65, a: "center" },
    ];

    cols.forEach((c) =>
        doc.text(c.t, c.x, tableY + 6, {
            width: c.w,
            align: c.a || "left",
        })
    );

    /* ================= TABLE BODY ================= */
    let rowY = tableY + 20;
    const rowH = 24;

    doc.font("Helvetica").fontSize(9).fillColor("#212529");

    data.forEach((r, i) => {
        if (i % 2 === 0) {
            doc.rect(START_X, rowY, PAGE_WIDTH, rowH).fill("#f8f9fa");
        }

        doc.fillColor("#212529");

        doc.text(i + 1, 45, rowY + 6, { width: 30, align: "center" });
        doc.text(r.customer, 85, rowY + 6, { width: 150 });
        doc.text(r.produk, 240, rowY + 6, { width: 180 });
        doc.text(r.qty, 425, rowY + 6, { width: 40, align: "center" });
        doc.text(rupiah(r.total_pesanan), 470, rowY + 6, {
            width: 90,
            align: "right",
        });
        doc.text(rupiah(r.pembayaran.jumlah), 565, rowY + 6, {
            width: 90,
            align: "right",
        });
        doc.text(rupiah(r.sisa_tagihan), 660, rowY + 6, {
            width: 80,
            align: "right",
        });

        const statusColor =
            r.status === "SELESAI"
                ? "#198754"
                : r.status === "DIPROSES"
                ? "#fd7e14"
                : "#0d6efd";

        doc.fillColor(statusColor)
            .font("Helvetica-Bold")
            .text(statusLabel(r.status), 745, rowY + 6, {
                width: 65,
                align: "center",
            })
            .font("Helvetica")
            .fillColor("#212529");

        rowY += rowH;
    });

    /* ================= FOOTER ================= */
    doc.moveDown(1.5);
    doc.fontSize(8)
        .fillColor("#6c757d")
        .text("Sistem MN Konveksi • Laporan Pesanan", {
            width: PAGE_WIDTH,
            align: "right",
        });

    doc.end();
}
