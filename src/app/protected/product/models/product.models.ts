/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  supplierId?: string | null;
  headquartersId?: string | null;
  supplier?: any;
  headquarters?: any;
  inventory?: any[];
}
