import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { BudgetContent } from "@/types";
import logoImg from "@/assets/SOSHomeTransparente.png"; // Importação da imagem

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });

interface GenerateBudgetPdfParams {
    documentName: string;
    createdAt: string;
    content: BudgetContent;
}

export function generateBudgetPdf({ documentName, createdAt, content }: GenerateBudgetPdfParams) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // 1. IMAGEM NO CABEÇALHO (Substitui "SOS Home")
    // addImage(imageData, format, x, y, width, height)
    doc.addImage(logoImg, 'PNG', margin, 12, 35, 20);

    // Informações no lado direito do cabeçalho
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Orçamento', pageWidth - margin, 18, { align: 'right' });
    doc.text(`Nº ${content.id_comercial || '—'}`, pageWidth - margin, 24, { align: 'right' });
    doc.text(new Date(createdAt).toLocaleDateString('pt-BR'), pageWidth - margin, 30, { align: 'right' });

    // Linha divisória do cabeçalho
    doc.setDrawColor(200);
    doc.line(margin, 36, pageWidth - margin, 36);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(documentName, margin, 46);

    let cursorY = 46;

    if (content.description) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(content.description, pageWidth - margin * 2);
        doc.text(lines, margin, 54);
        cursorY = 54 + lines.length * 5;
    }

    // 2. TABELA DE ITENS COM TOPO E CORPO FINAL EM PRETO
    autoTable(doc, {
        startY: cursorY + 6,
        margin: { left: margin, right: margin },
        head: [['Descrição', 'Valor']],
        body: content.items.map((item) => [item.description, currency(item.value)]),
        foot: [['Total', currency(content.total_value)]],
        headStyles: { 
            fillColor: [0, 0, 0], // Cor de fundo do topo: Preto
            textColor: [255, 255, 255] 
        },
        footStyles: { 
            fillColor: [0, 0, 0], // Cor de fundo do footer/total: Preto
            textColor: [255, 255, 255], 
            fontStyle: 'bold' 
        },
        columnStyles: { 1: { halign: 'right', cellWidth: 35 } },
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    if (content.payment_terms) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Condições de pagamento', margin, finalY + 12);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(content.payment_terms, pageWidth - margin * 2);
        doc.text(lines, margin, finalY + 18);
    }

    // 3. RODAPÉ CENTRALIZADO
    const footerY = pageHeight - 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
        "Lucas Reinheimer de Oliveira PT50 0018 0003 5354 0076 0206 8", 
        pageWidth / 2, 
        footerY - 5, 
        { align: 'center' }
    );

    doc.setFont('helvetica', 'bold');
    doc.text(
        "OBRIGADO POR NOS TER ESCOLHIDO!", 
        pageWidth / 2, 
        footerY, 
        { align: 'center' }
    );

    doc.save(`${documentName || 'orcamento'}.pdf`);
}