import prisma from "../prisma/client.js";

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        clubOrFacultyName: true,
        clubOrFacultyType: true,
        createdAt: true,
      },
    });
  }

  // Find user by id
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        clubOrFacultyName: true,
        clubOrFacultyType: true,
        createdAt: true,
      },
    });
  }

  // Create new user (admin/organizer)
  static async create(userData) {
    return await prisma.user.create({
      data: userData,
    });
  }

  // Update user
  static async update(id, updateData) {
    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete user
  static async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Get all users by role
  static async findAll(filters = {}) {
    return await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clubOrFacultyName: true,
        clubOrFacultyType: true,
        createdAt: true,
      },
    });
  }

  // Check if email exists
  static async emailExists(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });
    return !!user;
  }

  // Update user role
  static async updateRole(id, role) {
    return await prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}

export default UserModel;
