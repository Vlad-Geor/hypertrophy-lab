import { Supplement } from '@ikigaidev/hl/model';
import {
  AddUserSupplementDto,
  SupplementRepository,
} from '../repositories/supplements.repository';

export class SupplementService {
  private supplementRepo: SupplementRepository;

  constructor() {
    this.supplementRepo = new SupplementRepository();
  }

  public async getAllSupplements(): Promise<Supplement[]> {
    // Additional business rules could go here
    return this.supplementRepo.findAll();
  }

  public async getSupplementById(id: number): Promise<Supplement | undefined> {
    return this.supplementRepo.findById(id);
  }

  // public async getUserSupplements(userId: number): Promise<Supplement[] | undefined> {
  //   // return this.supplementRepo
  // }

  public async addUserSupplement(payload: AddUserSupplementDto) {
    return this.supplementRepo.addUserSupplement(payload);
  }

  public async createSupplement(suppData: Partial<Supplement>): Promise<Supplement> {
    // Validate input, transform data, etc.
    if (!suppData.name) {
      throw new Error('Supplement name is required');
    }

    return this.supplementRepo.create(suppData);
  }

  public async updateSupplement(
    id: number,
    suppData: Partial<Supplement>,
  ): Promise<Supplement | undefined> {
    // Example rule: disallow updating name to empty
    if (suppData.name === '') {
      throw new Error('Name cannot be empty');
    }

    return this.supplementRepo.update(id, suppData);
  }

  public async deleteSupplement(id: number): Promise<boolean> {
    return this.supplementRepo.delete(id);
  }
}
