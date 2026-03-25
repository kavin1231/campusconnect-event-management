import prisma from "../prisma/client.js";

class LogisticsController {
  // assets
  static async listAssets(req, res) {
    try {
      const assets = await prisma.asset.findMany({
        include: { owner: { select: { id: true, name: true, email: true } } },
      });
      res.json({ success: true, assets });
    } catch (err) {
      console.error("List assets error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async createAsset(req, res) {
    try {
      const ownerId = req.user.id;
      const { name, description } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });
      }
      const asset = await prisma.asset.create({
        data: { name, description, ownerId },
      });
      res.json({ success: true, asset });
    } catch (err) {
      console.error("Create asset error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async getAsset(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid asset id" });
      }
      const asset = await prisma.asset.findUnique({
        where: { id },
        include: { owner: { select: { id: true, name: true } } },
      });
      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }
      res.json({ success: true, asset });
    } catch (err) {
      console.error("Get asset error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  // requests/bookings
  static async requestAsset(req, res) {
    try {
      const requesterId = req.user.id;
      const assetId = parseInt(req.params.id);
      const { startDate, endDate } = req.body;

      if (isNaN(assetId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid asset id" });
      }
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ success: false, message: "Start and end dates required" });
      }
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      if (ed < sd) {
        return res
          .status(400)
          .json({
            success: false,
            message: "End date must be after start date",
          });
      }

      const asset = await prisma.asset.findUnique({ where: { id: assetId } });
      if (!asset) {
        return res
          .status(404)
          .json({ success: false, message: "Asset not found" });
      }

      // availability check - no overlapping approved or checked-out
      const overlap = await prisma.assetBooking.findFirst({
        where: {
          assetId,
          status: { in: ["APPROVED", "CHECKED_OUT"] },
          AND: [{ startDate: { lte: ed } }, { endDate: { gte: sd } }],
        },
      });
      if (overlap) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Asset not available for the requested period",
          });
      }

      const booking = await prisma.assetBooking.create({
        data: { assetId, requesterId, startDate: sd, endDate: ed },
      });

      res.json({ success: true, booking });
    } catch (err) {
      console.error("Request asset error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async listRequests(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      let where = {};
      if (role === "SYSTEM_ADMIN" || role === "CLUB_PRESIDENT") {
        // owner can see bookings for their assets
        where = { asset: { ownerId: userId } };

      } else {
        // regular user sees only their own requests
        where = { requesterId: userId };
      }
      const bookings = await prisma.assetBooking.findMany({
        where,
        include: {
          asset: true,
          requester: { select: { id: true, name: true } },
          approvedBy: { select: { id: true, name: true } },
        },
      });
      res.json({ success: true, bookings });
    } catch (err) {
      console.error("List requests error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async approveRequest(req, res) {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request id" });
      }
      const booking = await prisma.assetBooking.findUnique({
        where: { id },
        include: { asset: true },
      });
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }
      if (booking.asset.ownerId !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Not authorized to approve this booking",
          });
      }
      if (booking.status !== "PENDING") {
        return res
          .status(400)
          .json({ success: false, message: "Booking is not pending" });
      }
      // check availability again
      const overlap = await prisma.assetBooking.findFirst({
        where: {
          assetId: booking.assetId,
          id: { not: id },
          status: { in: ["APPROVED", "CHECKED_OUT"] },
          AND: [
            { startDate: { lte: booking.endDate } },
            { endDate: { gte: booking.startDate } },
          ],
        },
      });
      if (overlap) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Asset is no longer available for this period",
          });
      }
      const updated = await prisma.assetBooking.update({
        where: { id },
        data: { status: "APPROVED", approvedById: userId },
      });
      res.json({ success: true, booking: updated });
    } catch (err) {
      console.error("Approve booking error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async rejectRequest(req, res) {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request id" });
      }
      const booking = await prisma.assetBooking.findUnique({
        where: { id },
        include: { asset: true },
      });
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }
      if (booking.asset.ownerId !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Not authorized to reject this booking",
          });
      }
      if (booking.status !== "PENDING") {
        return res
          .status(400)
          .json({ success: false, message: "Booking is not pending" });
      }
      const updated = await prisma.assetBooking.update({
        where: { id },
        data: { status: "REJECTED", approvedById: userId },
      });
      res.json({ success: true, booking: updated });
    } catch (err) {
      console.error("Reject booking error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async checkOutAsset(req, res) {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request id" });
      }
      const booking = await prisma.assetBooking.findUnique({
        where: { id },
        include: { asset: true },
      });
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }
      if (booking.asset.ownerId !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Not authorized to checkout this asset",
          });
      }
      if (booking.status !== "APPROVED") {
        return res
          .status(400)
          .json({ success: false, message: "Booking must be approved first" });
      }
      const updated = await prisma.assetBooking.update({
        where: { id },
        data: { status: "CHECKED_OUT" },
      });
      res.json({ success: true, booking: updated });
    } catch (err) {
      console.error("Checkout error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async returnAsset(req, res) {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request id" });
      }
      const booking = await prisma.assetBooking.findUnique({
        where: { id },
        include: { asset: true },
      });
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }
      if (booking.asset.ownerId !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized to mark return" });
      }
      if (booking.status !== "CHECKED_OUT") {
        return res
          .status(400)
          .json({ success: false, message: "Asset is not checked out" });
      }
      const updated = await prisma.assetBooking.update({
        where: { id },
        data: { status: "RETURNED" },
      });
      res.json({ success: true, booking: updated });
    } catch (err) {
      console.error("Return error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async reportDamage(req, res) {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const { damageReport, penalty } = req.body;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request id" });
      }
      const booking = await prisma.assetBooking.findUnique({
        where: { id },
        include: { asset: true },
      });
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }
      if (booking.asset.ownerId !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized to report damage" });
      }
      const updated = await prisma.assetBooking.update({
        where: { id },
        data: { status: "DAMAGED", damageReport, penalty },
      });
      res.json({ success: true, booking: updated });
    } catch (err) {
      console.error("Damage report error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }
}

export default LogisticsController;
