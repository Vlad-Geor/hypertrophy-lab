import * as repo from '../repositories/brands.repo';

export async function createBrand(data: { name: string; site?: string | null }) {
  return repo.createBrand(data);
}

export async function listBrands() {
  return repo.listBrands();
}
