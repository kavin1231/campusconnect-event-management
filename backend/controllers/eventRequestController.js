import prisma from "../prisma/client.js";

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

    if (!isAdmin && userId) {
      where.submittedBy = parseInt(userId);
    } else if (!isAdmin) {
      where.submittedBy = req.user?.id;
    }

    if (status) {
      where.status = status;
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
