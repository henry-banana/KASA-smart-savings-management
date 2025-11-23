import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";

class CustomerModel extends BaseModel {
  constructor() {
    super("customer", "customerid");
    this.citizenColumn = "citizenid";
  }

  async getByCitizenID(citizenID){
    const { data, error } = await supabase
          .from(this.tableName)
          .select("*")
          .eq(this.citizenColumn, citizenID)
          .single();
    
        if (error && error.code !== "PGRST116") throw new Error(`Get failed: ${error.message}`);
        return data || null;
  }
}

export const Customer = new CustomerModel();
