import prisma from "./client.js";
import bcrypt from "bcryptjs";

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

    // 4. Seed Sample Events
    const sampleEvents = [
      {
        title: "AI & Robotics Workshop",
        description:
          "Hands-on session exploring the future of artificial intelligence and autonomous robotics. Perfect for beginners and enthusiasts!",
        date: new Date("2026-03-28T10:00:00Z"),
        category: "TECH",
        location: "Engineering Block, Hall A",
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        registeredCount: 124,
      },
      {
        title: "Intra-University Sprint Meet",
        description:
          "The annual track and field competition. Come witness the fastest sprinters on campus battle for the gold medal.",
        date: new Date("2026-04-02T09:00:00Z"),
        category: "SPORTS",
        location: "Main Sports Complex",
        image:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
        registeredCount: 350,
      },
      {
        title: "Midnight Canvas: Live Painting",
        description:
          "A serene night of art and creativity. Students from all departments are invited to paint live under the stars.",
        date: new Date("2026-04-10T19:00:00Z"),
        category: "ARTS",
        location: "Central Plaza Garden",
        image:
          "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
        registeredCount: 42,
      },
      {
        title: "Battle of the Bands: Auditions",
        description:
          "The music club is looking for the best talent on campus. Auditions for the upcoming annual music festival.",
        date: new Date("2026-04-15T15:00:00Z"),
        category: "MUSIC",
        location: "Auditorium 2",
        image:
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
        registeredCount: 15,
      },
      {
        title: "International Relations Mock UN",
        description:
          "Debate world issues and represent different nations in this immersive Model United Nations simulation.",
        date: new Date("2026-04-20T08:00:00Z"),
        category: "DEBATE",
        location: "Humanities Seminar Room",
        image:
          "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80&w=800",
        registeredCount: 88,
      },
      {
        title: "24h Hackathon: Build for Campus",
        description:
          "Team up and build solutions that make university life easier. Food, caffeine, and coding - all provided!",
        date: new Date("2026-04-25T09:00:00Z"),
        category: "TECH",
        location: "CS Innovation Lab",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
        registeredCount: 200,
      },
    ];

    console.log("Seeding sample events...");
    for (const event of sampleEvents) {
      await prisma.event.upsert({
        where: { id: sampleEvents.indexOf(event) + 1 }, // Using index as ID for simplicity in seed
        update: event,
        create: event,
      });
    }
    console.log("Finished seeding sample events.");

    // Seed Assets (20 items with images)
    console.log("Seeding logistics assets...");
    const assetsToSeed = [
      {
        name: "Projector (Sony Bravia)",
        description:
          "High brightness Sony projector, 5000 lumens, Perfect for large events and presentations",
        imageUrl:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400",
        quantity: 3,
      },
      {
        name: "Speaker System (JBL)",
        description:
          "Professional JBL audio system with subwoofer, 2000W peak power",
        imageUrl:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400",
        quantity: 4,
      },
      {
        name: "Canon EOS 5D Mark IV Camera",
        description:
          "Professional DSLR camera with full frame sensor, suitable for events and photography",
        imageUrl:
          "https://images.unsplash.com/photo-1606986628025-35d57e735ae0?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Video Camera (DJI Osmo)",
        description:
          "4K video camera with gimbal stabilization for smooth video production",
        imageUrl:
          "https://images.unsplash.com/photo-1604081563030-84fd87a13deb?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Professional Microphone Set",
        description:
          "Wireless microphone system with 5 units, suitable for presentations and events",
        imageUrl:
          "https://images.unsplash.com/photo-1590119957829-11a3a2e30f0d?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "LED Lighting Setup",
        description:
          "Professional RGB LED light panels, dimmable and color-controllable",
        imageUrl:
          "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?auto=format&fit=crop&q=80&w=400",
        quantity: 6,
      },
      {
        name: "Tripod Stand (Heavy Duty)",
        description:
          "Professional camera tripod with ball head, supports up to 10kg",
        imageUrl:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=400",
        quantity: 5,
      },
      {
        name: "DJ Console & Mixer",
        description:
          "Pioneer DJ mixer with 4 decks, suited for events and parties",
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Laptop (MacBook Pro)",
        description:
          "High-performance laptop with M1 Pro chip for video editing and design",
        imageUrl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
        quantity: 3,
      },
      {
        name: "Projector Screen (120 inch)",
        description:
          "Motorized projection screen with 16:9 aspect ratio, portable frame",
        imageUrl:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Portable Generator (2000W)",
        description: "Diesel generator for outdoor events, low noise operation",
        imageUrl:
          "https://images.unsplash.com/photo-1621524521221-cb9b7a7e9e8f?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
      },
      {
        name: "Canopy Tent Set (20x20)",
        description:
          "Pop-up canopy rental for outdoor events, waterproof material",
        imageUrl:
          "https://images.unsplash.com/photo-1519167758993-41ef2167078a?auto=format&fit=crop&q=80&w=400",
        quantity: 3,
      },
      {
        name: "Professional Mixing Board",
        description:
          "Audio mixing console with 32 channels, suitable for large events",
        imageUrl:
          "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
      },
      {
        name: "Fog Machine (1200W)",
        description:
          "Professional fog/haze machine for stage effects and events",
        imageUrl:
          "https://images.unsplash.com/photo-1514613535308-eb5405ed5c41?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Portable Dance Floor",
        description: "Modular LED-lit dance floor, 16x16 feet total area",
        imageUrl:
          "https://images.unsplash.com/photo-1519183233228-b10512dcd4b5?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
      },
      {
        name: "Wireless Charger Station",
        description:
          "Multi-device wireless charging station for events, charges 8 devices",
        imageUrl:
          "https://images.unsplash.com/photo-1591695821749-2eff4e0e9e4b?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Laser Light Show System",
        description:
          "Professional ILDA laser projector with 6 color options, 20W power",
        imageUrl:
          "https://images.unsplash.com/photo-1478720568477-152d9e3287d3?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
      },
      {
        name: "Green Screen (2.4x2.4m)",
        description:
          "Professional chroma key green screen with stand for video production",
        imageUrl:
          "https://images.unsplash.com/photo-1522869635100-ce306400045?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
      },
      {
        name: "Professional Photography Backdrop",
        description: "Retractable background for photography studios, 3m wide",
        imageUrl:
          "https://images.unsplash.com/photo-1511739001486-6bfe966ce51b?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
      {
        name: "Sound System (Bose)",
        description:
          "Bose professional sound system with clear audio output and wireless connectivity",
        imageUrl:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400",
        quantity: 2,
      },
    ];

    for (const asset of assetsToSeed) {
      await prisma.asset.upsert({
        where: { id: assetsToSeed.indexOf(asset) + 1 },
        update: asset,
        create: {
          ...asset,
          ownerId: admin.id,
          status: "AVAILABLE",
        },
      });
    }
    console.log("Finished seeding 20 logistics assets.");

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
