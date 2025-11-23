import { Customer } from "../../models/Customer.js";

export class CustomerRepository {
  async findById(customerId) {
    return await Customer.getById(customerId);
  }

  async findByCitizenID(citizenID){
    return await Customer.getByCitizenID(citizenID);
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

  // Tìm khách hàng theo tên (keyword)
  async findByName(keyword) {
    if (!keyword) return [];

    const customers = await Customer.getAll(); // trả về mảng trực tiếp

    const normalizedKeyword = keyword.trim().toLowerCase();
    return customers.filter(cust =>
      cust.fullname?.toLowerCase().includes(normalizedKeyword)
    );
  }



}

export const customerRepository = new CustomerRepository();
