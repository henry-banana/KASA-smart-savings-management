// models/SavingBook.js
import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";

export class SavingBook extends BaseModel {
  constructor() {
    super("savingbook", "bookid");
  }

  async searchByCustomerName(name) {
    const normalized = name.toLowerCase();

    const { data, error } = await supabase
      .from("savingbook")
      .select(`
        bookid,
        registertime,
        status,
        currentbalance,
        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typename
        )
      `)
      .ilike("customer.fullname", `%${normalized}%`);

    if (error) throw error;

    // Map dữ liệu về đúng format bạn cần
    const result = data.map(item => ({
      bookId: item.bookid,                    
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance,
    }));

    return result;
  }


  async searchByCustomerCitizenID(citizenid) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        bookid,
        registertime,
        status,
        currentbalance,
        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typename
        )
      `)
      .eq("customer.citizenid", citizenid);

    if (error) throw error;

    // Map về đúng format yêu cầu
    const result = data.map(item => ({
      bookId: item.bookid,
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance
    }));

    return result;
  }

  async searchByBookID(bookid) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        bookid,
        registertime,
        status,
        currentbalance,
        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typename
        )
      `)
      .eq(this.primaryKey, bookid)    
      

    if (error) throw error;

    if (!data) return null;

     // Map về đúng format yêu cầu
    const result = data.map(item => ({
      bookId: item.bookid,
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance
    }));

    return result;
  }


}

export const SavingBookModel = new SavingBook();
