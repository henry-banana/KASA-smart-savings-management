import { BaseModel } from "./BaseModel.js";

class TransactionModel extends BaseModel {
  constructor() {
    super("transaction", "transactionid");
  }
}

export const Transaction = new TransactionModel();
