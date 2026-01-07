import PDFDocument from "pdfkit";

export function pesananPDF(res, result) {
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // ===============================
    // RESPONSE HEADER
    // ===============================
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-pesanan.pdf"
    );
    doc.pipe(res);

    const { periode, summary, data } = result;

    const PAGE_WIDTH = 515;
    const START_X = 40;

    const formatRupiah = (val = 0) =>
        `Rp ${Number(val).toLocaleString("id-ID")}`;

    const formatTanggal = (date) =>
        new Date(date).toLocaleDateString("id-ID");

    const formatStatus = (status = "") =>
        status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    // ===============================
    // HEADER
    // ===============================
    doc.font("Helvetica-Bold").fontSize(20).text("LAPORAN PESANAN", {
        align: "center",
    });

    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11).text(
        `Periode: ${formatTanggal(periode.from)} s/d ${formatTanggal(
            periode.to
        )}`,
        { align: "center" }
    );

    doc.moveDown(0.4);
    doc.fontSize(9).fillColor("#6c757d").text(
        `Dicetak: ${formatTanggal(new Date())} ${new Date().toLocaleTimeString(
            "id-ID"
        )}`,
        { align: "center" }
    );

    doc.moveDown(0.8);
    doc.moveTo(START_X, doc.y).lineTo(START_X + PAGE_WIDTH, doc.y).stroke();

    // ===============================
    // SUMMARY
    // ===============================
    doc.moveDown(1);

    const cardW = 120;
    const cardH = 65;
    const gap = 10;
    const yCard = doc.y;

    const summaryItems = [
        { label: "TOTAL PESANAN", value: summary.total_pesanan, color: "#0d6efd" },
        { label: "TOTAL TRANSAKSI", value: summary.total_transaksi, color: "#198754" },
        { label: "PENDAPATAN", value: formatRupiah(summary.total_pendapatan), color: "#fd7e14" },
        { label: "TAGIHAN", value: formatRupiah(summary.total_tagihan), color: "#dc3545" },
    ];

    summaryItems.forEach((item, i) => {
        const x = START_X + i * (cardW + gap);
        doc.rect(x, yCard, cardW, cardH).fillAndStroke("#f8f9fa", "#dee2e6");

        doc.font("Helvetica-Bold").fontSize(9).fillColor("#212529");
        doc.text(item.label, x + 8, yCard + 8);

        doc.fontSize(14).fillColor(item.color);
        doc.text(item.value, x + 8, yCard + 30, {
            width: cardW - 16,
        });
    });

    doc.moveDown(4);

    // ===============================
    // TABLE HEADER
    // ===============================
    const tableY = doc.y;
    doc.rect(START_X, tableY, PAGE_WIDTH, 20).fill("#0d6efd");

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff");

    const cols = [
        { text: "No", x: 45, w: 25 },
        { text: "Customer", x: 80, w: 120 },
        { text: "Produk", x: 210, w: 140 },
        { text: "Qty", x: 360, w: 30, align: "center" },
        { text: "Tagihan", x: 395, w: 80, align: "right" },
        { text: "Status", x: 480, w: 70, align: "center" },
    ];

    cols.forEach(c =>
        doc.text(c.text, c.x, tableY + 6, {
            width: c.w,
            align: c.align || "left",
        })
    );

    // ===============================
    // TABLE BODY
    // ===============================
    let rowY = tableY + 20;

    data.forEach((row, i) => {
        const hasPembayaran = row.pembayaran && row.pembayaran.jumlah > 0;
        const rowH = 34; // selalu cukup untuk 2 baris

        if (i % 2 === 0) {
            doc.rect(START_X, rowY, PAGE_WIDTH, rowH).fill("#f8f9fa");
        }

        // ===============================
        // BARIS UTAMA
        // ===============================
        doc.font("Helvetica").fontSize(8).fillColor("#212529");

        doc.text(i + 1, 45, rowY + 8);
        doc.text(row.customer || "-", 80, rowY + 6, { width: 120 });
        doc.text(row.produk || "-", 210, rowY + 8, { width: 140 });
        doc.text(row.qty ?? 0, 360, rowY + 8, { width: 30, align: "center" });
        doc.text(formatRupiah(row.total), 395, rowY + 8, {
            width: 80,
            align: "right",
        });

        // ===============================
        // STATUS PESANAN
        // ===============================
        const statusText = formatStatus(row.status);
        const statusLower = row.status?.toLowerCase();

        const statusColor =
            statusLower === "diproses"
                ? "#fd7e14"
                : statusLower === "selesai"
                    ? "#198754"
                    : statusLower?.includes("menunggu")
                        ? "#0d6efd"
                        : "#6c757d";

        doc.font("Helvetica-Bold").fillColor(statusColor);
        doc.text(statusText, 480, rowY + 8, {
            width: 70,
            align: "center",
        });

        // ===============================
        // SUB BARIS: INFO PEMBAYARAN (DI BAWAH CUSTOMER)
        // ===============================
        doc.font("Helvetica").fontSize(7);

        if (hasPembayaran) {
            doc.fillColor("#198754");
            doc.text(
                `${formatStatus(row.pembayaran.jenis)} • ${formatStatus(row.pembayaran.status)} • ${formatRupiah(row.pembayaran.jumlah)}`,
                80,
                rowY + 20,
                { width: 250 }
            );
        } else {
            doc.fillColor("#dc3545");
            doc.text("Belum Bayar", 80, rowY + 20);
        }

        rowY += rowH;
        doc.y = rowY;
    });


    // ===============================
    // TOTAL
    // ===============================
    doc.moveTo(START_X, rowY + 5)
        .lineTo(START_X + PAGE_WIDTH, rowY + 5)
        .stroke();

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#212529");
    doc.text("TOTAL TAGIHAN", 210, rowY + 12);
    doc.text(formatRupiah(summary.total_tagihan), 395, rowY + 12, {
        width: 80,
        align: "right",
    });

    // ===============================
    // FOOTER
    // ===============================
    doc.moveDown(3);
    doc.font("Helvetica").fontSize(8).fillColor("#6c757d");

    const statusCount = {};
    data.forEach(d => {
        const s = formatStatus(d.status || "Lainnya");
        statusCount[s] = (statusCount[s] || 0) + 1;
    });

    doc.text(
        "Ringkasan Status: " +
        Object.entries(statusCount)
            .map(([s, c]) => `${s}: ${c}`)
            .join(" • "),
        START_X,
        doc.y,
        { width: PAGE_WIDTH }
    );

    doc.moveDown(0.6);
    doc.text(
        "Halaman 1 dari 1 • Dicetak oleh Sistem MN Konveksi",
        { align: "right", width: PAGE_WIDTH }
    );

    doc.end();
}
