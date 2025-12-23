import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js";
import { customerRepository } from "../../repositories/Customer/CustomerRepository.js";
import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";
import {
  TransactionRepository,
  transactionRepository,
} from "../../repositories/Transaction/TransactionRepository.js";
import { raw } from "express";

class SavingBookService {

 // =========================================================================
  // PRIVATE HELPER: XỬ LÝ LAZY LOADING (Phiên bản Fix Mapping)
  // =========================================================================
  async _performRollover(savingBook, typeSaving) {
    // 1. CHUẨN HÓA DỮ LIỆU ĐẦU VÀO (Mapping)
    // Log cho thấy object dùng CamelCase, nhưng DB trả về Lowercase.
    // Ta lấy giá trị linh hoạt từ cả 2 trường hợp.
    
    const bookId = savingBook.bookId || savingBook.bookid;
    const currentMaturityDateStr = savingBook.maturityDate || savingBook.maturitydate;
    const currentBalanceRaw = 
        savingBook.balance !== undefined ? savingBook.balance : savingBook.currentbalance;
    if (!bookId) {
        console.error("❌ Rollover Error: Missing Book ID");
        return savingBook;
    }

    let maturityDate = new Date(currentMaturityDateStr);
    const currentDate = new Date();
    let currentBalance = parseFloat(currentBalanceRaw);
    let isUpdated = false;

    // Lấy thông tin kỳ hạn và lãi suất
    const isNoTerm = typeSaving.typename === "No term" || typeSaving.termperiod === 0;
    const termMonths = isNoTerm ? 1 : typeSaving.termperiod;
    const interestRatePercent = parseFloat(typeSaving.interest); 

    // 2. VÒNG LẶP TÍNH LÃI
    while (maturityDate <= currentDate) {
      // Nếu loại sổ bị vô hiệu hóa -> Dừng tái tục
      if (typeSaving.isactive === false) {
        break; 
      }

      // Tính lãi: Gốc * (Lãi%/100) * Số tháng
      const interestAmount = currentBalance * (interestRatePercent / 100) * termMonths;
      
      // Lãi nhập vốn
      currentBalance += interestAmount;
      
      // Gia hạn ngày đáo hạn
      maturityDate.setMonth(maturityDate.getMonth() + termMonths);
      
      isUpdated = true;
    }

    // 3. CẬP NHẬT DATABASE & OBJECT TRẢ VỀ
    if (isUpdated) {
      console.log(`✅ Saving changes for Book [${bookId}] - New Balance: ${currentBalance}`);
      
      // A. Update Database (Repo thường yêu cầu đúng tên cột trong DB - Lowercase)
      await savingBookRepository.update(bookId, {
        currentbalance: currentBalance,       // Tên cột trong DB
        maturitydate: maturityDate.toISOString(), // Tên cột trong DB
      });
    }

    // B. LUÔN cập nhật object trả về (cho dù có isUpdated hay không)
    // Cần cập nhật để đảm bảo dữ liệu mới nhất được trả về
    if (savingBook.balance !== undefined) savingBook.balance = currentBalance;
    if (savingBook.currentbalance !== undefined) savingBook.currentbalance = currentBalance;

    if (savingBook.maturityDate !== undefined) savingBook.maturityDate = maturityDate.toISOString();
    if (savingBook.maturitydate !== undefined) savingBook.maturitydate = maturityDate.toISOString();

    return savingBook;
  }



  // Thêm sổ tiết kiệm mới
  async addSavingBook({ typeSavingID, initialDeposit, employeeID, citizenID }) {
    if (!typeSavingID || !initialDeposit || !employeeID || !citizenID) {
      throw new Error("Missing required information.");
    }

    const customer = await customerRepository.findByCitizenID(citizenID);
    if (!customer) {
      throw new Error("Customer not found: " + citizenID);
    }

    // 2. Lấy thông tin loại sổ tiết kiệm
    const typeSaving = await typeSavingRepository.findById(typeSavingID);
    if (!typeSaving) {
      throw new Error("TypeSaving not found: " + typeSavingID);
    }

    const minimumDeposit = typeSaving.minimumdeposit ?? 100000;

    // Validate tiền gửi tối thiểu
    if (initialDeposit < minimumDeposit) {
      throw new Error(`Minimum deposit amount is ${minimumDeposit} VND`);
    }


    // 3. Tính ngày mở và ngày đáo hạn
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + typeSaving.term);

    // Tạo sổ tiết kiệm mới
    const newSavingBook = await savingBookRepository.create({
      typeid: typeSavingID,
      customerid: customer.customerid,
      currentbalance: initialDeposit,
    });

    newSavingBook.citizenid = citizenID;

