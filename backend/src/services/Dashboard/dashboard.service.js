import { Transaction } from "../../models/Transaction.js";
import { SavingBookModel as SavingBook } from "../../models/SavingBook.js";

class DashboardService {
  
  // Hàm hỗ trợ format ngày DD.MM
  formatDateDDMM(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}`;
  }

  // Hàm hỗ trợ tính % thay đổi
  calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const percent = ((current - previous) / previous) * 100;
    return (percent > 0 ? "+" : "") + percent.toFixed(1) + "%";
  }

  async getStats() {
    const today = new Date();
    
    // 1. Xác định khung thời gian
    // Tuần này (7 ngày gần nhất): từ day-6 đến today
    const currentWeekEnd = new Date(today);
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - 6);

    // Tuần trước (để so sánh): từ day-13 đến day-7
    const preWeekEnd = new Date(currentWeekStart);
    preWeekEnd.setDate(preWeekEnd.getDate() - 1);
    const preWeekStart = new Date(preWeekEnd);
    preWeekStart.setDate(preWeekEnd.getDate() - 6);

    // Convert sang string YYYY-MM-DD cho DB query
    const strCurrentStart = currentWeekStart.toISOString().split('T')[0];
    const strCurrentEnd = currentWeekEnd.toISOString().split('T')[0];
    const strPreStart = preWeekStart.toISOString().split('T')[0];
    const strPreEnd = preWeekEnd.toISOString().split('T')[0];

    // =========================================================
    // QUERY DATA (Chỉ lấy những gì cần thiết - Optimization)
    // =========================================================
    
    // Query 1: Lấy tất cả Transaction trong 14 ngày qua (Tuần này + Tuần trước)
    const allRecentTrans = await Transaction.getTransactionsByDateRange(strPreStart, strCurrentEnd);

    // Query 2: Lấy tất cả sổ đang Active
    const activeBooks = await SavingBook.getAllActiveBooks();

    // =========================================================
    // XỬ LÝ DỮ LIỆU (IN-MEMORY AGGREGATION)
    // =========================================================

    // --- A. Tách dữ liệu transaction thành 2 tuần ---
    const currentTrans = [];
    const preTrans = [];

    // Dùng timestamp để so sánh chính xác
    // Tạo bản sao Date objects để tránh modify original
    const timeCurrentStart = new Date(currentWeekStart).setHours(0,0,0,0);
    const timePreStart = new Date(preWeekStart).setHours(0,0,0,0);
    const timePreEnd = new Date(preWeekEnd).setHours(23,59,59,999);

    allRecentTrans.forEach(t => {
      const tTime = new Date(t.transactiondate).getTime();
      if (tTime >= timeCurrentStart) {
        currentTrans.push(t);
      } else if (tTime >= timePreStart && tTime <= timePreEnd) {
        preTrans.push(t);
      }
    });

    // --- B. Tính toán tổng tiền Gửi/Rút (Stats & Changes) ---
    const sumDepositCur = currentTrans
      .filter(t => t.transactiontype === 'Deposit')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const sumWithdrawCur = currentTrans
      .filter(t => t.transactiontype === 'WithDraw')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const sumDepositPre = preTrans
      .filter(t => t.transactiontype === 'Deposit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const sumWithdrawPre = preTrans
      .filter(t => t.transactiontype === 'WithDraw')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // --- C. Logic changes.activeSavingBooks ---
    //Lấy số sổ hiện tại - sổ vừa mở (trong 7 ngày) = số sổ 7 ngày trước.
    // Check registertime của activeBooks
    const totalActiveNow = activeBooks.length;
    
    // Đếm số sổ có registertime nằm trong tuần hiện tại
    const newBooksCount = activeBooks.filter(book => {
      const regTime = new Date(book.registertime).getTime();
      return regTime >= timeCurrentStart;
    }).length;

    const activePreWeek = totalActiveNow - newBooksCount; // Theo logic người dùng yêu cầu (giả định không có đóng sổ)
    
    // --- D. Xử lý weeklyTransactions (Biểu đồ 7 ngày) ---
    const weeklyMap = {};
    
    // Khởi tạo map cho đủ 7 ngày (tránh trường hợp ngày đó ko có giao dịch bị thiếu)
    for (let i = 0; i <= 6; i++) {
        const d = new Date(currentWeekStart);
        d.setDate(currentWeekStart.getDate() + i);
        const key = this.formatDateDDMM(d);
        weeklyMap[key] = { name: key, deposits: 0, withdrawals: 0 };
    }

    // Fill data
    currentTrans.forEach(t => {
        const key = this.formatDateDDMM(new Date(t.transactiondate));
        // Chỉ map nếu key tồn tại (đề phòng timezone lệch xíu)
        if (weeklyMap[key]) {
            if (t.transactiontype === 'Deposit') {
                // Chia 1.000.000 nếu muốn đơn vị là triệu VND như contract note,
                // nhưng API trả về số nguyên thường tốt hơn, Frontend tự format. 
                // Ở đây tôi giữ nguyên raw number theo format mẫu JSON của bạn là 150 (có thể là 150 triệu hoặc 150 đơn vị).
                // Dựa vào note: "đơn vị: triệu VND", tôi sẽ chia.
                weeklyMap[key].deposits += Number(t.amount) / 1000000; 
            } else {
                weeklyMap[key].withdrawals += Number(t.amount) / 1000000;
            }
        }
    });
    
    const weeklyTransactions = Object.values(weeklyMap);

    // --- E. Xử lý accountTypeDistribution ---
    const typeMap = {};
    activeBooks.forEach(book => {
        const typeName = book.typesaving?.typename || "Unknown";
        if (!typeMap[typeName]) typeMap[typeName] = 0;
        typeMap[typeName]++;
    });

    const accountTypeDistribution = Object.keys(typeMap).map(key => ({
        name: key,
        value: typeMap[key]
    }));


    // =========================================================
    // KẾT QUẢ CUỐI CÙNG
    // =========================================================
    return {
      stats: {
        activeSavingBooks: totalActiveNow,
        depositsComparePreWeek: sumDepositCur,
        withdrawalsComparePreWeek: sumWithdrawCur,
        changes: {
            activeSavingBooks: this.calculateGrowth(totalActiveNow, activePreWeek),
            currentDeposits: this.calculateGrowth(sumDepositCur, sumDepositPre),
            currentWithdrawals: this.calculateGrowth(sumWithdrawCur, sumWithdrawPre)
        }
      },
      weeklyTransactions,
      accountTypeDistribution
    };
  }
  //For api get recent transactions
  async getRecentTransactions() {
    const rawData = await Transaction.getRecentTransactions(5);

    // Map dữ liệu về đúng format API Contract yêu cầu
    const formattedData = rawData.map((item) => {
      const dateObj = new Date(item.transactiondate);
      
      // Tách Date (YYYY-MM-DD) và Time (HH:mm)
      // Lưu ý: getISOString trả về UTC, nếu cần giờ VN (GMT+7) chính xác thì nên dùng toLocaleString hoặc thư viện date-fns/moment.
      // Ở mức cơ bản, ta dùng chuỗi ISO cắt ra.
      const dateStr = dateObj.toISOString().split('T')[0];
      const timeStr = dateObj.toTimeString().split(' ')[0].slice(0, 5); // Lấy HH:mm

      return {
        id: item.transactionid,
        date: dateStr,
        time: timeStr,
        customerName: item.savingbook?.customer?.fullname || "Unknown", // Safe navigation để tránh crash nếu null
        type: item.transactiontype.toLowerCase(), // "Deposit" -> "deposit"
        amount: Number(item.amount),
        bookId: item.bookid
      };
    });

    return formattedData;
  }
}

export const dashboardService = new DashboardService();