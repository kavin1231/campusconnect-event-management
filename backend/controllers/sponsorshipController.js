import prisma from "../prisma/client.js";

class SponsorshipController {
  static async createSponsorship(req, res) {
    try {
      const { name, amount, eventName, contact, date, remark } = req.body;

      if (!name || amount === undefined || !eventName || !contact || !date) {
        return res.status(400).json({
          success: false,
          message: "Required fields: name, amount, eventName, contact, date",
        });
      }

      const parsedAmount = Number(amount);
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "amount must be a positive number",
        });
      }

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "date must be a valid date",
        });
      }

      const sponsorship = await prisma.sponsorship.create({
        data: {
          name: String(name).trim(),
          amount: parsedAmount,
          eventName: String(eventName).trim(),
          contact: String(contact).trim(),
          date: parsedDate,
          remark: remark ? String(remark).trim() : null,
        },
      });

      return res.status(201).json({ success: true, sponsorship });
    } catch (err) {
      console.error("Create sponsorship error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async listSponsorships(req, res) {
    try {
      const sponsorships = await prisma.sponsorship.findMany({
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, sponsorships });
    } catch (err) {
      console.error("List sponsorships error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async getSponsorshipById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship id" });
      }

      const sponsorship = await prisma.sponsorship.findUnique({ where: { id } });

      if (!sponsorship) {
        return res.status(404).json({ success: false, message: "Sponsorship not found" });
      }

      return res.json({ success: true, sponsorship });
    } catch (err) {
      console.error("Get sponsorship error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async updateSponsorship(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship id" });
      }

      const { name, amount, eventName, contact, date, remark } = req.body;
      const data = {};

      if (name !== undefined) {
        if (!String(name).trim()) {
          return res.status(400).json({ success: false, message: "name cannot be empty" });
        }
        data.name = String(name).trim();
      }

      if (amount !== undefined) {
        const parsedAmount = Number(amount);
        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
          return res.status(400).json({
            success: false,
            message: "amount must be a positive number",
          });
        }
        data.amount = parsedAmount;
      }

      if (eventName !== undefined) {
        if (!String(eventName).trim()) {
          return res.status(400).json({ success: false, message: "eventName cannot be empty" });
        }
        data.eventName = String(eventName).trim();
      }

      if (contact !== undefined) {
        if (!String(contact).trim()) {
          return res.status(400).json({ success: false, message: "contact cannot be empty" });
        }
        data.contact = String(contact).trim();
      }

      if (date !== undefined) {
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({ success: false, message: "date must be a valid date" });
        }
        data.date = parsedDate;
      }

      if (remark !== undefined) {
        data.remark = remark ? String(remark).trim() : null;
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "No fields provided for update" });
      }

      const existing = await prisma.sponsorship.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Sponsorship not found" });
      }

      const sponsorship = await prisma.sponsorship.update({
        where: { id },
        data,
      });

      return res.json({ success: true, sponsorship });
    } catch (err) {
      console.error("Update sponsorship error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async deleteSponsorship(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid sponsorship id" });
      }

      const existing = await prisma.sponsorship.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Sponsorship not found" });
      }

      await prisma.sponsorship.delete({ where: { id } });

      return res.json({ success: true, message: "Sponsorship deleted successfully" });
    } catch (err) {
      console.error("Delete sponsorship error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
}

export default SponsorshipController;
