// src/components/Invoicecomp/CreateInvoice/contexts/InvoiceContext.jsx
import React, { createContext, useContext, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoicePdf, setInvoicePdf] = useState({ size: 0, url: '' });
  const [savedInvoices, setSavedInvoices] = useState([]);

  const calculateTotal = (data) => {
    const itemsTotal = data.details.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
    const chargesTotal = data.details.charges?.reduce((sum, charge) => {
      const amount = Number(charge.amount) || 0;
      return charge.type === 'discount' ? sum - amount : sum + amount;
    }, 0) || 0;
    return itemsTotal + chargesTotal;
  };

  const generatePdfDefinition = (data) => {
    const total = calculateTotal(data);
    return {
      content: [
        { text: `Invoice #${data.details.invoiceNumber || 'N/A'}`, style: 'header' },
        { text: `From: ${data.sender.name || 'N/A'}`, margin: [0, 20, 0, 10] },
        { text: `To: ${data.receiver.name || 'N/A'}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Item', 'Quantity', 'Rate', 'Total'],
              ...(data.details.items?.map((item) => [
                item.name || 'N/A',
                item.quantity || 0,
                item.unitPrice || 0,
                (item.quantity * item.unitPrice) || 0,
              ]) || []),
            ],
          },
        },
        ...(data.details.charges?.length > 0
          ? [
              { text: 'Additional Charges:', style: 'subheader', margin: [0, 20, 0, 10] },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 'auto', 'auto'],
                  body: [
                    ['Description', 'Type', 'Amount'],
                    ...(data.details.charges.map((charge) => [
                      charge.description || 'N/A',
                      charge.type || 'N/A',
                      charge.amount || 0,
                    ])),
                  ],
                },
              },
            ]
          : []),
        { text: `Total: ${total} ${data.details.currency || 'USD'}`, style: 'total', margin: [0, 20, 0, 0] },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true },
        total: { fontSize: 14, bold: true },
      },
    };
  };

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