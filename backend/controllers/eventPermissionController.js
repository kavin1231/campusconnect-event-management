import prisma from "../prisma/client.js";

class EventPermissionController {
  // CLUB_PRESIDENT or EVENT_ORGANIZER submits a new event permission request
  static async submit(req, res) {
    try {
      const requesterId = req.user.id;
      const {
        title,
        description,
        eventDate,
        venue,
        expectedAttendees,
        budget,
        category,
        organizingClub,
        contactEmail,
      } = req.body;

      if (
        !title ||
        !description ||
        !eventDate ||
        !venue ||
        !expectedAttendees ||
        !budget ||
        !category ||
        !organizingClub ||
        !contactEmail
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const parsedDate = new Date(eventDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid event date.",
        });
      }

      if (parsedDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Event date must be in the future.",
        });
      }

      const attendees = parseInt(expectedAttendees, 10);
      if (isNaN(attendees) || attendees <= 0) {
        return res.status(400).json({
          success: false,
          message: "Expected attendees must be a positive number.",
        });
      }

      const budgetAmount = parseFloat(budget);
      if (isNaN(budgetAmount) || budgetAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Budget must be a non-negative number.",
        });
      }

      const request = await prisma.eventPermissionRequest.create({
        data: {
          title,
          description,
          eventDate: parsedDate,
          venue,
          expectedAttendees: attendees,
          budget: budgetAmount,
          category,
          organizingClub,
          contactEmail,
          requesterId,
        },
        include: {
          requester: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      res.status(201).json({ success: true, request });
    } catch (err) {
      console.error("Event permission submit error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  // SYSTEM_ADMIN or EVENT_ORGANIZER lists all event permission requests (optionally filter by status)
  static async list(req, res) {
    try {
      const { status } = req.query;
      const where = status ? { status } : {};

      const requests = await prisma.eventPermissionRequest.findMany({
        where,
        include: {
          requester: { select: { id: true, name: true, email: true, role: true } },
          reviewedBy: { select: { id: true, name: true } },
        },
        orderBy: { submittedAt: "desc" },
      });

      res.json({ success: true, requests });
    } catch (err) {
      console.error("Event permission list error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  // CLUB_PRESIDENT or EVENT_ORGANIZER views their own requests
  static async listMy(req, res) {
    try {
      const requesterId = req.user.id;
      const { status } = req.query;
      const where = status ? { requesterId, status } : { requesterId };

      const requests = await prisma.eventPermissionRequest.findMany({
        where,
        include: {
          reviewedBy: { select: { id: true, name: true } },
        },
        orderBy: { submittedAt: "desc" },
      });

      res.json({ success: true, requests });
    } catch (err) {
      console.error("Event permission listMy error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  // SYSTEM_ADMIN approves an event permission request
  static async approve(req, res) {
    try {
      const reviewerId = req.user.id;
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid request id." });
      }

      const request = await prisma.eventPermissionRequest.findUnique({ where: { id } });
      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found." });
      }
      if (request.status !== "PENDING") {
        return res.status(400).json({ success: false, message: "Request is not pending." });
      }

      const updated = await prisma.eventPermissionRequest.update({
        where: { id },
        data: { status: "APPROVED", reviewedById: reviewerId },
        include: {
          requester: { select: { id: true, name: true, email: true } },
          reviewedBy: { select: { id: true, name: true } },
        },
      });

      res.json({ success: true, request: updated });
    } catch (err) {
      console.error("Event permission approve error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  // SYSTEM_ADMIN rejects an event permission request
  static async reject(req, res) {
    try {
      const reviewerId = req.user.id;
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid request id." });
      }

      const { rejectionReason } = req.body;

      const request = await prisma.eventPermissionRequest.findUnique({ where: { id } });
      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found." });
      }
      if (request.status !== "PENDING") {
        return res.status(400).json({ success: false, message: "Request is not pending." });
      }

      const updated = await prisma.eventPermissionRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          reviewedById: reviewerId,
          rejectionReason: rejectionReason || null,
        },
        include: {
          requester: { select: { id: true, name: true, email: true } },
          reviewedBy: { select: { id: true, name: true } },
        },
      });

      res.json({ success: true, request: updated });
    } catch (err) {
      console.error("Event permission reject error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
}

export default EventPermissionController;
