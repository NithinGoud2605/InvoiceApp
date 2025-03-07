// src/components/Invoicecomp/CreateInvoice/lib/variables.js
export const FORM_FILL_VALUES = {
    sender: {
      name: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
      email: '',
      phone: '',
      customInputs: [],
    },
    receiver: {
      name: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
      email: '',
      phone: '',
      customInputs: [],
    },
    details: {
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      currency: '',
      items: [],
      charges: [], // Added charges array
      paymentInformation: {
        bankName: '',
        accountName: '',
        accountNumber: '',
      },
      additionalNotes: '',
      paymentTerms: '',
      pdfTemplate: 1,
    },
  };