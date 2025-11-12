// models/UserAccount.js
import { BaseModel } from "./BaseModel.js";

export class SavingBook extends BaseModel {
  constructor() {
    super("savingbook", "bookid"); 
  }
}

export const SavingBookModel = new SavingBook();
