export interface IBank {
  ispb: string | number; // A API pode mandar como número
  name: string;
  fullName?: string | null;
  code?: string | number | null;
}