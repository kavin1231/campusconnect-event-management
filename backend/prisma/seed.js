import prisma from "./client.js";
import bcrypt from "bcryptjs";
import { getStallCoordinate } from "../utils/stallCoordinates.js";

async function main() {
  console.log("Start seeding...");

  try {
    const saltRounds = 10;

    // 1. Seed System Admin
    const adminEmail = "admin@nexora.edu";
    const adminPassword = await bcrypt.hash("admin123", saltRounds);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: adminPassword },
      create: {
        email: adminEmail,
        name: "NEXORA Admin",
        password: adminPassword,
        role: "SYSTEM_ADMIN",
      },
    });
    console.log(`System Admin created with email: ${admin.email}`);

    console.log(`System Admin created with email: ${admin.email}`);

    // 3. Seed Event Organizer
    const organizerEmail = "organizer@nexora.edu";
    const organizerPassword = await bcrypt.hash("admin123", saltRounds);

    const organizer = await prisma.user.upsert({
      where: { email: organizerEmail },
      update: { password: organizerPassword },
      create: {
        email: organizerEmail,
        name: "Main Event Organizer",
        password: organizerPassword,
        role: "EVENT_ORGANIZER",
      },
    });
    console.log(`Event Organizer created with email: ${organizer.email}`);

    // 4. Seed Club President
    const presidentEmail = "president@nexora.edu";
    const presidentPassword = await bcrypt.hash("admin123", saltRounds);

    const president = await prisma.user.upsert({
      where: { email: presidentEmail },
      update: { password: presidentPassword },
      create: {
        email: presidentEmail,
        name: "Club President",
        password: presidentPassword,
        role: "CLUB_PRESIDENT",
      },
    });
    console.log(`Club President created with email: ${president.email}`);

    // 5. Seed Default Student
    const studentEmail = "student@nexora.edu";
    const studentPassword = await bcrypt.hash("admin123", saltRounds);

    const student = await prisma.student.upsert({
      where: { email: studentEmail },
      update: { password: studentPassword },
      create: {
        email: studentEmail,
        name: "Default Student",
        password: studentPassword,
        studentId: "ST12345",
        department: "Software Engineering",
        year: 2,
      },
    });
    console.log(`Default Student created with email: ${student.email}`);

    // 6. Seed Basic Study Materials
    const material1 = await prisma.studyMaterial.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: "Introduction to Software Engineering - Semester 1",
        description: "Comprehensive guide for first-year SE students.",
        semester: "Y1S1",
        materialType: "pdf",
        contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        createdBy: admin.id,
      },
    });

    const material2 = await prisma.studyMaterial.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        title: "Advanced Database Systems Note",
        description: "Notes on SQL optimization and NoSQL databases.",
        semester: "Y3S1",
        materialType: "pdf",
        contentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        createdBy: admin.id,
      },
    });

    // 7. Seed Study Sessions
    const session1 = await prisma.studySession.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: "SQL Revision Workshop",
        description: "Live coding session to cover complex joins and subqueries.",
        semester: "Y2S1",
        sessionDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        sessionLink: "https://zoom.us/test",
        createdBy: admin.id,
      },
    });

    // 8. Seed Sports Clubs
    const sport1 = await prisma.sport.upsert({
      where: { name: "NEXORA Cricket Club" },
      update: {},
      create: {
        name: "NEXORA Cricket Club",
        description: "Official university cricket team. Practice matches on weekends.",
        coachName: "Coach Michael",
        whatsappLink: "https://chat.whatsapp.com/test",
      },
    });

    const sport2 = await prisma.sport.upsert({
      where: { name: "Campus Badminton Hub" },
      update: {},
      create: {
        name: "Campus Badminton Hub",
        description: "Intermediate and beginner friendly badminton sessions.",
        coachName: "Coach Sarah",
        whatsappLink: "https://chat.whatsapp.com/test",
      },
    });

    // 9. Seed Social Group Links
    const link1 = await prisma.groupLink.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "SE Department Official Group",
        platform: "WhatsApp",
        url: "https://chat.whatsapp.com/test",
        category: "Department",
      },
    });

    const link2 = await prisma.groupLink.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: "NEXORA Gaming Community",
        platform: "Discord",
        url: "https://discord.gg/test",
        category: "Entertainment",
      },
    });

    // 10. Seed 1 Upcoming Event (for filter verification)
    await prisma.event.upsert({
      where: { id: 101 },
      update: {
        image: "https://picsum.photos/seed/welcome2026/800/600",
      },
      create: {
        id: 101,
        title: "Welcome Week 2026",
        description: "Main campus welcome event for all students.",
        date: new Date(Date.now() + 86400000 * 7), // 7 days from now
        category: "Entertainment",
        location: "Main Auditorium",
        image: "https://picsum.photos/seed/welcome2026/800/600",
        status: "PUBLISHED",
      },
    });

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
