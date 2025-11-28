
import { reportRepository } from "../../repositories/Report/ReportRepository.js";

class ReportService {

    async getDailyReport(date) {
      const { types, transactions } = await reportRepository.getDailyData(date);


      // Gom theo loại tiết kiệm
      const byTypeSaving = types.map(type => {

        const deposits = transactions
          .filter(t => t.savingbook?.typeid === type.typeid && t.transactiontype === "Deposit")
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        const withdrawals = transactions
          .filter(t => t.savingbook?.typeid === type.typeid && t.transactiontype === "WithDraw")
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
          typeSavingId: type.typeid,
          typeName: type.typename,
          totalDeposits: deposits, 
          totalWithdrawals: withdrawals,
          difference: Math.abs(deposits - withdrawals)
        };
      });


      // Summary
      const summary = {
        totalDeposits: byTypeSaving.reduce((s, t) => s + t.totalDeposits, 0),
        totalWithdrawals: byTypeSaving.reduce((s, t) => s + t.totalWithdrawals, 0),
        difference: byTypeSaving.reduce((s, t) => s + t.difference, 0),
      };

      return {
        date,
        byTypeSaving,
        summary,
      };
    }

    async getMonthlyReport(typeSavingId, month, year) {
      // 1. Lấy dữ liệu từ Repo (Thông tin loại sổ, List sổ mở, List sổ đóng)
      const { typeInfo, newBooks, closedBooks } = await reportRepository.getMonthlyData(typeSavingId, month, year);

      // 2. Tính số ngày trong tháng (ví dụ tháng 2 năm 2025 có 28 ngày)
      const daysInMonth = new Date(year, month, 0).getDate();
      const byDay = [];

      // Biến để tính tổng summary
      let totalNew = 0;
      let totalClosed = 0;

      // 3. Loop từng ngày để gom dữ liệu
      for (let d = 1; d <= daysInMonth; d++) {
        // Lọc ra các sổ mở trong ngày d
        const countNew = newBooks.filter(book => {
          const date = new Date(book.opendate); // Giả sử cột ngày mở là opendate
          return date.getDate() === d;
        }).length;

        // Lọc ra các sổ đóng trong ngày d
        const countClosed = closedBooks.filter(book => {
          if(!book.closeddate) return false; // Check null
          const date = new Date(book.closeddate); // Giả sử cột ngày đóng là closeddate
          return date.getDate() === d;
        }).length;

        // Push vào mảng
        byDay.push({
          day: d,
          newSavingBooks: countNew,
          closedSavingBooks: countClosed,
          difference: Math.abs(countNew - countClosed)
        });

        // Cộng dồn summary
        totalNew += countNew;
        totalClosed += countClosed;
      }

      // 4. Trả về cấu trúc đúng format yêu cầu
      return {
        month: month,
        year: year,
        typeSavingId: typeSavingId,
        typeName: typeInfo ? typeInfo.typename : "Unknown",
        byDay: byDay,
        summary: {
          newSavingBooks: totalNew,
          closedSavingBooks: totalClosed,
          difference: Math.abs(totalNew - totalClosed)
        }
      };
    }
}




export const reportService = new ReportService();
