import { BaseModel } from "./BaseModel.js";

class CustomerModel extends BaseModel {
  constructor() {
    super("customer", "customerid");
  }
}

export const Customer = new CustomerModel();
