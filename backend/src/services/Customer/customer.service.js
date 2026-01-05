import { customerRepository } from "../../repositories/Customer/CustomerRepository.js";

class CustomerService {
  // Thêm khách hàng mới
  async addCustomer({ fullName, citizenId, street, district, province }) {
    if (!fullName || !citizenId || !street || !district || !province)
      throw new Error("Missing required information.");

    // Tạo bản ghi khách hàng mới
    const newCustomer = await customerRepository.create({
      fullname: fullName,
      citizenid: citizenId,
      street,
      district,
      province, 
    });

    return {
      message: "Customer added successfully.",
      customer: newCustomer,
    };
  }

  // Cập nhật thông tin khách hàng
  async updateCustomer(id, updates) {
    const existingCustomer = await customerRepository.findById(id);
    if (!existingCustomer) throw new Error("Customer not found");

    const updatedCustomer = await customerRepository.update(id, {
      fullname: updates.fullName,
      citizenid: updates.citizenId,
      street: updates.street,
      district: updates.district,
      province: updates.province,
    });

    return {
      message: "Customer updated successfully.",
      customer: updatedCustomer,
    };
  }

  // Lấy danh sách tất cả khách hàng
  async getAllCustomers() {
    const customers = await customerRepository.findAll();
    return customers;
  }

  // Lấy thông tin khách hàng theo ID
  async getCustomerById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) throw new Error("Customer not found");
    return customer;
  }

  // Xóa khách hàng
  async deleteCustomer(id) {
    const existingCustomer = await customerRepository.findById(id);
    if (!existingCustomer) throw new Error("Customer not found");

    await customerRepository.delete(id);

    return { message: "Customer deleted successfully." };
  }

  // Tìm kiếm khách hàng theo keyword (ID hoặc tên)
  async searchCustomers(keyword) {
    if (!keyword) return [];

    const isId = /^\d+$/.test(keyword); // nếu toàn số → tìm theo ID

    let result;
    if (isId) {
      const customer = await customerRepository.findById(keyword);
      result = customer ? [customer] : [];
    } else {
      // tìm theo tên (có thể dùng LIKE hoặc tương đương trong repository)
      result = await customerRepository.findByName(keyword);
    }

    return result;
  }
  async findCustomerByCitizenId(citizenId) {
    //Kiểm tra citizenId hợp lệ, 12 số, nếu không hợp lệ thì throw lỗi
    if (!/^\d{12}$/.test(citizenId)) {
      const err = new Error("Invalid citizen ID's length. It should be 12 digits.");
        err.status = 400; // Đánh dấu đây là lỗi Bad Request
        throw err;
    }
    return await customerRepository.findByCitizenID(citizenId);
  }
}

export const customerService = new CustomerService();
