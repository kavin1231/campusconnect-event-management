import {
  createFinanceRecord,
  deleteFinanceRecord,
  getFinanceDashboardData,
  listFinanceRecords,
  updateFinanceRecord,
} from "../services/financeDashboardService.js";

class FinanceDashboardController {
  static async getDashboard(req, res) {
    try {
      const eventId = req.query.eventId ? Number(req.query.eventId) : null;

      if (req.query.eventId && Number.isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: "eventId must be a valid number",
        });
      }

      const data = await getFinanceDashboardData({ eventId });

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Finance dashboard fetch error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load finance dashboard",
        error: error.message,
      });
    }
  }

  static async listRecords(req, res) {
    try {
      const records = await listFinanceRecords({
        type: req.query.type,
        search: req.query.search,
      });

      return res.json({
        success: true,
        records,
      });
    } catch (error) {
      console.error("Finance records list error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to load finance records",
      });
    }
  }

  static async createRecord(req, res) {
    try {
      const createdById = Number(req.user?.id);
      const record = await createFinanceRecord(req.body, createdById);

      return res.status(201).json({
        success: true,
        record,
      });
    } catch (error) {
      console.error("Finance record create error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to create finance record",
      });
    }
  }

  static async updateRecord(req, res) {
    try {
      const record = await updateFinanceRecord(req.params.id, req.body);

      return res.json({
        success: true,
        record,
      });
    } catch (error) {
      console.error("Finance record update error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update finance record",
      });
    }
  }

  static async deleteRecord(req, res) {
    try {
      await deleteFinanceRecord(req.params.id);

      return res.json({
        success: true,
        message: "Finance record deleted successfully",
      });
    } catch (error) {
      console.error("Finance record delete error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to delete finance record",
      });
    }
  }
}

export default FinanceDashboardController;
