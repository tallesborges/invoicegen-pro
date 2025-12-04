import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Invoice } from "../types";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return amount.toFixed(2);
};

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // -- Header Section --
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`INVOICE: ${invoice.invoiceNumber}`, 20, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  // Format date nicely: e.g. Dec 2025
  const dateObj = new Date(invoice.date);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  doc.text(dateStr, 20, 26);

  // -- Sender Details --
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.senderName.toUpperCase(), 20, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const senderAddressLines = doc.splitTextToSize(invoice.senderAddress, 100);
  doc.text(senderAddressLines, 20, 46);
  // Calculate Y offset based on address length
  let currentY = 46 + senderAddressLines.length * 5;
  doc.text(invoice.senderPhone, 20, currentY);

  // -- Bill To Section --
  currentY += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 20, currentY);

  currentY += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  if (invoice.recipient) {
    doc.text(invoice.recipient.name, 20, currentY);
    currentY += 5;
    const recipientAddressLines = doc.splitTextToSize(
      invoice.recipient.address,
      80,
    );
    doc.text(recipientAddressLines, 20, currentY);
  } else {
    doc.text("[Recipient Not Selected]", 20, currentY);
  }

  // -- Table --
  // We want the table to start around Y=100 or below the address
  const startY = Math.max(currentY + 20, 90);

  const tableBody = invoice.items.map((item) => [
    item.description,
    item.rate.toFixed(2),
    item.quantity.toString(),
    (item.rate * item.quantity).toFixed(2),
  ]);

  // Calculate Subtotal
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.rate * item.quantity,
    0,
  );
  const salesTax = subtotal * (invoice.salesTaxRate / 100);
  const total = subtotal + salesTax;

  autoTable(doc, {
    startY: startY,
    margin: {
      horizontal: 17,
    },
    head: [["DESCRIPTION", "RATE\n(USD)", "UNIT", "TOTAL"]],
    body: tableBody,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: [0, 0, 0],
      font: "helvetica",
    },
    headStyles: {
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto", halign: "left" }, // Description
      1: { cellWidth: 30, halign: "right" }, // Rate
      2: { cellWidth: 20, halign: "right" }, // Unit
      3: { cellWidth: 30, halign: "right" }, // Total
    },
    didParseCell: (data) => {
      // Set header alignment to match column alignment
      if (data.section === "head") {
        if (data.column.index === 0) {
          data.cell.styles.halign = "left";
        } else {
          data.cell.styles.halign = "right";
        }
      }
    },
  });

  // -- Totals Section --
  // Get the Y position after the table
  let finalY = (doc as any).lastAutoTable.finalY + 10;

  // Helper for right aligned text
  const rightMargin = pageWidth - 20;
  const labelX = rightMargin - 60;

  doc.setFont("helvetica", "normal");
  doc.text("SUBTOTAL", labelX, finalY);
  doc.text(formatCurrency(subtotal), rightMargin, finalY, { align: "right" });

  finalY += 6;
  doc.text("SALES TAX", labelX, finalY);
  doc.text(formatCurrency(salesTax), rightMargin, finalY, { align: "right" });

  finalY += 2;
  // Draw line
  doc.setLineWidth(0.5);
  doc.line(labelX, finalY, rightMargin, finalY);

  finalY += 6;
  doc.setFont("helvetica", "bold");
  // Add Due Date
  const dueDateStr = invoice.dueDate
    ? `TOTAL DUE BY ${invoice.dueDate}`
    : "DUE ON RECEIPT";
  doc.text(dueDateStr, labelX, finalY);
  doc.text(formatCurrency(total), rightMargin, finalY, { align: "right" });

  // Save
  doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
};
