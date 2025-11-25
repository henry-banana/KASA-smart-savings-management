import { savingBookRepository } from "../../repositories/SavingBook/SavingBookRepository.js";
import { transactionRepository } from "../../repositories/Transaction/TransactionRepository.js";

class ReportService {
  /**
   * Báo cáo hoạt động theo ngày
   * Thống kê số lượng sổ mở, sổ đóng và chênh lệch theo từng loại sổ trong một ngày cụ thể.
   */
  async getDailyReport(date) {
    // Giả định savingBookRepository có một phương thức để lấy dữ liệu báo cáo ngày
    // Phương thức này cần được triển khai trong Model/Repository để truy vấn DB hiệu quả
    // SELECT t.typename,
    //        COUNT(CASE WHEN sb.registertime::date = $1 THEN 1 END) as opened_count,
    //        SUM(CASE WHEN sb.registertime::date = $1 THEN sb.currentbalance ELSE 0 END) as total_opened,
    //        COUNT(CASE WHEN sb.closetime::date = $1 THEN 1 END) as closed_count,
    //        SUM(CASE WHEN sb.closetime::date = $1 THEN (SELECT amount FROM transaction WHERE bookid = sb.bookid AND type = 'Tất toán') ELSE 0 END) as total_closed
    // FROM savingbook sb
    // JOIN typesaving t ON sb.typeid = t.typeid
    // WHERE sb.registertime::date = $1 OR sb.closetime::date = $1
    // GROUP BY t.typename;
    const reportData = await savingBookRepository.generateDailyReport(date);
    if (!reportData) {
      throw new Error("Could not generate daily report.");
    }
    return reportData;
  }

  /**
   * Báo cáo hoạt động theo tháng
   * Thống kê số lượng sổ mở, sổ đóng và chênh lệch cho mỗi ngày trong tháng.
   */
  async getMonthlyReport(month, year) {
    // Giả định savingBookRepository có một phương thức để lấy dữ liệu báo cáo tháng
    // SELECT to_char(d.day, 'YYYY-MM-DD') as date,
    //        COUNT(DISTINCT CASE WHEN sb_open.registertime::date = d.day THEN sb_open.bookid END) as opened_count,
    //        COUNT(DISTINCT CASE WHEN sb_close.closetime::date = d.day THEN sb_close.bookid END) as closed_count,
    //        COALESCE(SUM(CASE WHEN sb_open.registertime::date = d.day THEN sb_open.currentbalance ELSE 0 END), 0) -
    //        COALESCE(SUM(CASE WHEN sb_close.closetime::date = d.day THEN (SELECT amount FROM transaction WHERE bookid = sb_close.bookid AND type = 'Tất toán') ELSE 0 END), 0) as difference
    // FROM generate_series(make_date($1, $2, 1), make_date($1, $2, 1) + '1 month'::interval - '1 day'::interval, '1 day'::interval) d(day)
    // LEFT JOIN savingbook sb_open ON sb_open.registertime::date = d.day
    // LEFT JOIN savingbook sb_close ON sb_close.closetime::date = d.day
    // GROUP BY d.day
    // ORDER BY d.day;
    const reportData = await savingBookRepository.generateMonthlyReport(month, year);
    if (!reportData) {
      throw new Error("Could not generate monthly report.");
    }
    return reportData;
  }

  /**
   * Báo cáo chênh lệch lãi suất
   * Thống kê tổng lãi đã trả cho khách hàng trong một khoảng thời gian.
   */
  async getInterestReport(startDate, endDate) {
    // Giả định transactionRepository có phương thức tính tổng lãi
    // SELECT SUM(amount - (SELECT currentbalance FROM savingbook WHERE bookid = t.bookid)) as total_interest
    // FROM transaction t
    // WHERE t.type = 'Tất toán' AND t.transactiontime BETWEEN $1 AND $2;
    const reportData = await transactionRepository.calculateTotalInterest(startDate, endDate);
    if (!reportData) {
      throw new Error("Could not generate interest report.");
    }
    return reportData;
  }

  /**
   * Báo cáo giao dịch
   * Liệt kê các giao dịch trong một khoảng thời gian, có thể lọc theo loại.
   */
  async getTransactionsReport(startDate, endDate, type) {
    // Giả định transactionRepository có phương thức lấy giao dịch theo khoảng thời gian và loại
    const reportData = await transactionRepository.findTransactionsByDateRange({
      startDate,
      endDate,
      type,
    });
    if (!reportData) {
      throw new Error("Could not generate transactions report.");
    }
    return reportData;
  }

  /**
   * Báo cáo tổng quan sổ tiết kiệm
   * Thống kê số lượng sổ đang hoạt động, đã đóng và tổng số dư hiện tại.
   */
  async getSavingBookSummary() {
    // Giả định savingBookRepository có phương thức thống kê
    // SELECT
    //   COUNT(*) as total_books,
    //   COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_books,
    //   COUNT(CASE WHEN status = 'Close' THEN 1 END) as closed_books,
    //   SUM(CASE WHEN status = 'Active' THEN currentbalance ELSE 0 END) as total_balance
    // FROM savingbook;
    const summary = await savingBookRepository.getSummary();
    if (!summary) {
      throw new Error("Could not generate saving book summary.");
    }
    return summary;
  }
}

export const reportService = new ReportService();