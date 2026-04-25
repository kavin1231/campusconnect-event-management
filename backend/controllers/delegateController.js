import prisma from "../prisma/client.js";

class DelegateController {
  /**
   * Add a delegate to an event request
   */
  static async addEventDelegate(req, res) {
    try {
      const { eventRequestId } = req.params;
      const { delegateUserId, role = "MANAGER", reason } = req.body;
      const performedBy = req.user.id;

      // Validate event exists and user owns it
      const eventRequest = await prisma.eventRequest.findUnique({
        where: { id: parseInt(eventRequestId) },
        include: { submitter: true }
      });

      if (!eventRequest) {
        return res.status(404).json({ success: false, message: "Event request not found" });
      }

      // Check authorization: only submitter or admin can add delegates
      if (eventRequest.submittedBy !== performedBy && req.user.role !== "SYSTEM_ADMIN") {
        return res.status(403).json({ success: false, message: "Unauthorized to manage delegates for this event" });
      }

      // Validate delegate user exists
      const delegateUser = await prisma.user.findUnique({
        where: { id: parseInt(delegateUserId) }
      });

      if (!delegateUser) {
        return res.status(404).json({ success: false, message: "Delegate user not found" });
      }

      // Check if already a delegate
      const existingDelegate = await prisma.eventDelegate.findUnique({
        where: {
          eventRequestId_delegateUserId: {
            eventRequestId: parseInt(eventRequestId),
            delegateUserId: parseInt(delegateUserId)
          }
        }
      });

      if (existingDelegate && existingDelegate.isActive) {
        return res.status(409).json({ success: false, message: "User is already a delegate for this event" });
      }

      // Create or reactivate delegate
      let delegate;
      if (existingDelegate && !existingDelegate.isActive) {
        delegate = await prisma.eventDelegate.update({
          where: { id: existingDelegate.id },
          data: {
            role,
            isActive: true,
            removedAt: null,
            delegatedAt: new Date()
          },
          include: { delegateUser: true }
        });
      } else {
        delegate = await prisma.eventDelegate.create({
          data: {
            eventRequestId: parseInt(eventRequestId),
            delegateUserId: parseInt(delegateUserId),
            role
          },
          include: { delegateUser: true }
        });
      }

      // Log to history
      await prisma.eventDelegateHistory.create({
        data: {
          eventRequestId: parseInt(eventRequestId),
          actionType: "ADDED",
          delegateUserId: parseInt(delegateUserId),
          delegateName: delegateUser.name,
          role,
          performedBy,
          reason: reason || null
        }
      });

      res.json({
        success: true,
        message: "Delegate added successfully",
        delegate: {
          id: delegate.id,
          delegateName: delegate.delegateUser.name,
          delegateEmail: delegate.delegateUser.email,
          role: delegate.role,
          delegatedAt: delegate.delegatedAt
        }
      });
    } catch (error) {
      console.error("Error adding delegate:", error);
      res.status(500).json({ success: false, message: "Failed to add delegate", error: error.message });
    }
  }

  /**
   * Get all delegates for an event
   */
  static async getEventDelegates(req, res) {
    try {
      const { eventRequestId } = req.params;

      const delegates = await prisma.eventDelegate.findMany({
        where: {
          eventRequestId: parseInt(eventRequestId),
          isActive: true
        },
        include: {
          delegateUser: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              role: true
            }
          }
        },
        orderBy: { delegatedAt: "desc" }
      });

