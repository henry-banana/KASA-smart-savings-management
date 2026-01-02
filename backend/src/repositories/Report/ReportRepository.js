// repositories/ReportRepository.js
import { Transaction} from "../../models/Transaction.js"
import { TypeSaving } from "../../models/TypeSaving.js";
import { supabase } from "../../config/database.js";

class ReportRepository {

  /**
   * Lấy dữ liệu thô cho báo cáo ngày:
   * - Danh sách loại sổ tiết kiệm
   * - Danh sách giao dịch trong ngày
   */
  async getDailyData(date) {
    if (!date) throw new Error("Missing date parameter");

    // 1. Lấy tất cả loại sổ 
    const types = await TypeSaving.getAll();

    // 2. Lấy các giao dịch theo ngày
    const transactions = await Transaction.getTransactionsByDate(date);

    return {
      types,          // [{ id, name }]
      transactions    // [{ transactionId, typeSavingId, type, amount }]
    };
  }

  async getMonthlyData(typeSavingId, month, year) {
    // Tạo chuỗi ngày đầu tháng và cuối tháng cho query
    // Ví dụ: 2025-01-01 đến 2025-01-31 23:59:59
    
    // Format YYYY-MM
    const paddedMonth = month.toString().padStart(2, '0');
    const startDate = `${year}-${paddedMonth}-01`;
    
    // Tìm ngày cuối cùng của tháng đó
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${paddedMonth}-${lastDayOfMonth}`;

    
    // 1. Lấy thông tin loại sổ (để lấy typeName)
    const { data: typeInfo } = await supabase
      .from("typesaving")
      .select("typename")
      .eq("typeid", typeSavingId)
      .single();
    
      let newBooksResult = [];
      let closedBooksResult = [];

    //Trường hợp lấy sổ cụ thể
    if (typeSavingId != null ){
      // 2. Lấy danh sách Sổ Mở Mới trong tháng (dựa trên opendate)
      const { data: newBooks, error: errNew } = await supabase
        .from("savingbook")
        .select("bookid, registertime")
        .eq("typeid", typeSavingId)
        .gte("registertime", `${startDate}T00:00:00`)
        .lte("registertime", `${endDate}T23:59:59`);

      if (errNew) throw new Error(`Error fetching new books: ${errNew.message}`);
      newBooksResult = newBooks;

      // 3. Lấy danh sách Sổ Đã Đóng trong tháng (dựa trên closeddate)
      // Giả sử sổ đóng thì closeddate sẽ khác null
      const { data: closedBooks, error: errClosed } = await supabase
        .from("savingbook")
        .select("bookid, maturitydate")
        .eq("typeid", typeSavingId)
        .gte("maturitydate", `${startDate}T00:00:00`)
        .lte("maturitydate", `${endDate}T23:59:59`);

      if (errClosed) throw new Error(`Error fetching closed books: ${errClosed.message}`);
      closedBooksResult = closedBooks;
    }else{
      //Lấy hết
      // 2. Lấy danh sách Sổ Mở Mới trong tháng (dựa trên opendate)
      const { data: newBooks, error: errNew } = await supabase
        .from("savingbook")
        .select("bookid, registertime")
        .gte("registertime", `${startDate}T00:00:00`)
        .lte("registertime", `${endDate}T23:59:59`);

      if (errNew) throw new Error(`Error fetching new books: ${errNew.message}`);
      newBooksResult = newBooks;

      // 3. Lấy danh sách Sổ Đã Đóng trong tháng (dựa trên closeddate)
      // Giả sử sổ đóng thì closeddate sẽ khác null
      const { data: closedBooks, error: errClosed } = await supabase
        .from("savingbook")
        .select("bookid, maturitydate")
        .gte("maturitydate", `${startDate}T00:00:00`)
        .lte("maturitydate", `${endDate}T23:59:59`);

      if (errClosed) throw new Error(`Error fetching closed books: ${errClosed.message}`);
      closedBooksResult = closedBooks;
    }

    

    return {
      typeInfo,
      newBooks: newBooksResult || [],
      closedBooks: closedBooksResult || []
    };
  }
}

export const reportRepository = new ReportRepository();
