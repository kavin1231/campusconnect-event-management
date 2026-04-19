import prisma from "../prisma/client.js";

const buildFallbackEmail = (name, stallId) => {
  const slug = String(name || "vendor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return `${slug || "vendor"}-${String(stallId)}-${Date.now()}@vendor.local`;
};

class VendorController {
  static async createVendor(req, res) {
    try {
      const { name, phone, contactNumber, email, stallId, eventName, fee, profit } = req.body;
      const normalizedPhone = phone || contactNumber;

      if (!name || !normalizedPhone || stallId === undefined || fee === undefined) {
        return res.status(400).json({
          success: false,
          message: "Required fields: name, phone/contactNumber, stallId, fee",
        });
      }

      const parsedFee = Number(fee);
      const parsedProfit = profit === undefined ? 0 : Number(profit);
      const normalizedStallId = String(stallId).trim();
      const normalizedEmail =
        email && String(email).trim()
          ? String(email).trim().toLowerCase()
          : buildFallbackEmail(name, normalizedStallId);

      if (Number.isNaN(parsedFee) || Number.isNaN(parsedProfit)) {
        return res.status(400).json({
          success: false,
          message: "fee and profit must be valid numbers",
        });
      }

      const vendor = await prisma.vendor.create({
        data: {
          name,
          phone: String(normalizedPhone).trim(),
          email: normalizedEmail,
          stallId: normalizedStallId,
          eventName: eventName ? String(eventName).trim() : null,
          fee: parsedFee,
          profit: parsedProfit,
        },
      });

      return res.status(201).json({ success: true, vendor });
    } catch (err) {
      console.error("Create vendor error:", err);

      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Vendor with same email or stallId already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async listVendors(req, res) {
    try {
      const vendors = await prisma.vendor.findMany({
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, vendors });
    } catch (err) {
      console.error("List vendors error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async getVendorById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid vendor id" });
      }

      const vendor = await prisma.vendor.findUnique({ where: { id } });

      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      return res.json({ success: true, vendor });
    } catch (err) {
      console.error("Get vendor error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async updateVendor(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid vendor id" });
      }

      const { name, phone, contactNumber, email, stallId, eventName, fee, profit } = req.body;
      const data = {};

      if (name !== undefined) data.name = name;
      if (phone !== undefined || contactNumber !== undefined) {
        data.phone = String(phone || contactNumber).trim();
      }
      if (email !== undefined) data.email = email;
      if (stallId !== undefined) data.stallId = String(stallId).trim();
      if (eventName !== undefined) data.eventName = eventName ? String(eventName).trim() : null;

      if (fee !== undefined) {
        const parsedFee = Number(fee);
        if (Number.isNaN(parsedFee)) {
          return res.status(400).json({
            success: false,
            message: "fee must be a valid number",
          });
        }
        data.fee = parsedFee;
      }

      if (profit !== undefined) {
        const parsedProfit = Number(profit);
        if (Number.isNaN(parsedProfit)) {
          return res.status(400).json({
            success: false,
            message: "profit must be a valid number",
          });
        }
        data.profit = parsedProfit;
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields provided for update",
        });
      }

      const existing = await prisma.vendor.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      const vendor = await prisma.vendor.update({
        where: { id },
        data,
      });

      return res.json({ success: true, vendor });
    } catch (err) {
      console.error("Update vendor error:", err);

      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Vendor with same email or stallId already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async deleteVendor(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid vendor id" });
      }

      const existing = await prisma.vendor.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      await prisma.vendor.delete({ where: { id } });

      return res.json({ success: true, message: "Vendor deleted successfully" });
    } catch (err) {
      console.error("Delete vendor error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
}

export default VendorController;
