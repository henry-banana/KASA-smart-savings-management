import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js";
import { customerRepository } from "../../repositories/Customer/CustomerRepository.js";
import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";
import {
  TransactionRepository,
  transactionRepository,
} from "../../repositories/Transaction/TransactionRepository.js";
import { raw } from "express";

class SavingBookService {
  // Thêm sổ tiết kiệm mới
  async addSavingBook({ typeSavingID, initialDeposit, employeeID, citizenID }) {
    if (!typeSavingID || !initialDeposit || !employeeID || !citizenID) {
      throw new Error("Missing required information.");
    }

    const customer = await customerRepository.findByCitizenID(citizenID);

    // 2. Lấy thông tin loại sổ tiết kiệm
    const typeSaving = await typeSavingRepository.findById(typeSavingID);
    if (!typeSaving) {
      throw new Error("TypeSaving not found: " + typeSavingID);
    }

    // 3. Tính ngày mở và ngày đáo hạn
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + typeSaving.term);

    // Tạo sổ tiết kiệm mới
    //PHau: chưa thêm nhân viên nào tạo ????
    const newSavingBook = await savingBookRepository.create({
      typeid: typeSavingID,
      customerid: customer.customerid,
      currentbalance: initialDeposit,
    });

    newSavingBook.citizenid = citizenID;

    // 5. Trả về đúng format response bạn cần
    return {
      bookId: newSavingBook.bookid,
      citizenId: citizenID,
      customerName: customer.name,
      typesavingId: typeSavingID,
      openDate: newSavingBook.opendate,
      maturityDate: newSavingBook.maturitydate,
      balance: initialDeposit,
      status: newSavingBook.status,
      typesaving: {
        typesavingId: typeSavingID,
        typeName: typeSaving.typename,
        term: typeSaving.termPeriod,
        interestRate: typeSaving.interest,
        minimumDeposit: typeSaving.minimumdeposit,
      },
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
      currentbalance: updates.currentBalance,
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
    // 1. Lấy thông tin sổ tiết kiệm
    const savingBook = await savingBookRepository.findById(bookID);
    if (!savingBook) throw new Error("Saving book not found");

    // 2. Lấy khách hàng theo customerid
    const customer = await customerRepository.findById(savingBook.customerid);
    if (!customer) throw new Error("Customer not found");

    // 3. Lấy loại sổ tiết kiệm
    const typeSaving = await typeSavingRepository.findById(savingBook.typeid);
    if (!typeSaving) throw new Error("TypeSaving not found");

    // 4. Lấy danh sách giao dịch
    const transactions = await transactionRepository.findById(bookID);

    return {
      bookId: savingBook.bookid,
      citizenId: customer.citizenid,
      customerName: customer.fullname,
      typeSavingId: typeSaving.typeid,
      openDate: savingBook.registertime,
      maturityDate: savingBook.maturitydate,
      balance: savingBook.currentbalance,
      status: savingBook.status,

      typeSaving: {
        typeSavingId: typeSaving.typeid,
        typeName: typeSaving.typename,
        term: typeSaving.termperiod,
        interestRate: typeSaving.interest,
      },

      transactions: transactions || [],
    };
  }

  // Tìm kiếm sổ tiết kiệm
  async searchSavingBook(keyword) {
    // Nếu không có keyword hoặc keyword rỗng, lấy tất cả
    if (!keyword || keyword.trim() === "") {
      return await savingBookRepository.findAll();
    }

    const trimmedKeyword = keyword.trim();
    let results = [];
    const isOnlyDigits = /^\d+$/.test(trimmedKeyword);
    // Regex để kiểm tra chuỗi chỉ chứa chữ cái (hỗ trợ Unicode) và khoảng trắng
    const isOnlyLettersAndSpaces = /^[\p{L}\s]+$/u.test(trimmedKeyword);

    if (trimmedKeyword.startsWith("0") && isOnlyDigits) {
      // Tìm kiếm theo Citizen ID
      results = await savingBookRepository.findByCustomerCitizenID(
        trimmedKeyword
      );
    } else if (isOnlyDigits) {
      // Tìm kiếm theo Book ID
      // Do cần join bảng để in dữ liệu theo format nên sẽ tạo hàm riêng
      results = await savingBookRepository.findByBookID(trimmedKeyword);
    } else if (isOnlyLettersAndSpaces) {
      // Tìm kiếm theo tên khách hàng
      results = await savingBookRepository.findByCustomerName(trimmedKeyword);
    } else {
      throw new Error("Keyword is only contain number or letter");
    }

    return results || [];
  }

  // Tất toán sổ tiết kiệm
  async closeSavingBook(bookID, employeeID) {
    // 1. Lấy thông tin sổ tiết kiệm và kiểm tra trạng thái
    const savingBook = await savingBookRepository.findById(bookID);
    if (!savingBook || savingBook.status === "Close") {
      // Nếu không tìm thấy hoặc đã đóng, trả về null
      return null;
    }

    // 2. Lấy thông tin liên quan (loại sổ, khách hàng)
    const typeSaving = await typeSavingRepository.findById(savingBook.typeid);
    if (!typeSaving) throw new Error("TypeSaving not found for this book");

    const customer = await customerRepository.findById(savingBook.customerid);
    if (!customer) throw new Error("Customer not found for this book");

    // 3. Tính toán tiền lãi
    const openDate = new Date(savingBook.registertime);
    const closeDate = new Date();
    const timeDiff = closeDate.getTime() - openDate.getTime();
    const daysHeld = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Giả sử lãi suất được tính theo năm (365 ngày)
    // Logic này có thể cần phức tạp hơn tùy theo quy định (rút trước hạn, đúng hạn,...)
    const interestEarned =
      savingBook.currentbalance *
      (typeSaving.interest / 100) *
      (daysHeld / 365);
    const finalAmount = savingBook.currentbalance + interestEarned;

    // 4. Tạo giao dịch tất toán
    const settlementTransaction = await transactionRepository.create({
      bookid: bookID,
      tellerid: employeeID,
      transactiondate: closeDate.toISOString(),
      amount: finalAmount,
      transactiontype: "WithDraw", // 'Settlement'
      note: `Tất toán sổ tiết kiệm. Gốc: ${
        savingBook.currentbalance
      }, Lãi: ${interestEarned.toFixed(2)}`,
    });

    // 5. Cập nhật trạng thái và thời gian đóng sổ tiết kiệm
    const updatedBook = await savingBookRepository.update(bookID, {
      status: "Close",
      currentbalance: 0,
      closetime: closeDate.toISOString(),
    });

    // 6. Trả về kết quả theo định dạng yêu cầu
    return {
      bookId: bookID,
      finalBalance: finalAmount,
      interest: interestEarned,
      status: "closed", // Hoặc updatedBook.status.toLowerCase()
    };
  }
}

export const savingBookService = new SavingBookService();
