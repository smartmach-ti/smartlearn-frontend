"use client";

import { useEffect, useState } from "react";
import { Check, Download, ExternalLink, QrCode as QrIcon, ShieldCheck, X, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { CertificateData, createCertificatePdf } from "@/utils/certificate";

interface CertificateModalProps {
  data: CertificateData;
  onClose: () => void;
}

export function CertificateModal({ data, onClose }: CertificateModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(data.validationUrl || data.certificateCode, {
      margin: 1,
      width: 180,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [data]);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const doc = await createCertificatePdf(data);
      const sanitizedName = data.courseName.toLowerCase().replace(/[^a-z0-9]/g, "_");
      doc.save(`certificado_smartlearn_${sanitizedName}_${data.certificateCode}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Não foi possível gerar o certificado em PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.certificateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Certificado de Conclusão</h2>
              <p className="text-xs text-neutral-500">Visualização em miniatura e download em PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo do Modal com Miniatura do Certificado */}
        <div className="overflow-y-auto p-6 flex flex-col items-center">
          {/* Card Miniatura do Certificado */}
          <div className="w-full max-w-2xl aspect-[1.414/1] rounded-xl border-4 border-double border-neutral-300 bg-gradient-to-br from-slate-50 via-white to-neutral-50 p-6 sm:p-8 shadow-md relative flex flex-col justify-between">
            
            {/* Faixa decorativa superior */}
            <div className="flex justify-between items-center border-b pb-3 border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold tracking-widest text-neutral-800 uppercase">SMARTMACH</span>
              </div>
              <span className="text-[10px] tracking-wider text-neutral-400 font-mono">SMARTLEARN ACADEMY</span>
            </div>

            {/* Conteúdo Central */}
            <div className="text-center my-auto py-2">
              <p className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase">
                Certificado Oficial de Treinamento
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                {data.studentName}
              </h3>
              <p className="mt-2 text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Concluiu satisfatoriamente a capacitação técnica operacional no sistema
              </p>
              <h4 className="mt-1 text-base sm:text-lg font-semibold text-neutral-900">
                {data.courseName}
              </h4>
              <p className="mt-2 text-[11px] text-neutral-500">
                Carga horária estimada: <strong className="text-neutral-700">{data.workload}</strong> · Concluído em: <strong className="text-neutral-700">{data.completionDate}</strong>
              </p>
            </div>

            {/* Rodapé com QR Code e Validação */}
            <div className="flex items-end justify-between border-t pt-3 border-neutral-200 mt-2">
              <div className="flex items-center gap-3">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="QR Code do Certificado"
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded border border-neutral-200 bg-white p-1 shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 grid place-items-center rounded border border-neutral-200 bg-neutral-100">
                    <QrIcon size={24} className="text-neutral-400 animate-pulse" />
                  </div>
                )}
                <div>
                  <span className="block text-[10px] font-medium uppercase text-neutral-400">Autenticação</span>
                  <button
                    onClick={handleCopyCode}
                    title="Clique para copiar o código"
                    className="flex items-center gap-1 font-mono text-xs font-bold text-neutral-800 hover:text-emerald-600 transition"
                  >
                    <span>{data.certificateCode}</span>
                    {copied ? <Check size={12} className="text-emerald-600" /> : null}
                  </button>
                  <span className="block text-[9px] text-neutral-400">QR Code com token de verificação</span>
                </div>
              </div>

              <div className="text-right">
                <div className="h-8 border-b border-neutral-400 w-32 sm:w-40 ml-auto mb-1 flex items-end justify-center">
                  <span className="text-[9px] italic text-neutral-500 font-serif">SmartMach Ops</span>
                </div>
                <p className="text-[10px] font-semibold text-neutral-800">Coordenação Técnica</p>
                <p className="text-[9px] text-neutral-400">SmartMach LMS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal com Ações */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <QrIcon size={16} className="text-neutral-400" />
            <span>Código de validação: <strong className="font-mono text-neutral-700">{data.certificateCode}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              Fechar
            </button>
            <button
              id="download-certificate-pdf"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Gerando PDF...
                </>
              ) : (
                <>
                  <Download size={15} /> Baixar Certificado em PDF
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
