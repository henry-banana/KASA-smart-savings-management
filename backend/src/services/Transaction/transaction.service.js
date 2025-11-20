import { transactionRepository } from "../../repositories/Transaction/TransactionRepository.js";
import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js"; 
import {employeeRepository} from "../../repositories/Employee/EmployeeRepository.js"

class TransactionService {
  // Thêm giao dịch mới
  async addTransaction({ bookID, amount, type, tellerid, transactionDate="",  note=""}) {
    if (!bookID || !amount || !type || !tellerid)
      throw new Error("Missing required information.");

    // kiểm tra tài khoản có tồn tại không (nếu cần)
    const book = await savingBookRepository.findById(bookID);
    if (!book) throw new Error("Account not found.");

    let newTransaction;

    if (!transactionDate){
      // tạo giao dịch mới
      newTransaction = await transactionRepository.create({
        bookid: bookID,
        amount,
        transactiontype: type,
        note,
        tellerid
      });  
    }else{
      // tạo giao dịch mới
      newTransaction = await transactionRepository.create({
        bookid: bookID,
        amount,
        transactiontype: type,
        note,
        transactiondate: transactionDate,
        tellerid
      });
    }

    // Kiểm tra tellerid có tồn tại không
    const teller = await employeeRepository.findById(tellerid);

    if (teller){
      // Nếu tồn tại thì có phải teller không
    }else{
      throw new Error("Teller ID is not exists.")
    }

    // // có thể cập nhật số dư nếu nghiệp vụ yêu cầu
    // if (type === "Deposit") {
    //   await UserAccountRepository.updateBalance(accountID, account.balance + amount);
    // } else if (type === "WithDraw") {
    //   if (account.balance < amount) throw new Error("Insufficient balance.");
    //   await UserAccountRepository.updateBalance(accountID, account.balance - amount);
    // }

    return {
      message: "Transaction added successfully.",
      transaction: newTransaction,
    };
  }

  // Lấy toàn bộ giao dịch
  async getAllTransactions() {
    const transactions = await transactionRepository.findAll();
    return transactions;
  }

  // Lấy giao dịch theo ID
  async getTransactionById(id) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) throw new Error("Transaction not found.");
    return transaction;
  }

  // Cập nhật thông tin giao dịch
  async updateTransaction(id, updates) {
    const existingTransaction = await transactionRepository.findById(id);
    if (!existingTransaction) throw new Error("Transaction not found.");

    const updatedTransaction = await transactionRepository.update(id, {
      amount: updates.amount,
      // type: updates.type,
      // description: updates.description,
    });

    return {
      message: "Transaction updated successfully.",
      transaction: updatedTransaction,
    };
  }

  // Xóa giao dịch
  async deleteTransaction(id) {
    const existingTransaction = await transactionRepository.findById(id);
    if (!existingTransaction) throw new Error("Transaction not found.");

    await transactionRepository.delete(id);

    return { message: "Transaction deleted successfully." };
  }
}

export const transactionService = new TransactionService();
