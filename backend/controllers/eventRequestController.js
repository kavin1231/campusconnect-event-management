import prisma from "../prisma/client.js";

const parseTimeToMinutes = (value) => {
  if (!value) return null;
  const [hoursPart, minutesPart = "0"] = String(value).split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const assertSubmitter = (request, userId) => {
  if (!userId || request.submittedBy !== userId) {
    return {
      ok: false,
      error: { status: 403, message: "Unauthorized" },
    };
  }
  return { ok: true };
};

const publishEvent = async (eventRequestId) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.eventRequest.findUnique({
      where: { id: parseInt(eventRequestId) },
    });

    if (!request) {
      return { error: "NOT_FOUND" };
    }

    if (request.status === "PUBLISHED") {
      const existingPublished = await tx.event.findFirst({
        where: {
          submittedBy: request.submittedBy,
          title: request.title,
          date: request.eventDate,
        },
      });

      return {
        event: existingPublished,
        message: "Event already published",
      };
    }

    if (request.status !== "APPROVED") {
      return { error: "NOT_APPROVED" };
    }

    const existing = await tx.event.findFirst({
      where: {
        submittedBy: request.submittedBy,
        title: request.title,
        date: request.eventDate,
      },
    });

    if (existing) {
      if (request.bannerUrl && existing.image !== request.bannerUrl) {
        await tx.event.update({
          where: { id: existing.id },
          data: { image: request.bannerUrl },
        });
      }

      await tx.eventRequest.update({
        where: { id: parseInt(eventRequestId) },
        data: { status: "PUBLISHED" },
      });

      return {
        event: existing,
        message: "Event already published",
      };
    }

    const createdEvent = await tx.event.create({
      data: {
        title: request.title,
        description: request.purposeDescription || "",
        date: request.eventDate,
        category: request.purposeTag || "General",
        location: request.venue || "TBD",
        image:
          request.bannerUrl ||
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600",
        status: "PUBLISHED",
        budget: request.estimatedBudget
          ? Math.round(request.estimatedBudget)
          : null,
        expectedAttendees: request.expectedAttendance,
        venue: request.venue,
        submittedBy: request.submittedBy,
        submittedDate: request.submittedAt,
        approvedBy: request.reviewedBy,
        approvedAt: request.reviewedAt,
      },
    });

    await tx.eventRequest.update({
      where: { id: parseInt(eventRequestId) },
      data: { status: "PUBLISHED" },
    });

    return {
      event: createdEvent,
      message: "Event published successfully",
    };
  });
};

