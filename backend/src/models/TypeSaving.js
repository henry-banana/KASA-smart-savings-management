import { BaseModel } from "./BaseModel.js";

export class TypeSavingModel extends BaseModel {
  constructor() {

    super("typesaving", "typeid");
  }
}

export const TypeSaving = new TypeSavingModel();
