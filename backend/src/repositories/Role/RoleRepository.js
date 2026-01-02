import { Role } from "../../models/Role.js";

export class RoleRepository {
  async findById(roleId) {
    return await Role.getById(roleId);
  }

  async findAll() {
    return await Role.getAll();
  }

  async create(roleData) {
    return await Role.create(roleData);
  }

  async update(roleId, roleData) {
    return await Role.update(roleId, roleData);
  }

  async delete(roleId) {
    return await Role.delete(roleId);
  }

  async findByName(roleName) {
    return await Role.getByName(roleName);
  }
}

export const roleRepository = new RoleRepository();
