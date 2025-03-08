import React, { createContext, useContext, useState, useCallback } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// In your case, pdfFonts is already the vfs data:
pdfMake.vfs = pdfFonts;

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoicePdf, setInvoicePdf] = useState({ size: 0, url: '' });
  const [savedInvoices, setSavedInvoices] = useState([]);

  // Store user's uploaded company logo (as a base64 string)
  const [companyLogo, setCompanyLogo] = useState(null);

  // Upload a custom company logo as base64
  const handleCompanyLogoUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCompanyLogo(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // -- Utility to format currency, e.g. using Intl
  const formatCurrency = useCallback((amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }, []);

  // -- Calculate total from items, charges, and optional tax
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

  // -- Build the PDF definition object for pdfMake
  const generatePdfDefinition = useCallback(
    (data) => {
      // Minimal validation
      if (!data?.details || !data?.sender || !data?.receiver) {
        return {
          content: [
            {
              text: 'Invalid data provided. Cannot generate PDF.',
              style: 'header'
            }
          ]
        };
      }

      const total = calculateTotal(data);
      const { items = [], charges = [], currency = 'USD', tax } = data.details;

      const docDefinition = {
        content: [
          // If user has uploaded a company logo, show it at the top
          companyLogo
            ? {
                image: companyLogo,
                width: 120,
                margin: [0, 0, 0, 20]
              }
            : null,

          { text: `Invoice #${data.details.invoiceNumber || 'N/A'}`, style: 'header' },
          {
            text: `From: ${data.sender.name || 'N/A'}`,
            margin: [0, 20, 0, 10]
          },
          {
            text: `To: ${data.receiver.name || 'N/A'}`,
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                ['Item', 'Quantity', 'Rate', 'Total'],
                ...items.map((item) => {
                  const qty = Number(item.quantity) || 0;
                  const rate = Number(item.unitPrice) || 0;
                  return [
                    item.name || 'N/A',
                    qty,
                    formatCurrency(rate, currency),
                    formatCurrency(qty * rate, currency)
                  ];
                })
              ]
            }
          },
          ...(charges.length
            ? [
                {
                  text: 'Additional Charges:',
                  style: 'subheader',
                  margin: [0, 20, 0, 10]
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto'],
                    body: [
                      ['Description', 'Type', 'Amount'],
                      ...charges.map((charge) => [
                        charge.description || 'N/A',
                        charge.type || 'N/A',
                        formatCurrency(charge.amount, currency)
                      ])
                    ]
                  }
                }
              ]
            : []),
          tax
            ? {
                text: `Tax (${tax}%) is applied on the items + charges total above.`,
                margin: [0, 10, 0, 0]
              }
            : {},
          {
            text: `Total: ${formatCurrency(total, currency)}`,
            style: 'total',
            margin: [0, 20, 0, 0]
          },
          // Example of optionally including a signature image if present in data:
          data.signatureData
            ? {
                image: data.signatureData,
                width: 150,
                margin: [0, 20, 0, 0]
              }
            : null
        ].filter(Boolean),
        styles: {
          header: { fontSize: 18, bold: true },
          subheader: { fontSize: 14, bold: true },
          total: { fontSize: 14, bold: true }
        }
      };

      return docDefinition;
    },
    [calculateTotal, formatCurrency, companyLogo]
  );

  // -- Method to handle form submission -> PDF creation
  const onFormSubmit = useCallback(
    (data) => {
      const docDefinition = generatePdfDefinition(data);
      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setInvoicePdf({ size: blob.size, url });
      });
    },
    [generatePdfDefinition]
  );

  // -- Common PDF actions
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
    // For demonstration, we only keep a single "details" object
    setSavedInvoices((prev) => [
      ...prev,
      { ...invoicePdf, details: { updatedAt: new Date().toISOString() } }
    ]);
  }, [invoicePdf]);

  const sendPdfToMail = useCallback(async (email) => {
    // Placeholder for an API call or a utility function
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

  return (
    <InvoiceContext.Provider
      value={{
        invoicePdf,
        savedInvoices,
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

        // New for logo uploading
        companyLogo,
        handleCompanyLogoUpload
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => useContext(InvoiceContext);