export const createEventRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      // Step 1
      title,
      eventType,
      eventTypeOther,
      purposeTag,
      purposeDescription,
      eventDate,
      startTime,
      endTime,
      setupTime,
      teardownTime,
      audience,
      // Step 2
      organizingBody,
      contactName,
      contactId,
      contactPhone,
      contactEmail,
      supervisorName,
      supervisorDepartment,
      supervisorPhone,
      // Step 3
      venue,
      expectedAttendance,
      seatingArrangement,
      parkingRequired,
      // Step 4
      estimatedBudget,
      budgetBreakdown,
      sponsorshipDetails,
      fundSource,
      // Step 5
      riskAssessment,
      safetyMeasures,
      emergencyPlan,
      contingency,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !eventType ||
      !purposeTag ||
      !purposeDescription ||
      !eventDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const eventRequest = await prisma.eventRequest.create({
      data: {
        title,
        eventType,
        eventTypeOther,
        purposeTag,
        purposeDescription,
        eventDate: new Date(eventDate),
        startTime,
        endTime,
        setupTime,
        teardownTime,
        audience,
        organizingBody,
        contactName,
        contactId,
        contactPhone,
        contactEmail,
        supervisorName,
        supervisorDepartment,
        supervisorPhone,
        venue,
        expectedAttendance: expectedAttendance
          ? parseInt(expectedAttendance)
          : null,
        seatingArrangement,
        parkingRequired: parkingRequired === true,
        estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
        budgetBreakdown,
        sponsorshipDetails,
        fundSource: Array.isArray(fundSource)
          ? fundSource.join(", ")
          : fundSource || null,
        riskAssessment,
        safetyMeasures,
        emergencyPlan,
        contingency,
        submittedBy: userId,
      },
      include: {
        submitter: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Event request submitted successfully",
      data: eventRequest,
    });
  } catch (error) {
    console.error("Error creating event request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventRequests = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const isAdmin = req.user?.role === "SYSTEM_ADMIN";

    let where = {};

    if (isAdmin) {
      if (userId) {
        where.submittedBy = parseInt(userId);
      }
      if (status) {
        where.status = status;
      }
    } else {
      where.submittedBy = req.user?.id;
      where.status = "PENDING";
    }

    const requests = await prisma.eventRequest.findMany({
      where,
      include: {
        submitter: {
          select: { id: true, name: true, email: true },
        },
        reviewer: {
          select: { id: true, name: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching event requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyEventRequestsAll = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const requests = await prisma.eventRequest.findMany({
      where: { submittedBy: userId },
      include: {
        submitter: {
          select: { id: true, name: true, email: true },
        },
        reviewer: {
          select: { id: true, name: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching user event requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "SYSTEM_ADMIN";

    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        submitter: {
          select: { id: true, name: true, email: true },
        },
        reviewer: {
          select: { id: true, name: true },
        },
      },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    // Check authorization
    if (!isAdmin && request.submittedBy !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Error fetching event request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateEventRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const userId = req.user?.id;

    // Only admins can update status
    if (req.user?.role !== "SYSTEM_ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const validStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "REVISION_REQUESTED",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const updatedRequest = await prisma.eventRequest.update({
      where: { id: parseInt(id) },
      data: {
        status,
        reviewNotes,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
      include: {
        submitter: {
          select: { id: true, name: true, email: true },
        },
        reviewer: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({
      success: true,
      message: "Event request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating event request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteEventRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    // Only the submitter or admin can delete
    if (request.submittedBy !== userId && req.user?.role !== "SYSTEM_ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Can't delete if already reviewed
    if (request.reviewedAt) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete reviewed requests" });
    }

    await prisma.eventRequest.delete({
      where: { id: parseInt(id) },
    });

    res.json({ success: true, message: "Event request deleted successfully" });
  } catch (error) {
    console.error("Error deleting event request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventRequestStats = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "SYSTEM_ADMIN";

    let where = {};
    if (!isAdmin) {
      where.submittedBy = req.user?.id;
    }

    const stats = await prisma.eventRequest.groupBy({
      by: ["status"],
      where,
      _count: true,
    });

    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      revisionRequested: 0,
    };

    stats.forEach((stat) => {
      formattedStats.total += stat._count;
      if (stat.status === "PENDING") formattedStats.pending = stat._count;
      if (stat.status === "APPROVED") formattedStats.approved = stat._count;
      if (stat.status === "REJECTED") formattedStats.rejected = stat._count;
      if (stat.status === "REVISION_REQUESTED")
        formattedStats.revisionRequested = stat._count;
    });

    res.json({ success: true, data: formattedStats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const publishEventRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    if (request.submittedBy !== userId && req.user?.role !== "SYSTEM_ADMIN") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const result = await publishEvent(id);

    if (result?.error === "NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    if (result?.error === "NOT_APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only approved requests can be published",
      });
    }

    res.json({
      success: true,
      message: result?.message || "Event published successfully",
      data: result?.event || null,
    });
  } catch (error) {
    console.error("Error publishing event request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateEventSetup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    const auth = assertSubmitter(request, userId);
    if (!auth.ok) {
      return res
        .status(auth.error.status)
        .json({ success: false, message: auth.error.message });
    }

    if (request.status !== "APPROVED" && request.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Event setup is only available for approved requests",
      });
    }

    const { title, description, capacity, category } = req.body || {};
    const data = {};

    if (typeof title === "string") data.title = title.trim();
    if (typeof description === "string")
      data.purposeDescription = description.trim();
    if (typeof category === "string") data.purposeTag = category.trim();
    if (capacity !== undefined) {
      const capNum = Number(capacity);
      data.expectedAttendance = Number.isNaN(capNum) ? null : capNum;
    }

    const updated = await prisma.eventRequest.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json({
      success: true,
      message: "Event setup saved",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving event setup:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateEventBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    const auth = assertSubmitter(request, userId);
    if (!auth.ok) {
      return res
        .status(auth.error.status)
        .json({ success: false, message: auth.error.message });
    }

    if (request.status !== "APPROVED" && request.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Event setup is only available for approved requests",
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const bannerUrl = `/uploads/events/${req.file.filename}`;
    const updated = await prisma.eventRequest.update({
      where: { id: parseInt(id) },
      data: { bannerUrl },
    });

    res.json({
      success: true,
      message: "Event banner updated",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating event banner:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const replaceEventTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    const auth = assertSubmitter(request, userId);
    if (!auth.ok) {
      return res
        .status(auth.error.status)
        .json({ success: false, message: auth.error.message });
    }

    if (request.status !== "APPROVED" && request.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Event setup is only available for approved requests",
      });
    }

    const tickets = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body?.tickets)
        ? req.body.tickets
        : [];
    const payload = tickets
      .filter((ticket) => ticket && ticket.name)
      .map((ticket) => ({
        name: String(ticket.name).trim(),
        price: Number(ticket.price || 0),
        inventory: Number(ticket.inventory || 0),
        enabled: ticket.enabled !== false,
      }));

    await prisma.eventRequest.update({
      where: { id: request.id },
      data: { tickets: payload },
    });

    res.json({ success: true, message: "Tickets updated" });
  } catch (error) {
    console.error("Error updating tickets:", error?.message);
    if (error?.stack) {
      console.error(error.stack);
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const replaceEventMerchandise = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const request = await prisma.eventRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Event request not found" });
    }

    const auth = assertSubmitter(request, userId);
    if (!auth.ok) {
      return res
        .status(auth.error.status)
        .json({ success: false, message: auth.error.message });
    }

    if (request.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Event setup is only available for approved requests",
      });
    }

    const items = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body?.items)
        ? req.body.items
        : [];
    const payload = items
      .filter((item) => item && item.name)
      .map((item) => ({
        name: String(item.name).trim(),
        description: item.description ? String(item.description).trim() : null,
        price: Number(item.price || 0),
        inventory: Number(item.inventory || 0),
        imageUrl: item.imageUrl ? String(item.imageUrl).trim() : null,
        enabled: item.enabled !== false,
      }));

    await prisma.eventRequest.update({
      where: { id: request.id },
      data: { merchandise: payload },
    });

    res.json({ success: true, message: "Merchandise updated" });
  } catch (error) {
    console.error("Error updating merchandise:", error?.message);
    if (error?.stack) {
      console.error(error.stack);
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventCalendar = async (req, res) => {
  try {
    const { start, end, venue } = req.query;

    const where = {
      status: { in: ["PENDING", "APPROVED", "PUBLISHED"] },
    };

    if (start || end) {
      where.eventDate = {};
      if (start) where.eventDate.gte = new Date(start);
      if (end) where.eventDate.lte = new Date(end);
    }

    if (venue) {
      where.venue = venue;
    }

    const requests = await prisma.eventRequest.findMany({
      where,
      orderBy: { eventDate: "asc" },
      select: {
        id: true,
        title: true,
        venue: true,
        eventDate: true,
        startTime: true,
        endTime: true,
        status: true,
        purposeTag: true,
      },
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching event calendar:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventConflicts = async (req, res) => {
  try {
    const { start, end, venue } = req.query;
    const where = {
      status: { in: ["PENDING", "APPROVED", "PUBLISHED"] },
    };

    if (start || end) {
      where.eventDate = {};
      if (start) where.eventDate.gte = new Date(start);
      if (end) where.eventDate.lte = new Date(end);
    }

    if (venue) {
      where.venue = venue;
    }

    const requests = await prisma.eventRequest.findMany({
      where,
      orderBy: [{ eventDate: "asc" }, { startTime: "asc" }],
      select: {
        id: true,
        title: true,
        venue: true,
        eventDate: true,
        startTime: true,
        endTime: true,
      },
    });

    const conflicts = [];
    const grouped = new Map();

    requests.forEach((reqItem) => {
      if (!reqItem.venue || !reqItem.eventDate) return;
      const dateKey = new Date(reqItem.eventDate).toISOString().slice(0, 10);
      const key = `${dateKey}__${reqItem.venue}`;
      const entry = grouped.get(key) || [];
      entry.push(reqItem);
      grouped.set(key, entry);
    });

    grouped.forEach((items, key) => {
      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
          const a = items[i];
          const b = items[j];
          const aStart = parseTimeToMinutes(a.startTime);
          const aEnd = parseTimeToMinutes(a.endTime);
          const bStart = parseTimeToMinutes(b.startTime);
          const bEnd = parseTimeToMinutes(b.endTime);

          if (
            aStart === null ||
            aEnd === null ||
            bStart === null ||
            bEnd === null
          ) {
            continue;
          }

          const overlaps = aStart < bEnd && bStart < aEnd;
          if (overlaps) {
            conflicts.push({
              date: key.split("__")[0],
              venue: key.split("__")[1],
              events: [
                {
                  id: a.id,
                  title: a.title,
                  startTime: a.startTime,
                  endTime: a.endTime,
                },
                {
                  id: b.id,
                  title: b.title,
                  startTime: b.startTime,
                  endTime: b.endTime,
                },
              ],
            });
          }
        }
      }
    });

    res.json({ success: true, data: conflicts });
  } catch (error) {
    console.error("Error fetching event conflicts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
