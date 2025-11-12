import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js";
import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";

class SavingBookService {
  
  // Thêm sổ tiết kiệm mới
  async addSavingBook({ typeID, customerID, currentBalance }) {
    if (!typeID || !customerID || !currentBalance) {
      throw new Error("Missing required information.");
    }

    // Tạo sổ tiết kiệm mới
    const newSavingBook = await savingBookRepository.create({
      typeid: typeID,
      customerid: customerID,
      currentbalance: currentBalance
    });

    return {
      message: "Saving book created successfully.",
      savingBook: newSavingBook,
    };
  }

  // Cập nhật thông tin sổ tiết kiệm
  async updateSavingBook(bookID, updates) {

    // Kiểm tra sổ tiết kiệm tồn tại
    const existingBook = await savingBookRepository.findById(bookID);
    if (!existingBook) throw new Error("Saving book not found");

    // Cập nhật thông tin
    const updatedBook = await savingBookRepository.update(bookID, {
      status: updates.status,
      closetime: updates.closeTime,
      currentbalance: updates.currentBalance
    });

    return {
      message: "Saving book updated successfully",
      savingBook: updatedBook,
    };
  }

  // Xóa sổ tiết kiệm
  async deleteSavingBook(bookID) {
    const existingBook = await savingBookRepository.findById(bookID);
    if (!existingBook) throw new Error("Saving book not found");

    await savingBookRepository.delete(bookID);

    return {
      message: "Saving book deleted successfully",
    };
  }

  // Lấy thông tin sổ tiết kiệm theo ID
  async getSavingBookById(bookID) {
    const savingBook = await savingBookRepository.findById(bookID);
    if (!savingBook) throw new Error("Saving book not found");

    return savingBook;
  }
}

export const savingBookService = new SavingBookService();
