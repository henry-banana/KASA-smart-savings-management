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
}

// Xuất instance sẵn
export const savingBookRepository = new SavingBookRepository();
