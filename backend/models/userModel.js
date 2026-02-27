import prisma from '../config/prisma.js';

class UserModel {
    // Find user by email
    static async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    // Find user by id
    static async findById(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    // Create new user (admin/organizer)
    static async create(userData) {
        return await prisma.user.create({
            data: userData
        });
    }

    // Update user
    static async update(id, updateData) {
        return await prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    // Delete user
    static async delete(id) {
        return await prisma.user.delete({
            where: { id }
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
                createdAt: true
            }
        });
    }

    // Check if email exists
    static async emailExists(email) {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return !!user;
    }
}

export default UserModel;
