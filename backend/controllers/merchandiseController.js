import prisma from "../prisma/client.js";

const toInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toFloat = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeItems = (items = []) =>
  items
    .filter(Boolean)
    .map((item) => ({
      productId: toInt(item.productId),
      quantity: toInt(item.quantity) || 1,
      unitPrice: toFloat(item.unitPrice) || 0,
      size: item.size || null,
    }));

const computeTotal = (items = []) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

class MerchandiseController {
  static async createProduct(req, res) {
    try {
      const { name, description, price, imageUrl, status, inventory, isActive } = req.body;

      if (!name || price === undefined || price === null) {
        return res.status(400).json({ success: false, message: "Name and price are required" });
      }

      const product = await prisma.merchandiseProduct.create({
        data: {
          name,
          description: description || null,
          price: toFloat(price) || 0,
          imageUrl: imageUrl || null,
          status: status || undefined,
          inventory: toInt(inventory) ?? 0,
          isActive: typeof isActive === "boolean" ? isActive : true,
        },
      });

      return res.status(201).json({ success: true, product });
    } catch (error) {
      console.error("Create product error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getProducts(req, res) {
    try {
      const { status, search, active } = req.query;

      const where = {};
      if (status) where.status = status;
      if (active !== undefined) where.isActive = active === "true";
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const products = await prisma.merchandiseProduct.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, products });
    } catch (error) {
      console.error("Get products error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = toInt(req.params.id);
      if (!productId) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
      }

      const product = await prisma.merchandiseProduct.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.json({ success: true, product });
    } catch (error) {
      console.error("Get product error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const productId = toInt(req.params.id);
      if (!productId) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
      }

      const { name, description, price, imageUrl, status, inventory, isActive } = req.body;

      const product = await prisma.merchandiseProduct.update({
        where: { id: productId },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price: toFloat(price) || 0 }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(status !== undefined && { status }),
          ...(inventory !== undefined && { inventory: toInt(inventory) ?? 0 }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      });

      return res.json({ success: true, product });
    } catch (error) {
      console.error("Update product error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const productId = toInt(req.params.id);
      if (!productId) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
      }

      await prisma.merchandiseProduct.delete({
        where: { id: productId },
      });

      return res.json({ success: true, message: "Product deleted" });
    } catch (error) {
      console.error("Delete product error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createOrder(req, res) {
    try {
      const { buyerName, buyerEmail, buyerPhone, items, status, notes } = req.body;

      if (!buyerName) {
        return res.status(400).json({ success: false, message: "buyerName is required" });
      }

      const normalizedItems = normalizeItems(items);
      if (!normalizedItems.length) {
        return res.status(400).json({ success: false, message: "Order items are required" });
      }

      const totalAmount = computeTotal(normalizedItems);

      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.merchandiseOrder.create({
          data: {
            buyerName,
            buyerEmail: buyerEmail || null,
            buyerPhone: buyerPhone || null,
            status: status || undefined,
            notes: notes || null,
            totalAmount,
            items: {
              create: normalizedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                size: item.size,
              })),
            },
          },
          include: { items: { include: { product: true } } },
        });

        for (const item of normalizedItems) {
          if (item.productId) {
            await tx.merchandiseProduct.update({
              where: { id: item.productId },
              data: { inventory: { decrement: item.quantity } },
            });
          }
        }

        return created;
      });

      return res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Create order error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getOrders(req, res) {
    try {
      const { status, search } = req.query;

      const where = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { buyerName: { contains: search, mode: "insensitive" } },
          { buyerEmail: { contains: search, mode: "insensitive" } },
        ];
      }

      const orders = await prisma.merchandiseOrder.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, orders });
    } catch (error) {
      console.error("Get orders error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getOrderById(req, res) {
    try {
      const orderId = toInt(req.params.id);
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Invalid order id" });
      }

      const order = await prisma.merchandiseOrder.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.json({ success: true, order });
    } catch (error) {
      console.error("Get order error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async updateOrder(req, res) {
    try {
      const orderId = toInt(req.params.id);
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Invalid order id" });
      }

      const { status, notes, buyerName, buyerEmail, buyerPhone } = req.body;

      const order = await prisma.merchandiseOrder.update({
        where: { id: orderId },
        data: {
          ...(status !== undefined && { status }),
          ...(notes !== undefined && { notes }),
          ...(buyerName !== undefined && { buyerName }),
          ...(buyerEmail !== undefined && { buyerEmail }),
          ...(buyerPhone !== undefined && { buyerPhone }),
        },
        include: { items: { include: { product: true } } },
      });

      return res.json({ success: true, order });
    } catch (error) {
      console.error("Update order error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async deleteOrder(req, res) {
    try {
      const orderId = toInt(req.params.id);
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Invalid order id" });
      }

      await prisma.merchandiseOrder.delete({
        where: { id: orderId },
      });

      return res.json({ success: true, message: "Order deleted" });
    } catch (error) {
      console.error("Delete order error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default MerchandiseController;
