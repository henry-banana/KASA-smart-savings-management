import { transactionRepository } from "../../repositories/Transaction/TransactionRepository.js";
import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js"; 
import {employeeRepository} from "../../repositories/Employee/EmployeeRepository.js"
import { customerRepository } from "../../repositories/Customer/CustomerRepository.js";

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
      const data = await transactionRepository.findAll();

    // Map dữ liệu về đúng format
    const result = (data || []).map((item) => ({
      transactionId: item.transactionid,
      bookId: item.bookid,
      type: item.transactiontype,
      amount: item.amount,
      transactionDate: item.transactiondate,
      savingBook: item.savingbook
        ? {
            bookId: item.savingbook.bookid,
            customer: item.savingbook.customer
              ? {
                  customerId: item.savingbook.customer.customerid,
                  fullName: item.savingbook.customer.fullname,
                  idCard: item.savingbook.customer.citizenid,
                }
              : null,
            typeSaving: item.savingbook.typesaving
              ? {
                  typeName: item.savingbook.typesaving.typename,
                  interestRate: item.savingbook.typesaving.interest,
                }
              : null,
          }
        : null,
      employee: item.employee
        ? {
            employeeId: item.employee.employeeid,
            fullName: item.employee.fullname,
            role: "teller", //Do ở đây là teller mới được tạo giao dịch nên code cứng, nếu muốn đổi thì kết bảng bên model
           }
        : null,
    }));

      return result;
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

  async depositTransaction(data) {
    const savingBook = await savingBookRepository.findById(data.bookId);
    if (!savingBook) throw new Error("Account not found.");

    if (data.amount <= 0 ){
      throw new Error("Invalid amount.");
    }

    const employee = await employeeRepository.findById(data.employeeId);
    if (!employee) throw new Error("Teller ID is not exists.");

    // if (employee.roleid != 2){ //code cứng vì chưa có model role
    //   throw new Error("Employee is not permit to make deposit.");

    // }

    const updatedBook = await savingBookRepository.update(data.bookId, {
      currentbalance: Number(savingBook.currentbalance) + Number(data.amount),
    });


    const newTransaction = await transactionRepository.create({
      bookid: data.bookId,
      amount: data.amount,
      transactiontype: "Deposit",
      tellerid: data.employeeId,
    });

    if (!updatedBook){
      throw new Error("Failed to deposit money.");
    }

    if (!newTransaction){
      throw new Error("Failed to make transaction but deposit successfully.");
    }

    const customer = await customerRepository.findById(savingBook.customerid);

    const result = {
      transactionId: newTransaction.transactionid,
      bookId: newTransaction.bookid,
      type: "deposit",
      amount: newTransaction.amount,
      transactionDate: newTransaction.transactiondate,
      savingBook: {
        bookId: updatedBook.bookid,
        customer: {
          customerId: customer.customerid,
          fullName: customer.fullname,
        },
      },
      employee: {
        employeeId: employee.employeeid,
        fullName: employee.fullname,
        roleName: "teller",
      },
    };

    return result;
  }

  async withdrawTransaction(data) {
    const savingBook = await savingBookRepository.findById(data.bookID);
    if (!savingBook) throw new Error("Account not found.");

    if (data.amount <= 0) {
      throw new Error("Invalid amount.");
    }

    const employee = await employeeRepository.findById(data.employeeID);
    if (!employee) {
      throw new Error("Teller ID is not exists.");
    }

    const balanceBefore = Number(savingBook.currentbalance);
    if (balanceBefore < Number(data.amount)) {
      throw new Error("Insufficient balance.");
    }

    const balanceAfter = balanceBefore - Number(data.amount);

    const updatedBook = await savingBookRepository.update(data.bookID, {
      currentbalance: balanceAfter,
    });

    const newTransaction = await transactionRepository.create({
      bookid: data.bookID,
      amount: data.amount,
      transactiontype: "WithDraw",
      tellerid: data.employeeID,
      balancebefore: balanceBefore,
      balanceafter: balanceAfter,
    });

    if (!updatedBook) {
      throw new Error("Failed to withdraw money.");
    }

    if (!newTransaction) {
      throw new Error("Failed to make transaction but withdrawal succeeded.");
    }

    const customer = await customerRepository.findById(savingBook.customerid);

    const result = {
      transactionId: newTransaction.transactionid,
      bookId: newTransaction.bookid,
      type: "withdraw",
      amount: newTransaction.amount,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      transactionDate: newTransaction.transactiondate,
      savingBook: {
        bookId: updatedBook.bookid,
        customer: {
          customerId: customer.customerid,
          fullName: customer.fullname
        }
      },
      employee: {
        employeeId: employee.employeeid,
        fullName: employee.fullname,
        roleName: "teller"
      }
    };

    return result;
  }
    
}
 



export const transactionService = new TransactionService();
