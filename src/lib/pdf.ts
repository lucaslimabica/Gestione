import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { BudgetContent } from "@/types";

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });

interface GenerateBudgetPdfParams {
    documentName: string;
    createdAt: string;
    content: BudgetContent;
}

export function generateBudgetPdf({ documentName, createdAt, content }: GenerateBudgetPdfParams) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("SOS Home", margin, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Orçamento', pageWidth - margin, 20, { align: 'right' });
    doc.text(`Nº ${content.id_comercial || '—'}`, pageWidth - margin, 26, { align: 'right' });
    doc.text(new Date(createdAt).toLocaleDateString('pt-BR'), pageWidth - margin, 32, { align: 'right' });

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

    // Display the itens provided by the card
    autoTable(doc, {
        startY: cursorY + 6,
        margin: { left: margin, right: margin },
        head: [['Descrição', 'Valor']],
        body: content.items.map((item) => [item.description, currency(item.value)]),
        foot: [['Total', currency(content.total_value)]],
        headStyles: { fillColor: [30, 41, 59] },
        footStyles: { fillColor: [30, 41, 59], fontStyle: 'bold' },
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

    doc.save(`${documentName || 'orcamento'}.pdf`);
}
