export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  addressId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyRecruiter {
  id: string;
  userId: string;
  companyId: string;
  department?: string;
  name?: string;
  email?: string;
}