      res.json({
        success: true,
        delegates: delegates.map(d => ({
          id: d.id,
          delegateId: d.delegateUser.id,
          delegateName: d.delegateUser.name,
          delegateEmail: d.delegateUser.email,
          delegateProfileImage: d.delegateUser.profileImage,
          delegateRole: d.delegateUser.role,
          role: d.role,
          delegatedAt: d.delegatedAt,
          permissions: d.permissions ? JSON.parse(d.permissions) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching delegates:", error);
      res.status(500).json({ success: false, message: "Failed to fetch delegates", error: error.message });
    }
  }

  /**
   * Update delegate role
   */
  static async updateDelegateRole(req, res) {
    try {
      const { eventRequestId, delegateId } = req.params;
      const { role, reason } = req.body;
      const performedBy = req.user.id;

      // Validate event ownership
      const eventRequest = await prisma.eventRequest.findUnique({
        where: { id: parseInt(eventRequestId) }
      });

      if (!eventRequest) {
        return res.status(404).json({ success: false, message: "Event request not found" });
      }

      if (eventRequest.submittedBy !== performedBy && req.user.role !== "SYSTEM_ADMIN") {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }

      // Update delegate
      const delegate = await prisma.eventDelegate.update({
        where: { id: parseInt(delegateId) },
        data: { role },
        include: { delegateUser: true }
      });

      // Log to history
      await prisma.eventDelegateHistory.create({
        data: {
          eventRequestId: parseInt(eventRequestId),
          actionType: "ROLE_CHANGED",
          delegateUserId: delegate.delegateUserId,
          delegateName: delegate.delegateUser.name,
          role,
          performedBy,
          reason: reason || null
        }
      });

      res.json({
        success: true,
        message: "Delegate role updated",
        delegate: {
          id: delegate.id,
          delegateName: delegate.delegateUser.name,
          role: delegate.role
        }
      });
    } catch (error) {
      console.error("Error updating delegate role:", error);
      res.status(500).json({ success: false, message: "Failed to update delegate", error: error.message });
    }
  }

  /**
   * Remove a delegate from an event
   */
  static async removeEventDelegate(req, res) {
    try {
      const { eventRequestId, delegateId } = req.params;
      const { reason } = req.body;
      const performedBy = req.user.id;

      // Validate authorization
      const eventRequest = await prisma.eventRequest.findUnique({
        where: { id: parseInt(eventRequestId) }
      });

      if (!eventRequest) {
        return res.status(404).json({ success: false, message: "Event request not found" });
      }

      if (eventRequest.submittedBy !== performedBy && req.user.role !== "SYSTEM_ADMIN") {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }

      // Get delegate before removal
      const delegate = await prisma.eventDelegate.findUnique({
        where: { id: parseInt(delegateId) },
        include: { delegateUser: true }
      });

      if (!delegate) {
        return res.status(404).json({ success: false, message: "Delegate not found" });
      }

      // Soft delete (mark as inactive)
      await prisma.eventDelegate.update({
        where: { id: parseInt(delegateId) },
        data: {
          isActive: false,
          removedAt: new Date()
        }
      });

      // Log to history
      await prisma.eventDelegateHistory.create({
        data: {
          eventRequestId: parseInt(eventRequestId),
          actionType: "REMOVED",
          delegateUserId: delegate.delegateUserId,
          delegateName: delegate.delegateUser.name,
          performedBy,
          reason: reason || null
        }
      });

      res.json({
        success: true,
        message: "Delegate removed successfully"
      });
    } catch (error) {
      console.error("Error removing delegate:", error);
      res.status(500).json({ success: false, message: "Failed to remove delegate", error: error.message });
    }
  }

  /**
   * Get delegate history/audit trail
   */
  static async getDelegateHistory(req, res) {
    try {
      const { eventRequestId } = req.params;

      const history = await prisma.eventDelegateHistory.findMany({
        where: { eventRequestId: parseInt(eventRequestId) },
        include: {
          performedByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      res.json({
        success: true,
        history: history.map(h => ({
          id: h.id,
          actionType: h.actionType,
          delegateName: h.delegateName,
          delegateId: h.delegateUserId,
          role: h.role,
          performedBy: h.performedByUser?.name || "System",
          reason: h.reason,
          createdAt: h.createdAt
        }))
      });
    } catch (error) {
      console.error("Error fetching delegate history:", error);
      res.status(500).json({ success: false, message: "Failed to fetch history", error: error.message });
    }
  }

  /**
   * Check if user is a delegate for event (helper for middleware)
   */
  static async checkDelegateAccess(eventRequestId, userId) {
    try {
      const delegate = await prisma.eventDelegate.findUnique({
        where: {
          eventRequestId_delegateUserId: {
            eventRequestId: parseInt(eventRequestId),
            delegateUserId: parseInt(userId)
          }
        }
      });

      return delegate && delegate.isActive ? delegate : null;
    } catch (error) {
      console.error("Error checking delegate access:", error);
      return null;
    }
  }
}

export default DelegateController;
