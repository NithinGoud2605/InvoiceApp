import React, { createContext, useContext, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Import the font definitions

// Assign the fonts directly to pdfMake.vfs
pdfMake.vfs = pdfFonts; // Changed from pdfFonts.pdfMake.vfs to pdfFonts

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoicePdf, setInvoicePdf] = useState({ size: 0, url: '' });
  const [savedInvoices, setSavedInvoices] = useState([]);

  const generatePdfDefinition = (data) => ({
    content: [
      { text: `Invoice #${data.details.invoiceNumber}`, style: 'header' },
      { text: `From: ${data.sender.name}`, margin: [0, 20, 0, 10] },
      { text: `To: ${data.receiver.name}`, margin: [0, 0, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            ['Item', 'Quantity', 'Rate', 'Total'],
            ...(data.details.items.map((item) => [item.name, item.quantity, item.unitPrice, item.total])),
          ],
        },
      },
      { text: `Total: ${data.details.totalAmount} ${data.details.currency}`, style: 'total', margin: [0, 20, 0, 0] },
    ],
    styles: {
      header: { fontSize: 18, bold: true },
      total: { fontSize: 14, bold: true },
    },
  });

  const onFormSubmit = (data) => {
    const docDefinition = generatePdfDefinition(data);
    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setInvoicePdf({ size: blob.size, url });
    });
  };

  const previewPdfInTab = () => {
    if (invoicePdf.url) window.open(invoicePdf.url, '_blank');
  };

  const downloadPdf = () => {
    if (invoicePdf.url) {
      const link = document.createElement('a');
      link.href = invoicePdf.url;
      link.download = `invoice-${Date.now()}.pdf`;
      link.click();
    }
  };

  const printPdf = () => {
    if (invoicePdf.url) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = invoicePdf.url;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }
  };

  const saveInvoice = () => {
    setSavedInvoices((prev) => [...prev, { ...invoicePdf, details: { updatedAt: new Date().toISOString() } }]);
  };

  const sendPdfToMail = async (email) => {
    console.log(`Sending PDF to ${email}`);
    // Placeholder for API call
  };

  const removeFinalPdf = () => {
    setInvoicePdf({ size: 0, url: '' });
  };

  const importInvoice = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      onFormSubmit(data);
    };
    reader.readAsText(file);
  };

  const exportInvoiceAs = (exportType) => {
    console.log(`Exporting as ${exportType}`);
    // Placeholder for export logic
  };

  const deleteInvoice = (idx) => {
    setSavedInvoices((prev) => prev.filter((_, index) => index !== idx));
  };

  const newInvoice = () => {
    setInvoicePdf({ size: 0, url: '' });
    setSavedInvoices([]);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoicePdf,
        setInvoicePdf,
        savedInvoices,
        setSavedInvoices,
        onFormSubmit,
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
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => useContext(InvoiceContext);