    // 4. Tạo transaction cho khoản gửi tiền ban đầu
    await transactionRepository.create({
      bookid: newSavingBook.bookid,
      tellerid: employeeID,
      transactiondate: new Date().toISOString(),
      amount: initialDeposit,
      transactiontype: "Deposit",
      note: "open",
    });

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

    // 4. Tạo transaction cho khoản gửi tiền ban đầu
    await transactionRepository.create({
      bookid: bookID,
      transactiondate: new Date().toISOString(),
      amount: updates.currentBalance,
      transactiontype: "Deposit",
      note: "deposit",
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
    let savingBook = await savingBookRepository.findById(bookID);
    if (!savingBook) throw new Error("Saving book not found");

    // 2. Lấy khách hàng theo customerid
    const customer = await customerRepository.findById(savingBook.customerid);
    if (!customer) throw new Error("Customer not found");

    // 3. Lấy loại sổ tiết kiệm
    const typeSaving = await typeSavingRepository.findById(savingBook.typeid);
    if (!typeSaving) throw new Error("TypeSaving not found");

    // 4. Lấy danh sách giao dịch
    const transactions = await transactionRepository.findById(bookID);

    // Cũ: 5. Xử lý cập nhật lãi suất và ngày đáo hạn (cho sổ không kỳ hạn hoặc tự động gia hạn)
    // Lưu ý: Logic này áp dụng khi bạn muốn tự động cộng dồn lãi và dời ngày đáo hạn
    // if (typeSaving.typename === "No term") { // Hoặc check logic khác tùy nhu cầu
    //   let maturityDate = new Date(savingBook.maturitydate);
    //   const currentDate = new Date();
    //   let currentBalance = parseFloat(savingBook.currentbalance); // Đảm bảo là số thực
    //   let isUpdated = false;

    //   // Lãi suất hàng tháng (User đang để cứng 0.0015, tức 0.15%/tháng)
    //   // Nếu trong DB typeSaving.interest là lãi năm (ví dụ 6%), công thức nên là: typeSaving.interest / 100 / 12
    //   const monthlyInterestRate = 0.0015; 

    //   // Vòng lặp: Nếu ngày đáo hạn <= ngày hiện tại thì thực hiện tất toán tháng đó
    //   while (maturityDate <= currentDate) {
    //     // A. Cộng lãi nhập vốn
    //     currentBalance += currentBalance * monthlyInterestRate;

    //     // B. Cập nhật maturityDate lên 1 tháng tiếp theo
    //     // setMonth tự động xử lý việc chuyển năm (vd: tháng 12 -> tháng 1 năm sau)
    //     maturityDate.setMonth(maturityDate.getMonth() + 1);

    //     isUpdated = true;
    //   }

    //   // Nếu có sự thay đổi, cập nhật vào Database
    //   if (isUpdated) {
    //     await savingBookRepository.update(bookID, {
    //       currentbalance: currentBalance,
    //       // Chuyển về string ISO để lưu DB
    //       maturitydate: maturityDate.toISOString(), 
    //     });

    //     // Cập nhật lại biến local để trả về kết quả mới nhất cho client
    //     savingBook.currentbalance = currentBalance;
    //     savingBook.maturitydate = maturityDate.toISOString(); 
    //   }
    // }
    
    // [LAZY LOADING]: Gọi hàm private để tính toán lãi và cập nhật ngày đáo hạn mới nhất
    if (savingBook.status === 'Open') {
        savingBook = await this._performRollover(savingBook, typeSaving);
    }
    return {
      bookId: savingBook.bookid,
      citizenId: customer.citizenid,
      customerName: customer.fullname,
      typeSavingId: typeSaving.typeid,
      openDate: savingBook.registertime,
      maturityDate: savingBook.maturitydate, // Ngày này đã được cập nhật thành tương lai
      balance: savingBook.currentbalance,    // Số dư này đã bao gồm lãi
      status: savingBook.status,

      typeSaving: {
        typeSavingId: typeSaving.typeid,
        typeName: typeSaving.typename,
        term: typeSaving.termperiod,
        interestRate: typeSaving.interest,
        isActive: typeSaving.isactive // Trả về để FE biết gói này còn hoạt động ko
      },

      transactions: transactions || [],
    };
  }

  // Tìm kiếm sổ tiết kiệm
  async searchSavingBook(keyword, pageSize = 10, pageNumber = 1) {
    // Nếu không có keyword hoặc keyword rỗng, lấy tất cả
    let results = [];
    if (!keyword || keyword.trim() === "") {
      results = await savingBookRepository.findAll();
    } else {
      const trimmedKeyword = keyword.trim();

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
        results = await savingBookRepository.findByBookID(trimmedKeyword);
      } else if (isOnlyLettersAndSpaces) {
        // Tìm kiếm theo tên khách hàng
        results = await savingBookRepository.findByCustomerName(trimmedKeyword);
      } else {
        throw new Error("Keyword is only contain number or letter");
      }
    }

    // Áp dụng phân trang trước khi tính lãi
    const total = results.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Kiểm tra và cộng lãi suất cho sổ không kì hạn (chỉ tính cho trang hiện tại)
     const currentDate = new Date(); // Lấy ngày hiện tại một lần dùng chung
     const monthlyInterestRate = 0.0015; // Lãi suất 0.15%

    //Cũ
    for (let i = 0; i < paginatedResults.length; i++) {
      // Giả sử typeId == 1 là loại sổ cần tự động gia hạn lãi (No term)

      if (paginatedResults[i].typeId == 1) {
        let maturityDate = new Date(paginatedResults[i].maturityDate);
        let currentBalance = parseFloat(paginatedResults[i].balance);
        let isUpdated = false;

        // Vòng lặp: Nếu ngày đáo hạn đã qua hoặc là hôm nay
        while (maturityDate <= currentDate) {
          // 1. Cộng lãi nhập vốn
          currentBalance += currentBalance * monthlyInterestRate;
          
          // 2. Tăng maturityDate lên 1 tháng
          maturityDate.setMonth(maturityDate.getMonth() + 1);
          
          isUpdated = true;
        }

        // Nếu có cập nhật (tức là đã qua ngày đáo hạn cũ)
        if (isUpdated) {
          await savingBookRepository.update(paginatedResults[i].bookId, {
            currentbalance: currentBalance,
            maturitydate: maturityDate.toISOString(), // Cập nhật ngày đáo hạn mới (tương lai)
          });

          // Cập nhật lại dữ liệu trong mảng kết quả để trả về cho Client hiển thị đúng ngay lập tức
          paginatedResults[i].balance = currentBalance;
          paginatedResults[i].maturityDate = maturityDate.toISOString();
        }
      }
    }

    
    return {
      total: total,
      data: paginatedResults,
    };
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

    // Kiểm tra 15 ngày
    const registerDate = new Date(savingBook.registertime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - registerDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays < 15) {
      throw new Error(`Cannot close saving book. It must be open for at least 15 days. Current: ${diffDays} days.`);
    }


    const customer = await customerRepository.findById(savingBook.customerid);
    if (!customer) throw new Error("Customer not found for this book");

    // // 3. Tính toán tiền lãi
    // const openDate = new Date(savingBook.registertime);
    // const closeDate = new Date();
    // const timeDiff = closeDate.getTime() - openDate.getTime();
    // const daysHeld = Math.floor(timeDiff / (1000 * 3600 * 24));

    // // Giả sử lãi suất được tính theo năm (365 ngày)
    // // Logic này có thể cần phức tạp hơn tùy theo quy định (rút trước hạn, đúng hạn,...)
    // const interestEarned =
    //   savingBook.currentbalance *
    //   (typeSaving.interest / 100) *
    //   (daysHeld / 365);
    // const finalAmount = savingBook.currentbalance + interestEarned;


    // C. [LOGIC]: Lazy Loading - Cập nhật lãi/tái tục lần cuối
    savingBook = await this._performRollover(savingBook, typeSaving);
    
    // D. Tính toán tiền lãi phát sinh (interestEarned) và tổng tiền (finalAmount)
    let finalAmount = parseFloat(savingBook.currentbalance);
    let interestEarned = 0; // Biến này lưu phần lãi phát sinh thêm (nếu rút trước hạn)
    const maturityDate = new Date(savingBook.maturitydate);

    // Chỉ tính toán phức tạp nếu là Sổ Có Kỳ Hạn
    if (typeSaving.typename !== "No term" && typeSaving.termperiod > 0) {
      
      // Nếu ngày hiện tại nhỏ hơn ngày đáo hạn kế tiếp => RÚT TRƯỚC HẠN
      if (currentDate < maturityDate) {
        
        // 1. Tìm ngày đáo hạn gần nhất (Last Maturity)
        const lastMaturityDate = new Date(maturityDate);
        lastMaturityDate.setMonth(lastMaturityDate.getMonth() - typeSaving.termperiod);
        
        // 2. Tính số tháng dư ra (Surplus) - Bỏ qua ngày lẻ
        let surplusMonths = 0;
        let monthsDiff = (currentDate.getFullYear() - lastMaturityDate.getFullYear()) * 12;
        monthsDiff -= lastMaturityDate.getMonth();
        monthsDiff += currentDate.getMonth();
        
        if (currentDate.getDate() < lastMaturityDate.getDate()) {
            monthsDiff--;
        }
        surplusMonths = Math.max(0, monthsDiff);

        // 3. Tính lãi phần dư (0.15%)
        const demandInterestRate = 0.0015; 
        interestEarned = finalAmount * demandInterestRate * surplusMonths;
        
        // Cộng lãi dư vào tổng tiền
        finalAmount += interestEarned;
      }
    }


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
