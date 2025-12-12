import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";

class TransactionModel extends BaseModel {
  constructor() {
    super("transaction", "transactionid");
  }

  async getAll(filters = {}) {
    const { data, error } = await supabase.from("transaction").select(`
        transactionid,
        bookid,
        transactiontype,
        amount,
        transactiondate,
        tellerid,
        
        savingbook:bookid (
          bookid,
          customerid,
          typeid,
          customer:customerid (
            customerid,
            fullname,
            citizenid
          ),
          typesaving:typeid (
            typeid,
            typename,
            interest
          )
        ),

        useraccount:tellerid (
          userid,
          employee:employee!useraccount_userid_fkey (
            employeeid,
            fullname,
            roleid
          )
        )
      `);

    if (error)
      throw new Error(`GetAll failed in transaction: ${error.message}`);

    return data;
  }

  async getTransactionsByDate(date) {
    if (!date) throw new Error("Missing date parameter");

    const { data, error } = await supabase
      .from("transaction")
      .select(
        `
        transactionid,
        bookid,
        transactiontype,
        amount,
        transactiondate,
        tellerid,
        savingbook:bookid (
          typeid,
          typesaving:typeid (
            typeid,
            typename
          )
        )
      `
      )
      .gte("transactiondate", `${date}T00:00:00`)
      .lt("transactiondate", `${date}T23:59:59`);



    if (error)
      throw new Error(`GetTransactionsByDate failed: ${error.message}`);

    return data || [];
  }
  /**
   * Lấy giao dịch trong khoảng thời gian (kèm thông tin loại sổ)
   * Để phục vụ tính toán Dashboard
   */
  async getTransactionsByDateRange(startDate, endDate) {
    // startDate, endDate format: YYYY-MM-DD
    const { data, error } = await supabase
      .from("transaction")
      .select(`
        transactionid,
        amount,
        transactiontype,
        transactiondate,
        savingbook:bookid (
           typeid
        )
      `)
      .gte("transactiondate", `${startDate}T00:00:00`)
      .lte("transactiondate", `${endDate}T23:59:59`)
      .order("transactiondate", { ascending: true }); // Sắp xếp để dễ xử lý biểu đồ

    if (error) throw new Error(`GetTransactionsByDateRange failed: ${error.message}`);
    return data || [];
  }
  /**
   * Lấy danh sách giao dịch gần đây (kèm thông tin khách hàng)
   * Limit mặc định là 5
   */
  async getRecentTransactions(limit = 5) {
    const { data, error } = await supabase
      .from("transaction")
      .select(`
        transactionid,
        transactiondate,
        transactiontype,
        amount,
        bookid,
        savingbook:bookid (
          bookid,
          customer:customerid (
            fullname
          )
        )
      `)
      .order("transactiondate", { ascending: false })
      .limit(limit);

    if (error) throw new Error(`GetRecentTransactions failed: ${error.message}`);
    return data || [];
  }
}

export const Transaction = new TransactionModel();
