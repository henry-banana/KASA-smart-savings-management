// models/UserAccount.js
import { BaseModel } from "./BaseModel.js";

export class UserAccount extends BaseModel {
  constructor() {
    super("useraccount", "userid"); 
  }
}

export const UserAccountModel = new UserAccount();
