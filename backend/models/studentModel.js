import prisma from '../config/prisma.js';

class StudentModel {
  // Find student by email
  static async findByEmail(email) {
    return await prisma.student.findUnique({
      where: { email }
    });
  }

  // Find student by studentId
  static async findByStudentId(studentId) {
    return await prisma.student.findUnique({
      where: { studentId }
    });
  }

  // Find student by id
  static async findById(id) {
    return await prisma.student.findUnique({
      where: { id }
    });
  }

  // Create new student
  static async create(studentData) {
    return await prisma.student.create({
      data: studentData
    });
  }

  // Update student
  static async update(id, updateData) {
    return await prisma.student.update({
      where: { id },
      data: updateData
    });
  }

  // Delete student
  static async delete(id) {
    return await prisma.student.delete({
      where: { id }
    });
  }

  // Get all students
  static async findAll(filters = {}) {
    return await prisma.student.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        department: true,
        year: true,
        createdAt: true
      }
    });
  }

  // Check if email exists
  static async emailExists(email) {
    const student = await prisma.student.findUnique({
      where: { email }
    });
    return !!student;
  }

  // Check if studentId exists
  static async studentIdExists(studentId) {
    const student = await prisma.student.findUnique({
      where: { studentId }
    });
    return !!student;
  }
}

export default StudentModel;
