import { Branch } from "../../models/Branch.js";

export class BranchRepository {
  async findById(branchId) {
    return await Branch.getById(branchId);
  }

  async findAll() {
    return await Branch.getAll();
  }

  async create(branchData) {
    return await Branch.create(branchData);
  }

  async update(branchId, branchData) {
    return await Branch.update(branchId, branchData);
  }

  async delete(branchId) {
    return await Branch.delete(branchId);
  }
}

export const branchRepository = new BranchRepository();
