export interface Customer {
  customerId: number;
  customerName: string;
  customerCategoryName: string;
  primaryContact: string;
  phoneNumber: string;
  faxNumber: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface CustomerCategory {
  customerCategoryId: number;
  customerCategoryName: string;
  customerCount: number;
}
