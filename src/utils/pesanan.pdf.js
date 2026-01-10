import PDFDocument from "pdfkit";

export function pesananPDF(res, result) {
    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 40
    });

    // ===============================
    // RESPONSE HEADER
    // ===============================
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-pesanan-landscape.pdf"
    );
    doc.pipe(res);

    const { periode, summary, data } = result;

    // LANDSCAPE WIDTH SETUP
    const PAGE_WIDTH = 770;
    const START_X = 40;

    // ===============================
    // HELPERS
    // ===============================
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
    doc.font("Helvetica-Bold")
        .fontSize(22)
        .text("LAPORAN PESANAN", { align: "center" });

    doc.moveDown(0.3);
    doc.font("Helvetica")
        .fontSize(11)
        .text(
            `Periode: ${formatTanggal(periode.from)} s/d ${formatTanggal(
                periode.to
            )}`,
            { align: "center" }
        );

    doc.moveDown(0.4);
    doc.fontSize(9)
        .fillColor("#6c757d")
        .text(
            `Dicetak: ${formatTanggal(new Date())} ${new Date().toLocaleTimeString(
                "id-ID"
            )}`,
            { align: "center" }
        );

    doc.moveDown(0.8);
    doc.moveTo(START_X, doc.y)
        .lineTo(START_X + PAGE_WIDTH, doc.y)
        .stroke();

    // ===============================
    // SUMMARY CARD
    // ===============================
    doc.moveDown(1);

    const cardW = 170;
    const cardH = 70;
    const gap = 15;
    const yCard = doc.y;

    const summaryItems = [
        {
            label: "TOTAL PESANAN",
            value: summary.total_pesanan,
            color: "#0d6efd"
        },
        {
            label: "TOTAL TRANSAKSI",
            value: summary.total_transaksi,
            color: "#198754"
        },
        {
            label: "TOTAL NILAI PESANAN",
            value: formatRupiah(summary.total_nilai_pesanan),
            color: "#6610f2"
        },
        {
            label: "SISA TAGIHAN",
            value: formatRupiah(summary.total_sisa_tagihan),
            color: "#dc3545"
        }
    ];

    summaryItems.forEach((item, i) => {
        const x = START_X + i * (cardW + gap);
        doc.rect(x, yCard, cardW, cardH)
            .fillAndStroke("#f8f9fa", "#dee2e6");

        doc.font("Helvetica-Bold")
            .fontSize(10)
            .fillColor("#212529")
            .text(item.label, x + 10, yCard + 10);

        doc.fontSize(15)
            .fillColor(item.color)
            .text(item.value, x + 10, yCard + 35, {
                width: cardW - 20
            });
    });

    doc.moveDown(4);

    // ===============================
    // TABLE HEADER
    // ===============================
    const tableY = doc.y;
    doc.rect(START_X, tableY, PAGE_WIDTH, 22).fill("#0d6efd");

    doc.font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#ffffff");

    const cols = [
        { text: "No", x: 45, w: 30, align: "center" },
        { text: "Customer", x: 85, w: 160 },
        { text: "Produk", x: 255, w: 180 },
        { text: "Qty", x: 445, w: 40, align: "center" },
        { text: "Total", x: 495, w: 110, align: "right" },
        { text: "Status", x: 615, w: 120, align: "center" }
    ];

    cols.forEach((c) =>
        doc.text(c.text, c.x, tableY + 7, {
            width: c.w,
            align: c.align || "left"
        })
    );

    // ===============================
    // TABLE BODY
    // ===============================
    let rowY = tableY + 22;
    const rowH = 38;

    data.forEach((row, i) => {
        const hasPembayaran =
            row.pembayaran &&
            row.pembayaran.jumlah > 0 &&
            row.pembayaran.jenis !== "-";

        if (i % 2 === 0) {
            doc.rect(START_X, rowY, PAGE_WIDTH, rowH).fill("#f8f9fa");
        }

        doc.font("Helvetica")
            .fontSize(9)
            .fillColor("#212529");

        doc.text(i + 1, 45, rowY + 10, { width: 30, align: "center" });
        doc.text(row.customer || "-", 85, rowY + 8, { width: 160 });
        doc.text(row.produk || "-", 255, rowY + 10, { width: 180 });
        doc.text(row.qty ?? 0, 445, rowY + 10, {
            width: 40,
            align: "center"
        });
        doc.text(formatRupiah(row.total), 495, rowY + 10, {
            width: 110,
            align: "right"
        });

        // STATUS PESANAN
        const statusLower = row.status?.toLowerCase();
        const statusColor =
            statusLower === "diproses"
                ? "#fd7e14"
                : statusLower === "selesai"
                    ? "#198754"
                    : statusLower?.includes("menunggu")
                        ? "#0d6efd"
                        : "#6c757d";

        doc.font("Helvetica-Bold")
            .fillColor(statusColor)
            .text(formatStatus(row.status), 615, rowY + 10, {
                width: 120,
                align: "center"
            });

        // SUB INFO PEMBAYARAN
        doc.font("Helvetica")
            .fontSize(8);

        if (hasPembayaran) {
            doc.fillColor("#198754").text(
                `${formatStatus(row.pembayaran.jenis)} • ${formatStatus(
                    row.pembayaran.status
                )} • ${formatRupiah(row.pembayaran.jumlah)}`,
                85,
                rowY + 24,
                { width: 350 }
            );
        } else {
            doc.fillColor("#dc3545")
                .text("Belum Bayar", 85, rowY + 24);
        }

        rowY += rowH;
    });

    // ===============================
    // TOTAL FOOTER
    // ===============================
    doc.moveTo(START_X, rowY + 6)
        .lineTo(START_X + PAGE_WIDTH, rowY + 6)
        .stroke();

    doc.font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#212529");



    // ===============================
    // FOOTER
    // ===============================
    doc.moveDown(3);
    doc.font("Helvetica")
        .fontSize(8)
        .fillColor("#6c757d");

    const statusCount = {};
    data.forEach((d) => {
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

    doc.moveDown(0.5);
    doc.text("Halaman 1 dari 1 • Sistem MN Konveksi", {
        width: PAGE_WIDTH,
        align: "right"
    });

    doc.end();
}
