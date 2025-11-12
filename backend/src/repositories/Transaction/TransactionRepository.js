import { Transaction } from "../../models/Transaction.js";

export class TransactionRepository {
  async findById(transactionId) {
    return await Transaction.getById(transactionId);
  }

  async findAll() {
    return await Transaction.getAll();
  }

  async create(transactionData) {
    return await Transaction.create(transactionData);
  }

  async update(transactionId, transactionData) {
    return await Transaction.update(transactionId, transactionData);
  }

  async delete(transactionId) {
    return await Transaction.delete(transactionId);
  }
}

export const transactionRepository = new TransactionRepository();
