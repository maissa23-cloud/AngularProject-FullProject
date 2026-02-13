export interface Product {
  stockItemId: number;
  stockItemName: string;
  supplierName: string;
  colorName: string;
  unitPackage: string;
  outerPackage: string;
  brand: string;
  size: string;
  unitPrice: number;
  recommendedRetailPrice: number;
  taxRate: number;
  quantityOnHand: number;
  totalSales: number;
  categoryName: string;
}

export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  productCount: number;
  totalSales: number;
}
