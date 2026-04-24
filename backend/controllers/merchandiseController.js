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

const parseOrderNotes = (notesValue) => {
  if (!notesValue) {
    return { notesText: null, pickupLocation: null };
  }

  try {
    const parsed = JSON.parse(notesValue);
    if (parsed && typeof parsed === "object") {
      return {
        notesText: typeof parsed.notes === "string" ? parsed.notes : null,
        pickupLocation:
          typeof parsed.pickupLocation === "string" ? parsed.pickupLocation : null,
      };
    }
  } catch (_) {
    // Keep backward compatibility for legacy plain-text notes.
  }

  return { notesText: notesValue, pickupLocation: null };
};

const serializeOrderNotes = ({ notesText, pickupLocation }) => {
  const cleanNotes = typeof notesText === "string" ? notesText.trim() : "";
  const cleanPickup = typeof pickupLocation === "string" ? pickupLocation.trim() : "";

  if (!cleanNotes && !cleanPickup) return null;

  return JSON.stringify({
    ...(cleanNotes ? { notes: cleanNotes } : {}),
    ...(cleanPickup ? { pickupLocation: cleanPickup } : {}),
  });
};

const isPaymentVerifiedStatus = (statusValue) => {
  const status = String(statusValue || "").toUpperCase();
  return status.includes("PAID") || status.includes("CONFIRM") || status.includes("APPROV");
};

const isCollectedStatus = (statusValue) => {
  const status = String(statusValue || "").toUpperCase();
  return status.includes("COLLECT") || status.includes("DELIVER") || status.includes("COMPLETE");
};

class MerchandiseController {
  static decorateOrder(order) {
    if (!order) return order;
    const parsedNotes = parseOrderNotes(order.notes);
    order.notes = parsedNotes.notesText;
    order.pickupLocation = parsedNotes.pickupLocation;
    return order;
  }

  static async attachPaymentSlipUrls(orders = []) {
    if (!Array.isArray(orders) || !orders.length) return;

    // Prisma client in this workspace may be older than DB schema.
    // Pull paymentSlipUrl via raw SQL and merge so frontend can always display it.
    const slipResults = await Promise.all(
      orders.map((order) =>
        prisma.$queryRaw`
          SELECT "paymentSlipUrl"
          FROM "MerchandiseOrder"
          WHERE id = ${Number(order.id)}
          LIMIT 1
        `,
      ),
    );

    orders.forEach((order, index) => {
      const row = Array.isArray(slipResults[index]) ? slipResults[index][0] : null;
      order.paymentSlipUrl = row?.paymentSlipUrl || null;
    });
  }

