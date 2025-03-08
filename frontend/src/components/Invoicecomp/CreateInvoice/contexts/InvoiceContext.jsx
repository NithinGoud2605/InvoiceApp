import React, { createContext, useContext, useState, useCallback } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import html2pdf from 'html2pdf.js';

const InvoiceContext = createContext();

// A valid transparent 1×1 PNG fallback data URL
const transparentFallbackLogo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const InvoiceProvider = ({ children }) => {
  const [invoicePdf, setInvoicePdf] = useState({ size: 0, url: '' });
  const [savedInvoices, setSavedInvoices] = useState([]);

  // Utility to format currency
  const formatCurrency = useCallback((amount, currency) => {
    const validCurrency = currency && currency.trim() ? currency : 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency
    }).format(amount);
  }, []);

  // Calculate total from items, charges, and optional tax
  const calculateTotal = useCallback((data) => {
    if (!data?.details) return 0;
    const { items = [], charges = [], tax = 0 } = data.details;
    const itemsTotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);
    const chargesTotal = charges.reduce((sum, charge) => {
      const amount = Number(charge.amount) || 0;
      return charge.type === 'discount' ? sum - amount : sum + amount;
    }, 0);
    const totalBeforeTax = itemsTotal + chargesTotal;
    const taxAmount = totalBeforeTax * (Number(tax) / 100);
    return totalBeforeTax + taxAmount;
  }, []);

  // --- Approach A: pdf-lib manual generation
  const generatePdfDocument = useCallback(
    async (data) => {
      // Create a new PDF doc, add an A4 page
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Decide which logo to use
      const logoDataUrl =
        typeof data.sender.logo === 'string' && data.sender.logo.startsWith('data:image/')
          ? data.sender.logo
          : transparentFallbackLogo;

      // Embed the PNG logo if valid
      try {
        const logoImage = await pdfDoc.embedPng(logoDataUrl);
        const logoDims = logoImage.scale(0.5);
        page.drawImage(logoImage, {
          x: width - logoDims.width - 50,
          y: height - logoDims.height - 50,
          width: logoDims.width,
          height: logoDims.height,
        });
      } catch (err) {
        console.error("Error embedding logo image:", err);
      }

      // Example text
      page.drawText(`Invoice #${data.details.invoiceNumber || 'N/A'}`, {
        x: 50,
        y: height - 50,
        size: 18,
        font,
        color: rgb(0, 0, 0),
      });

      // etc. - add your layout
      const total = calculateTotal(data);
      page.drawText(`Total: ${formatCurrency(total, data.details.currency)}`, {
        x: 50,
        y: height - 80,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      return pdfDoc;
    },
    [calculateTotal, formatCurrency]
  );

  // onFormSubmit -> PDF creation using pdf-lib
  const onFormSubmit = useCallback(async (data) => {
    try {
      const pdfDoc = await generatePdfDocument(data);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setInvoicePdf({ size: blob.size, url });
      console.log('pdf-lib PDF generated, blob size:', blob.size);
    } catch (error) {
      console.error("Error generating PDF with pdf-lib:", error);
    }
  }, [generatePdfDocument]);

  // --- Approach B: html2pdf.js capturing your HTML
  // This function requires an HTML element reference that contains the invoice layout
  const onFormSubmitHtml2pdf = useCallback(async (element) => {
    try {
      // Basic config
      const opt = {
        margin: 0.5,
        filename: `invoice-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Convert the element to a PDF blob
      const pdfBlob = await html2pdf().from(element).set(opt).output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setInvoicePdf({ size: pdfBlob.size, url });
      console.log('html2pdf PDF generated, blob size:', pdfBlob.size);
    } catch (error) {
      console.error("Error generating PDF with html2pdf.js:", error);
    }
  }, []);

  // PDF actions
  const previewPdfInTab = useCallback(() => {
    if (invoicePdf.url) window.open(invoicePdf.url, '_blank');
  }, [invoicePdf.url]);

  const downloadPdf = useCallback(() => {
    if (invoicePdf.url) {
      const link = document.createElement('a');
      link.href = invoicePdf.url;
      link.download = `invoice-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [invoicePdf.url]);

  const printPdf = useCallback(() => {
    if (invoicePdf.url) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = invoicePdf.url;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  }, [invoicePdf.url]);

  const saveInvoice = useCallback(() => {
    setSavedInvoices((prev) => [
      ...prev,
      { ...invoicePdf, details: { updatedAt: new Date().toISOString() } }
    ]);
  }, [invoicePdf]);

  const sendPdfToMail = useCallback(async (email) => {
    try {
      console.log(`Sending PDF to ${email}...`);
      // Actually do something here, e.g. POST to your server
    } catch (error) {
      console.error('Error sending PDF', error);
    }
  }, []);

  const removeFinalPdf = useCallback(() => {
    setInvoicePdf({ size: 0, url: '' });
  }, []);

  // Example of importing an invoice from JSON
  const importInvoice = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onFormSubmit(data);
        } catch (err) {
          console.error('Invalid JSON file format.', err);
        }
      };
      reader.readAsText(file);
    },
    [onFormSubmit]
  );

  const exportInvoiceAs = useCallback((exportType) => {
    console.log(`Exporting as ${exportType}`);
    // Could integrate CSV/JSON export logic
  }, []);

  const deleteInvoice = useCallback((idx) => {
    setSavedInvoices((prev) => prev.filter((_, index) => index !== idx));
  }, []);

  const newInvoice = useCallback(() => {
    setInvoicePdf({ size: 0, url: '' });
    setSavedInvoices([]);
  }, []);

  // Example: uploading a logo to context
  const [companyLogo, setCompanyLogo] = useState(null);
  const handleCompanyLogoUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCompanyLogo(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        invoicePdf,
        setInvoicePdf,  // Ensure we expose setInvoicePdf if we want to manipulate it externally
        savedInvoices,
        onFormSubmit,        // pdf-lib approach
        onFormSubmitHtml2pdf,// html2pdf.js approach
        previewPdfInTab,
        downloadPdf,
        printPdf,
        saveInvoice,
        sendPdfToMail,
        removeFinalPdf,
        importInvoice,
        exportInvoiceAs,
        deleteInvoice,
        newInvoice,
        companyLogo,
        handleCompanyLogoUpload
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => useContext(InvoiceContext);
