import logoAsset from "@/assets/rsp-logo.png.asset.json";

export type ResultDetail = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};

export type QuizResultForPdf = {
  name: string;
  phone?: string;
  score: number;
  total: number;
  passed: boolean;
  detail: ResultDetail[];
  attempt?: number;
  date?: string;
};

export async function downloadQuizResultPdf(r: QuizResultForPdf) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;

  // Logo (centered at top) — best effort.
  try {
    const res = await fetch(logoAsset.url);
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const logoW = 90;
    const logoH = 90;
    doc.addImage(dataUrl, "PNG", (pageW - logoW) / 2, 36, logoW, logoH);
  } catch {
    // continue without the logo
  }

  let y = 150;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("RSP Law of Vibration — Quiz Result", pageW / 2, y, {
    align: "center",
  });

  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Name: ${r.name}`, margin, y);
  if (r.phone) {
    y += 18;
    doc.text(`Phone: ${r.phone}`, margin, y);
  }
  y += 18;
  doc.text(`Date: ${r.date ?? new Date().toLocaleString()}`, margin, y);
  if (r.attempt) {
    y += 18;
    doc.text(`Attempt: ${r.attempt} of 3`, margin, y);
  }

  y += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(`${r.score} / ${r.total}`, pageW / 2, y, { align: "center" });
  y += 26;
  doc.setFontSize(16);
  doc.setTextColor(r.passed ? 22 : 200, r.passed ? 130 : 30, r.passed ? 90 : 30);
  doc.text(r.passed ? "PASSED" : "NOT PASSED", pageW / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);

  y += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Answer summary", margin, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  doc.setFontSize(10);
  r.detail.forEach((d, i) => {
    if (y > 780) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    const qLines = doc.splitTextToSize(`${i + 1}. ${d.question}`, pageW - margin * 2);
    doc.text(qLines, margin, y);
    y += qLines.length * 13;
    doc.setFont("helvetica", "normal");
    doc.text(`Your answer: ${d.selected}  ${d.isCorrect ? "✓" : "✗"}`, margin + 12, y);
    y += 13;
    if (!d.isCorrect) {
      doc.text(`Correct answer: ${d.correct}`, margin + 12, y);
      y += 13;
    }
    y += 6;
  });

  doc.save(`RSP-Quiz-Result-${r.name.trim().replace(/\s+/g, "-") || "result"}.pdf`);
}
