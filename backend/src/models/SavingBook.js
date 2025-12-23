// models/SavingBook.js
import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";

export class SavingBook extends BaseModel {
  constructor() {
    super("savingbook", "bookid");
  }

  async getAll() {
    const { data, error } = await supabase
      .from("savingbook")
      .select(
        `
        bookid,
        registertime,
        maturitydate,
        status,
        currentbalance,
        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typeid,
          typename
        )
      `
      )
      .order("bookid", { ascending: true });

    if (error) throw error;

    // Map dữ liệu về đúng format
    const result = data.map((item) => ({
      typeId: item.typesaving.typeid,
      bookId: item.bookid,
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance,
      maturityDate: item.maturitydate,
    }));

    return result;
  }

  async searchByCustomerName(name) {
    const normalized = name.toLowerCase();

    const { data, error } = await supabase
      .from("savingbook")
      .select(
        `
        bookid,
        registertime,
        maturitydate,
        status,
        currentbalance,

        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typeid,
          typename
        )
      `
      )
      .ilike("customer.fullname", `%${normalized}%`)
      .order("bookid", { ascending: true });

    if (error) throw error;

    // Map dữ liệu về đúng format bạn cần
    const result = data.map((item) => ({
      typeId: item.typesaving.typeid,
      bookId: item.bookid,
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance,
      maturityDate: item.maturitydate,
    }));

    return result;
  }

  async searchByCustomerCitizenID(citizenid) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        `
        bookid,
        registertime,
        status,
        maturitydate,
        currentbalance,
        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typename,
          typeid
        )
      `
      )
      .eq("customer.citizenid", citizenid)
      .order("bookid", { ascending: true });

    if (error) throw error;

    // Map về đúng format yêu cầu
    const result = data.map((item) => ({
      typeId: item.typesaving.typeid,
      bookId: item.bookid,
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance,
      maturityDate: item.maturitydate,
    }));

    return result;
  }

  async searchByBookID(bookid) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        `
        bookid,
        registertime,
        maturitydate,
        status,
        currentbalance,
        
        customer:customerid!inner (
          fullname,
          citizenid
        ),
        typesaving:typeid!inner (
          typename,
          typeid
        )
      `
      )
      .eq(this.primaryKey, bookid)
      .order("bookid", { ascending: true });

    if (error) throw error;

    if (!data) return null;

    // Map về đúng format yêu cầu
    const result = data.map((item) => ({
      typeId: item.typesaving.typeid,
      bookId: item.bookid,
      accountCode: item.bookid,
      citizenId: item.customer.citizenid,
      customerName: item.customer.fullname,
      accountTypeName: item.typesaving.typename,
      openDate: item.registertime.split("T")[0],
      status: item.status,
      balance: item.currentbalance,
      maturityDate: item.maturitydate,
    }));

    return result;
  }
  //Lấy toàn bộ sổ có Status = 'Open' (đang mở)
  async getAllActiveBooks() {
    const { data, error } = await supabase
      .from("savingbook")
      .select(
        `
        bookid,
        registertime,
        status,
        typesaving:typeid (
          typeid,
          typename
        )
      `
      )
      .eq("status", "Open"); // Chỉ lấy sổ đang mở

    if (error) throw new Error(`GetAllActiveBooks failed: ${error.message}`);
    return data || [];
  }
}

export const SavingBookModel = new SavingBook();
