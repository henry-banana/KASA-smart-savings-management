import { SavingBookModel } from "../../models/SavingBook.js"; // đảm bảo export instance

export class SavingBookRepository {
  async findById(bookid) {
    return await SavingBookModel.getById(bookid);
  }

  async findAll() {
    return await SavingBookModel.getAll();
  }

  async create(userData) {
    return await SavingBookModel.create(userData); 
  }

  async update(bookid, userData) {
    return await SavingBookModel.update(bookid, userData);
  }

  async delete(bookid) {
    return await SavingBookModel.delete(bookid);
  }

  
  async findByCustomerName(keyword) {
    return await SavingBookModel.searchByCustomerName(keyword);
  }

  async findByCustomerCitizenID(keyword){
    return await SavingBookModel.searchByCustomerCitizenID(keyword);
  }

  async findByBookID(keyword){
    return await SavingBookModel.searchByBookID(keyword);
  }

}

// Xuất instance sẵn
export const savingBookRepository = new SavingBookRepository();
