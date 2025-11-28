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
}

export const Transaction = new TransactionModel();
