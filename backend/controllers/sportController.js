import prisma from "../prisma/client.js";

class SportController {
  // Create a new sport
  static async createSport(req, res) {
    try {
      const { name, description, coachName, whatsappLink, imageUrl } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Sport name is required" });
      }

      const sport = await prisma.sport.create({
        data: { name, description, coachName, whatsappLink, imageUrl },
      });

      res.status(201).json({ success: true, sport });
    } catch (error) {
      console.error("Create sport error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }

  // Get all sports
  static async getAllSports(req, res) {
    try {
      const sports = await prisma.sport.findMany({
        orderBy: { name: "asc" },
      });
      res.json({ success: true, sports });
    } catch (error) {
      console.error("Get sports error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }

  // Update a sport
  static async updateSport(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid sport ID" });
      }

      const { name, description, coachName, whatsappLink, imageUrl } = req.body;

      // Ensure sport exists
      const existing = await prisma.sport.findUnique({ where: { id } });
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Sport not found" });
      }

      const updated = await prisma.sport.update({
        where: { id },
        data: { name, description, coachName, whatsappLink, imageUrl },
      });

      res.json({ success: true, sport: updated });
    } catch (error) {
      console.error("Update sport error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }

  // Delete a sport
  static async deleteSport(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid sport ID" });
      }

      // Ensure sport exists
      const existing = await prisma.sport.findUnique({ where: { id } });
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Sport not found" });
      }

      await prisma.sport.delete({ where: { id } });

      res.json({ success: true, message: "Sport deleted successfully" });
    } catch (error) {
      console.error("Delete sport error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default SportController;
