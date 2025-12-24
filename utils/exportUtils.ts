import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import { TranscriptSegment, ChatMessage } from "../types";

export type ExportFormat = 'txt' | 'docx' | 'pdf';

export interface ExportContent {
  transcript?: TranscriptSegment[];
  report?: string;
  critique?: string;
  chat?: ChatMessage[];
  metadata: {
    clientAlias: string;
    date: string;
    sessionNumber?: string;
  };
}

// --- TXT Export ---
export const generateTXT = (data: ExportContent): Blob => {
  let content = `PSİKOLOJİ AĞI - SEANS KAYDI\n`;
  content += `Danışan: ${data.metadata.clientAlias}\n`;
  content += `Tarih: ${data.metadata.date}\n`;
  if (data.metadata.sessionNumber) content += `Seans No: ${data.metadata.sessionNumber}\n`;
  content += `----------------------------------------\n\n`;

  if (data.transcript) {
    content += `=== TRANSKRİPT ===\n\n`;
    data.transcript.forEach(seg => {
      // Remove [?] markers for clean export
      const cleanText = seg.text.replace(/\[\?\]/g, '');
      content += `[${seg.timestamp}] ${seg.speaker === 'P' ? 'Psikolog' : seg.speaker === 'D' ? 'Danışan' : '?'}: ${cleanText}\n\n`;
    });
    content += `\n`;
  }

  if (data.report) {
    content += `=== SEANS RAPORU ===\n\n${data.report}\n\n`;
  }

  if (data.critique) {
    content += `=== SÜPERVİZYON ===\n\n${data.critique}\n\n`;
  }

  if (data.chat) {
    content += `=== ASİSTAN NOTLARI ===\n\n`;
    data.chat.forEach(msg => {
      content += `${msg.role === 'user' ? 'Siz' : 'Asistan'}: ${msg.content}\n\n`;
    });
  }

  return new Blob([content], { type: 'text/plain;charset=utf-8' });
};

// --- DOCX Export ---
export const generateDOCX = async (data: ExportContent): Promise<Blob> => {
  const sections = [];
  const children = [];

  // Header
  // Note: Using string literals for heading/alignment to avoid import errors from CDN bundles
  children.push(
    new Paragraph({
      text: "Psikoloji Ağı - Seans Dökümü",
      heading: "Heading1" as any,
      alignment: "center" as any,
      spacing: { after: 300 }
    }),
    new Paragraph({
      text: `Danışan: ${data.metadata.clientAlias}`,
      heading: "Heading3" as any
    }),
    new Paragraph({
      text: `Tarih: ${data.metadata.date}`,
      heading: "Heading3" as any
    })
  );

  if (data.metadata.sessionNumber) {
    children.push(
      new Paragraph({
        text: `${data.metadata.sessionNumber}. Seans`,
        heading: "Heading3" as any,
        spacing: { after: 500 } // Add spacing after header
      })
    );
  }

  // Transcript Section
  if (data.transcript) {
    children.push(
      new Paragraph({
        text: "Transkript",
        heading: "Heading2" as any,
        spacing: { before: 500, after: 300 }
      })
    );

    data.transcript.forEach(seg => {
      const isPsychologist = seg.speaker === 'P';
      const cleanText = seg.text.replace(/\[\?\]/g, '');

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${isPsychologist ? 'Psikolog' : 'Danışan'} (${seg.timestamp}): `,
              bold: true,
              color: isPsychologist ? "4F46E5" : "059669" // Indigo vs Emerald colors
            }),
            new TextRun({
              text: cleanText,
            })
          ],
          spacing: { after: 200 }
        })
      );
    });
  }

  // Report Section
  if (data.report) {
    children.push(
      new Paragraph({
        text: "Seans Raporu",
        heading: "Heading2" as any,
        pageBreakBefore: true,
        spacing: { after: 300 }
      }),
      new Paragraph({
        text: data.report
      })
    );
  }

  // Critique Section
  if (data.critique) {
    children.push(
      new Paragraph({
        text: "Süpervizyon Geri Bildirimi",
        heading: "Heading2" as any,
        pageBreakBefore: true,
        spacing: { after: 300 }
      }),
      new Paragraph({
        text: data.critique
      })
    );
  }

  // Chat Section
  if (data.chat) {
    children.push(
      new Paragraph({
        text: "Asistan Sohbet Geçmişi",
        heading: "Heading2" as any,
        pageBreakBefore: true,
        spacing: { after: 300 }
      })
    );
    data.chat.forEach(msg => {
       children.push(
        new Paragraph({
           children: [
             new TextRun({ text: msg.role === 'user' ? "Siz: " : "Asistan: ", bold: true }),
             new TextRun({ text: msg.content })
           ],
           spacing: { after: 200 }
        })
       )
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  return await Packer.toBlob(doc);
};

// --- PDF Export ---
export const generatePDF = (data: ExportContent): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Helper to add text and advance Y
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: string = "#000000") => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(color);
    
    // Split text to fit width
    const splitText = doc.splitTextToSize(text, contentWidth);
    
    // Check page break
    if (yPos + (splitText.length * 7) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = 20;
    }

    doc.text(splitText, margin, yPos);
    yPos += (splitText.length * 6) + 4;
  };

  // Header
  addText("PSİKOLOJİ AĞI - SEANS DÖKÜMÜ", 16, true, "#333333");
  addText(`Danışan: ${data.metadata.clientAlias}`, 12);
  addText(`Tarih: ${data.metadata.date}`, 12);
  if (data.metadata.sessionNumber) addText(`Seans: ${data.metadata.sessionNumber}`, 12);
  yPos += 10;

  // Transcript
  if (data.transcript) {
    addText("Transkript", 14, true, "#4F46E5");
    yPos += 5;
    data.transcript.forEach(seg => {
        const cleanText = seg.text.replace(/\[\?\]/g, '');
        const speaker = seg.speaker === 'P' ? 'Psikolog' : 'Danışan';
        const prefix = `${speaker} [${seg.timestamp}]: `;
        const fullLine = prefix + cleanText;
        addText(fullLine, 10, false, "#000000");
        yPos -= 2; // tight spacing
    });
    yPos += 10;
  }

  // Report
  if (data.report) {
      if (yPos > 200) { doc.addPage(); yPos = 20; }
      addText("Seans Raporu", 14, true, "#059669");
      yPos += 5;
      // Simple clean of markdown
      const cleanReport = data.report.replace(/#/g, '');
      addText(cleanReport, 10);
      yPos += 10;
  }

  // Critique
  if (data.critique) {
      if (yPos > 200) { doc.addPage(); yPos = 20; }
      addText("Süpervizyon", 14, true, "#D97706");
      yPos += 5;
      const cleanCritique = data.critique.replace(/#/g, '');
      addText(cleanCritique, 10);
  }

  return doc;
};