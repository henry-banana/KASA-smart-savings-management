import { customerService } from "../../services/Customer/customer.service.js";

// Thêm khách hàng mới
export async function addCustomer(req, res) {
  try {
    const result = await customerService.addCustomer(req.body);

    return res.status(201).json({
      message: "Customer added successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error adding customer:", err);

    return res.status(err.status || 500).json({
      message: "Failed to add customer",
      success: false,
    });
  }
}

// Lấy danh sách tất cả khách hàng
export async function getAllCustomers(req, res) {
  try {
    const result = await customerService.getAllCustomers();

    return res.status(200).json({
      message: "Get customers successfully",
      success: true,
      total: result.length,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting customers:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve customers",
      success: false,
    });
  }
}

// Lấy thông tin khách hàng theo ID
export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.getCustomerById(id);

    if (!result) {
      return res.status(404).json({
        message: "Customer not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Get customer successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting customer by ID:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve customer",
      success: false,
    });
  }
}

// Cập nhật thông tin khách hàng
export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.updateCustomer(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Customer not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Customer updated successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error updating customer:", err);

    return res.status(err.status || 500).json({
      message: "Failed to update customer",
      success: false,
    });
  }
}
//find by cizizenId
export async function getCustomerByCitizenId(req, res) {
  try {
    // Lấy citizenId từ Query String (?citizenId=...)
    const { citizenId } = req.query;

    if (!citizenId) {
      return res.status(400).json({
        success: false,
        message: "Citizen ID is required in query parameters"
      });
    }

    const customer = await customerService.findCustomerByCitizenId(citizenId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Xóa khách hàng
export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.deleteCustomer(id);

    if (!result) {
      return res.status(404).json({
        message: "Customer not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Customer deleted successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error deleting customer:", err);

    return res.status(err.status || 500).json({
      message: "Failed to delete customer",
      success: false,
    });
  }
}

// Tìm kiếm khách hàng theo keyword
export async function searchCustomer(req, res) {
  try {
    const { keyword } = req.query;
    const result = await customerService.searchCustomers(keyword);

    return res.status(200).json({
      message: "Search customers successfully",
      success: true,
      total: result.length,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error searching customers:", err);

    return res.status(err.status || 500).json({
      message: "Failed to search customers",
      success: false,
    });
  }
}
