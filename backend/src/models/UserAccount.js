// models/UserAccount.js

// 1. Import lớp BaseModel
import { BaseModel } from "./BaseModel.js";

// 2. Tạo lớp UserAccountModel KẾ THỪA từ BaseModel
class UserAccountModel extends BaseModel {
  constructor() {

    super('useraccount', 'userid'); 
  }

}

// 5. Xuất ra một INSTANCE của lớp để sử dụng
export const UserAccount = new UserAccountModel();