export const FORM_FILL_VALUES = {
    sender: {
      name: 'John Doe',
      address: '123 Main Street',
      zipCode: '12345',
      city: 'Metropolis',
      country: 'USA',
      email: 'john.doe@example.com',
      phone: '555-1234',
    },
    receiver: {
      name: 'Jane Smith',
      address: '456 Elm Street',
      zipCode: '67890',
      city: 'Gotham',
      country: 'USA',
      email: 'jane.smith@example.com',
      phone: '555-5678',
    },
    details: {
      invoiceNumber: 'INV-001',
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      currency: 'USD',
      items: [],
      subTotal: 0,
      totalAmount: 0,
      // Add any other default fields as needed
    },
  };
  
  export const DATE_OPTIONS = { year: 'numeric', month: '2-digit', day: '2-digit' };
  
  export const BASE_URL = 'https://example.com';
  
  export const AUTHOR_GITHUB = 'https://github.com/yourusername';
  