  static async uploadProductImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file is required" });
      }

      return res.json({
        success: true,
        imageUrl: `/uploads/merchandise/${req.file.filename}`,
      });
    } catch (error) {
      console.error("Upload product image error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async uploadPaymentSlip(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Payment slip file is required" });
      }

      return res.json({
        success: true,
        slipUrl: `/uploads/payments/${req.file.filename}`,
      });
    } catch (error) {
      console.error("Upload payment slip error:", error);
      
      // Handle multer-specific errors
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File size must be less than 5MB" });
      }
      if (error.message && error.message.includes("Only PNG and JPG")) {
        return res.status(400).json({ success: false, message: "Only PNG and JPG files are allowed" });
      }
      
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const { name, description, price, imageUrl, status, inventory, isActive, eventRequestId } = req.body;

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
          eventRequestId: eventRequestId ? parseInt(eventRequestId) : null,
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
      if (req.query.eventRequestId) where.eventRequestId = parseInt(req.query.eventRequestId);
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
      const { buyerName, buyerEmail, buyerPhone, studentNumber, items, status, notes, paymentSlipUrl } = req.body;

      if (!buyerName) {
        return res.status(400).json({ success: false, message: "buyerName is required" });
      }

      if (!studentNumber) {
        return res.status(400).json({ success: false, message: "studentNumber is required" });
      }

      const normalizedItems = normalizeItems(items);
      if (!normalizedItems.length) {
        return res.status(400).json({ success: false, message: "Order items are required" });
      }

      const totalAmount = computeTotal(normalizedItems);

      const createOrderWithItems = async (tx, includePaymentSlip) => {
        const data = {
          buyerId: req.user?.id || null,
          buyerName,
          buyerEmail: buyerEmail || null,
          buyerPhone: buyerPhone || null,
          studentNumber: studentNumber.trim(),
          status: status || undefined,
          notes: serializeOrderNotes({ notesText: notes || null, pickupLocation: null }),
          totalAmount,
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              size: item.size,
            })),
          },
        };

        if (includePaymentSlip) {
          data.paymentSlipUrl = paymentSlipUrl || null;
        }

        return tx.merchandiseOrder.create({
          data,
          include: { items: { include: { product: true } } },
        });
      };

      const runCreateOrderTransaction = async (includePaymentSlip) =>
        prisma.$transaction(async (tx) => {
          const created = await createOrderWithItems(tx, includePaymentSlip);

          // Keep paymentSlipUrl persisted even when the generated Prisma client
          // is older and does not support the paymentSlipUrl field argument.
          if (!includePaymentSlip && paymentSlipUrl) {
            await tx.$executeRaw`
              UPDATE "MerchandiseOrder"
              SET "paymentSlipUrl" = ${paymentSlipUrl}
              WHERE id = ${created.id}
            `;
          }

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

      let order;
      try {
        order = await runCreateOrderTransaction(true);
      } catch (createError) {
        const message = createError?.message || "";
        const paymentSlipFieldUnsupported =
          message.includes("Unknown argument `paymentSlipUrl`") ||
          message.includes("Unknown arg `paymentSlipUrl`");

        if (!paymentSlipFieldUnsupported) {
          throw createError;
        }

        // Fallback for environments using an older generated Prisma client.
        order = await runCreateOrderTransaction(false);
      }

      return res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Create order error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getOrders(req, res) {
    try {
      const { status, search, orderId, productId } = req.query;

      const where = {};
      if (status) where.status = status;
      if (req.query.eventRequestId) {
        where.items = { some: { product: { eventRequestId: toInt(req.query.eventRequestId) } } };
      }

      if (orderId !== undefined) {
        const parsedOrderId = toInt(orderId);
        if (!parsedOrderId) {
          return res.status(400).json({ success: false, message: "Invalid order id" });
        }
        where.id = parsedOrderId;
      }

      if (productId !== undefined) {
        const parsedProductId = toInt(productId);
        if (!parsedProductId) {
          return res.status(400).json({ success: false, message: "Invalid product id" });
        }
        where.items = { some: { productId: parsedProductId } };
      }

      if (req.user?.role === "STUDENT" || req.user?.role === "CLUB_PRESIDENT") {
        where.buyerId = req.user?.id || null;
      }
      if (search) {
        where.OR = [
          { buyerName: { contains: search, mode: "insensitive" } },
          { buyerEmail: { contains: search, mode: "insensitive" } },
          { studentNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      const orders = await prisma.merchandiseOrder.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });

      await MerchandiseController.attachPaymentSlipUrls(orders);
      orders.forEach((order) => MerchandiseController.decorateOrder(order));

      return res.json({ success: true, orders });
    } catch (error) {
      console.error("Get orders error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getOrdersByProduct(req, res) {
    try {
      const productId = toInt(req.params.id);
      if (!productId) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
      }

      const { status, search } = req.query;
      const where = {
        items: { some: { productId } },
      };

      if (status) where.status = status;
      if (req.user?.role === "STUDENT" || req.user?.role === "CLUB_PRESIDENT") {
        where.buyerId = req.user?.id || null;
      }
      if (search) {
        where.OR = [
          { buyerName: { contains: search, mode: "insensitive" } },
          { buyerEmail: { contains: search, mode: "insensitive" } },
          { studentNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      const orders = await prisma.merchandiseOrder.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });

      await MerchandiseController.attachPaymentSlipUrls(orders);
      orders.forEach((order) => MerchandiseController.decorateOrder(order));

      return res.json({ success: true, productId, orders });
    } catch (error) {
      console.error("Get orders by product error:", error);
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

      if ((req.user?.role === "STUDENT" || req.user?.role === "CLUB_PRESIDENT") && order.buyerEmail !== req.user?.email) {
        return res.status(403).json({ success: false, message: "Not authorized to view this order" });
      }

      const slipRows = await prisma.$queryRaw`
        SELECT "paymentSlipUrl"
        FROM "MerchandiseOrder"
        WHERE id = ${Number(order.id)}
        LIMIT 1
      `;
      const slipRow = Array.isArray(slipRows) ? slipRows[0] : null;
      order.paymentSlipUrl = slipRow?.paymentSlipUrl || null;
      MerchandiseController.decorateOrder(order);

      return res.json({ success: true, order });
    } catch (error) {
      console.error("Get order error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async distributeProductOrders(req, res) {
    try {
      const productId = toInt(req.params.id);
      if (!productId) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
      }

      const pickupLocation = String(req.body?.pickupLocation || "").trim();
      if (!pickupLocation) {
        return res.status(400).json({ success: false, message: "pickupLocation is required" });
      }

      const orders = await prisma.merchandiseOrder.findMany({
        where: {
          items: { some: { productId } },
        },
        select: {
          id: true,
          status: true,
          notes: true,
        },
      });

      const eligibleOrders = orders.filter(
        (order) => isPaymentVerifiedStatus(order.status) && !isCollectedStatus(order.status),
      );

      if (!eligibleOrders.length) {
        return res.json({
          success: true,
          message: "No payment-verified orders are ready for distribution.",
          distributedCount: 0,
          orderIds: [],
        });
      }

      const updatedIds = [];
      await prisma.$transaction(async (tx) => {
        for (const order of eligibleOrders) {
          const parsedNotes = parseOrderNotes(order.notes);
          const mergedNotes = serializeOrderNotes({
            notesText: parsedNotes.notesText,
            pickupLocation,
          });

          await tx.merchandiseOrder.update({
            where: { id: order.id },
            data: {
              status: "READY_FOR_PICKUP",
              notes: mergedNotes,
            },
          });
          updatedIds.push(order.id);
        }
      });

      return res.json({
        success: true,
        message: `Distribution started for ${updatedIds.length} order(s).`,
        distributedCount: updatedIds.length,
        orderIds: updatedIds,
      });
    } catch (error) {
      console.error("Distribute product orders error:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async updateOrder(req, res) {
    try {
      const orderId = toInt(req.params.id);
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Invalid order id" });
      }

      const { status, notes, buyerName, buyerEmail, buyerPhone, pickupLocation } = req.body;

      const currentOrder = await prisma.merchandiseOrder.findUnique({
        where: { id: orderId },
        select: { notes: true },
      });
      if (!currentOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      let nextNotes;
      if (notes !== undefined || pickupLocation !== undefined) {
        const currentParsed = parseOrderNotes(currentOrder.notes);
        nextNotes = serializeOrderNotes({
          notesText: notes !== undefined ? notes : currentParsed.notesText,
          pickupLocation:
            pickupLocation !== undefined
              ? pickupLocation
              : currentParsed.pickupLocation,
        });
      }

      const order = await prisma.merchandiseOrder.update({
        where: { id: orderId },
        data: {
          ...(status !== undefined && { status }),
          ...(nextNotes !== undefined && { notes: nextNotes }),
          ...(buyerName !== undefined && { buyerName }),
          ...(buyerEmail !== undefined && { buyerEmail }),
          ...(buyerPhone !== undefined && { buyerPhone }),
        },
        include: { items: { include: { product: true } } },
      });

      const slipRows = await prisma.$queryRaw`
        SELECT "paymentSlipUrl"
        FROM "MerchandiseOrder"
        WHERE id = ${Number(order.id)}
        LIMIT 1
      `;
      const slipRow = Array.isArray(slipRows) ? slipRows[0] : null;
      order.paymentSlipUrl = slipRow?.paymentSlipUrl || null;
      MerchandiseController.decorateOrder(order);

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
