import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";


class RoleModel extends BaseModel {
  constructor() {
    super("role", "roleid");
  }

  async getByName(roleName) {
    const { data, error } = await supabase
        .from("role")
        .select("roleid, rolename")
        .eq("rolename", roleName)
        .limit(1);

    if (error) {
        throw new Error(`Get failed: ${error.message}`);
    }

    return data && data.length > 0 ? data[0] : null;
    }

}

export const Role = new RoleModel();
