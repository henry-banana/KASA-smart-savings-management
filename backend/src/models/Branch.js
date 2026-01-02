import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";


class BranchModel extends BaseModel {
  constructor() {
    super("branch", "branchid");
  }

  async getByName(branchName) {
    const { data, error } = await supabase
        .from("branch")
        .select("branchid, branchname")
        .eq("branchname", branchName)
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found → trả null
        throw new Error(`Get failed: ${error.message}`);
    }

    return data || null;
    }

}

export const Branch = new BranchModel();
