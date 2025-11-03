import { UserAccountModel } from "../../models/UserAccount.js"; // đảm bảo export instance

export class UserAccountRepository {
  async findById(userid) {
    return await UserAccountModel.getById(userid);
  }

  async findAll() {
    return await UserAccountModel.getAll();
  }

  async create(userData) {
    return await UserAccountModel.create(userData); // dùng create thay vì insert
  }

  async update(userid, userData) {
    return await UserAccountModel.update(userid, userData);
  }

  async delete(userid) {
    return await UserAccountModel.delete(userid);
  }
}

// Xuất instance sẵn
export const userAccountRepository = new UserAccountRepository();
