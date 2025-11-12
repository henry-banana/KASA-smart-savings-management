import { Customer } from "../../models/Customer.js";

export class CustomerRepository {
  async findById(customerId) {
    return await Customer.getById(customerId);
  }

  async findAll() {
    return await Customer.getAll();
  }

  async create(customerData) {
    return await Customer.create(customerData);
  }

  async update(customerId, customerData) {
    return await Customer.update(customerId, customerData);
  }

  async delete(customerId) {
    return await Customer.delete(customerId);
  }
}

export const customerRepository = new CustomerRepository();
