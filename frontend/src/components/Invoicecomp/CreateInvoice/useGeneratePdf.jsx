import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useCallback } from 'react';
import { useInvoiceContext } from './contexts/InvoiceContext';

// A fallback transparent PNG (1x1 pixel)
const fallbackBase64Logo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const useGeneratePdf = () => {
  const { setInvoicePdf } = useInvoiceContext();

  return useCallback(async (data) => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size in points
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Decide which logo to use
      const logoDataUrl =
        typeof data.sender.logo === 'string' && data.sender.logo.startsWith('data:image/')
          ? data.sender.logo
          : fallbackBase64Logo;
      
      // Try to embed the PNG logo
      let logoImage;
      try {
        logoImage = await pdfDoc.embedPng(logoDataUrl);
      } catch (err) {
        console.error("Error embedding logo image:", err);
      }
      
      // If logo was successfully embedded, draw it on the page
      if (logoImage) {
        const logoDims = logoImage.scale(0.5);
        page.drawImage(logoImage, {
          x: width - logoDims.width - 50,
          y: height - logoDims.height - 50,
          width: logoDims.width,
          height: logoDims.height,
        });
      }
      
      // Draw Invoice header text
      page.drawText(`Invoice #${data.details.invoiceNumber || 'N/A'}`, {
        x: 50,
        y: height - 50,
        size: 18,
        font,
        color: rgb(0, 0, 0),
      });
      
      // Draw Sender and Receiver info
      page.drawText(`From: ${data.sender.name || 'N/A'}`, {
        x: 50,
        y: height - 80,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`To: ${data.receiver.name || 'N/A'}`, {
        x: 50,
        y: height - 100,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      
      // Example: Draw total amount (compute a simple total)
      const total = data.details.items?.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unitPrice) || 0;
        return sum + qty * price;
      }, 0) || 0;
      
      page.drawText(`Total: ${total.toFixed(2)}`, {
        x: 50,
        y: height - 140,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      // Save the PDF as a byte array
      const pdfBytes = await pdfDoc.save();
      // Create a Blob from the byte array and generate a URL
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setInvoicePdf({ size: blob.size, url });
    } catch (error) {
      console.error("Error generating PDF with pdf-lib:", error);
    }
  }, [setInvoicePdf]);
};
