import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js";
import {customerRepository} from "../../repositories/Customer/CustomerRepository.js"
import {typeSavingRepository} from "../../repositories/TypeSaving/TypeSavingRepository.js"
import {transactionRepository} from "../../repositories/Transaction/TransactionRepository.js"
import { raw } from "express";

class SavingBookService {
  
  // Thêm sổ tiết kiệm mới
  async addSavingBook({ typeSavingID, initialDeposit, employeeID, citizenID}) {
    if (!typeSavingID || !initialDeposit || !employeeID || !citizenID) {
      throw new Error("Missing required information.");
    }

    const customer = await customerRepository.findByCitizenID(citizenID)

    // 2. Lấy thông tin loại sổ tiết kiệm
    const typeSaving = await typeSavingRepository.getTypeSavingById(typeSavingID);
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
      currentbalance: initialDeposit
    });

    newSavingBook.citizenid = citizenID

    // 5. Trả về đúng format response bạn cần
    return {
      bookid: newSavingBook.bookid,
      citizenid: citizenID,
      customerName: customer.name,
      typesavingid: typeSavingID,
      opendate: newSavingBook.opendate,
      maturitydate: newSavingBook.maturitydate,
      balance: initialDeposit,
      status: newSavingBook.status,
      typesaving: {
        typesavingid: typeSavingID,
        typename: typeSaving.typename,
        term: typeSaving.termperiod,
        interestrate: typeSaving.interest,
        minimumdeposit: typeSaving.minimumdeposit,
      }
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

        bookid: savingBook.bookid,
        citizenid: customer.citizenid,
        customerName: customer.fullname,
        typesavingid: typeSaving.typeid,
        opendate: savingBook.registertime,
        maturitydate: savingBook.maturitydate,
        balance: savingBook.currentbalance,
        status: savingBook.status,

        typesaving: {
          typesavingid: typeSaving.typeid,
          typename: typeSaving.typename,
          term: typeSaving.termperiod,
          interestrate: typeSaving.interest,
          minimumdeposit: typeSaving.minimumdeposit
        },

        transactions: transactions || []
      
    };
  }

  // Tìm kiếm sổ tiết kiệm
  async searchSavingBook(keyword) {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return [];
    }

    let results = [];
    const isOnlyDigits = /^\d+$/.test(trimmedKeyword);
    // Regex để kiểm tra chuỗi chỉ chứa chữ cái (hỗ trợ Unicode) và khoảng trắng
    const isOnlyLettersAndSpaces = /^[\p{L}\s]+$/u.test(trimmedKeyword);

    if (trimmedKeyword.startsWith('0') && isOnlyDigits) {
      // Tìm kiếm theo Citizen ID
      results = await savingBookRepository.findByCustomerCitizenID(trimmedKeyword);
    } else if (isOnlyDigits) {
      // Tìm kiếm theo Book ID
      // Do cầm join bảng để in dữ liệu theo format nên sẽ tạo hàm riêng
      results = await savingBookRepository.findByBookID(trimmedKeyword);

    } else if (isOnlyLettersAndSpaces) {
      // Tìm kiếm theo tên khách hàng
      results = await savingBookRepository.findByCustomerName(trimmedKeyword);
    }else{
      throw new Error("Keyword is only contain number or letter");
    }

    return results || []
  }

}

export const savingBookService = new SavingBookService();
