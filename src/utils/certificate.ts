import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface CertificateData {
  studentName: string;
  courseName: string;
  workload: string;
  completionDate: string;
  certificateCode: string;
  validationUrl: string;
}

/**
 * Gera um token / código aleatório para validação do certificado.
 * Exemplo: SML-A8F2-9K4E-2026
 */
export function generateCertificateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const year = new Date().getFullYear();
  return `SML-${part1}-${part2}-${year}`;
}

/**
 * Gera o documento PDF do certificado no padrão horizontal A4 (297x210 mm)
 */
export async function createCertificatePdf(data: CertificateData): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Fundo com bordas elegantes
  doc.setFillColor(252, 252, 253);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Borda externa
  doc.setDrawColor(226, 232, 240); // neutral-200
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Borda interna decorativa sutil
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(0.6);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Cantoneiras ou detalhes superiores
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(13, 13, 30, 3, "F");
  doc.rect(pageWidth - 43, 13, 30, 3, "F");

  // Cabeçalho da Empresa
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SMARTMACH", pageWidth / 2, 32, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("SMARTLEARN · PLATAFORMA DE CERTIFICAÇÃO E TREINAMENTO", pageWidth / 2, 38, { align: "center" });

  // Título do Certificado
  doc.setTextColor(16, 185, 129); // Esmeralda / destaque
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("CERTIFICADO DE CONCLUSÃO", pageWidth / 2, 58, { align: "center" });

  // Linha divisória
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line( pageWidth / 2 - 40, 64, pageWidth / 2 + 40, 64);

  // Texto de introdução
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Certificamos para os devidos fins que o(a) operador(a)", pageWidth / 2, 78, { align: "center" });

  // Nome do Aluno
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(data.studentName.toUpperCase(), pageWidth / 2, 92, { align: "center" });

  // Descrição da conclusão
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    `concluiu com êxito e aproveitamento técnico satisfatório a trilha de capacitação em`,
    pageWidth / 2,
    104,
    { align: "center" }
  );

  // Nome do Curso
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`"${data.courseName}"`, pageWidth / 2, 115, { align: "center" });

  // Carga horária e data
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    `Carga horária estimada: ${data.workload} · Concluído em: ${data.completionDate}`,
    pageWidth / 2,
    124,
    { align: "center" }
  );

  // Gerar QR Code
  const qrDataUrl = await QRCode.toDataURL(data.validationUrl || data.certificateCode, {
    margin: 1,
    width: 256,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

  // Bloco do QR Code e Validação (Lado esquerdo inferior)
  const qrSize = 32;
  const qrX = 30;
  const qrY = 145;
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("VALIDAÇÃO DIGITAL", qrX + qrSize + 5, qrY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Código autenticador:", qrX + qrSize + 5, qrY + 17);

  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129);
  doc.text(data.certificateCode, qrX + qrSize + 5, qrY + 23);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Aponte a câmera para verificar autenticidade", qrX + qrSize + 5, qrY + 29);

  // Bloco de Assinatura (Lado direito inferior)
  const sigX = pageWidth - 90;
  const sigY = 168;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(sigX, sigY, sigX + 65, sigY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("SmartMach Treinamento & Qualidade", sigX + 32.5, sigY + 6, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Coordenação Pedagógica e Técnica", sigX + 32.5, sigY + 11, { align: "center" });

  return doc;
}

