import prisma from "../prisma/client.js";

class GroupLinkController {
  // Create a new group link
  static async createLink(req, res) {
    try {
      const { name, platform, url, category } = req.body;
      if (!name || !platform || !url) {
        return res
          .status(400)
          .json({ success: false, message: "Name, platform, and URL are required" });
      }

      const link = await prisma.groupLink.create({
        data: { name, platform, url, category: category || "General" },
      });

      res.status(201).json({ success: true, link });
    } catch (error) {
      console.error("Create group link error:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  // Get all group links
  static async getAllLinks(req, res) {
    try {
      const links = await prisma.groupLink.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, links });
    } catch (error) {
      console.error("Get group links error:", error);
      // If error is specifically about missing table, don't 500
      if (error.message && (error.message.includes("does not exist") || error.message.includes("relation"))) {
        return res.json({ success: true, links: [], message: "Extracurricular table not synced yet" });
      }
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  // Update a group link
  static async updateLink(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid link ID" });
      }

      const { name, platform, url, category } = req.body;

      const existing = await prisma.groupLink.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Link not found" });
      }

      const updated = await prisma.groupLink.update({
        where: { id },
        data: { name, platform, url, category },
      });

      res.json({ success: true, link: updated });
    } catch (error) {
      console.error("Update group link error:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  // Delete a group link
  static async deleteLink(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid link ID" });
      }

      const existing = await prisma.groupLink.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Link not found" });
      }

      await prisma.groupLink.delete({ where: { id } });

      res.json({ success: true, message: "Link deleted successfully" });
    } catch (error) {
      console.error("Delete group link error:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default GroupLinkController;
