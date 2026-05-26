import { getCollection } from "./mongodb";
import { sendPushToUser } from "./fcm";
import { ObjectId } from "mongodb";

/**
 * Sends both an in-app notification and an FCM push notification to the user
 * when their order status is updated.
 */
export async function notifyOrderStatusUpdate(
  orderId: string,
  status: string,
  deliveryEstimate?: string
) {
  try {
    const ordersCollection = await getCollection("orders");
    const notificationsCollection = await getCollection("notifications");

    let orderObjectId: ObjectId;
    try {
      orderObjectId = new ObjectId(orderId);
    } catch {
      console.error(`[notifyOrderStatusUpdate] Invalid orderId format: ${orderId}`);
      return;
    }

    const order = await ordersCollection.findOne({ _id: orderObjectId });
    if (!order) {
      console.error(`[notifyOrderStatusUpdate] Order not found: ${orderId}`);
      return;
    }

    const userId = order.userId;
    if (!userId || userId === "guest") {
      console.log(`[notifyOrderStatusUpdate] Order ${orderId} belongs to guest or has no userId. Skipping notification.`);
      return;
    }

    let title = "";
    let message = "";

    const shortId = orderId.slice(-6);

    switch (status) {
      case "confirmed":
        title = "✅ Захиалга баталгаажлаа!";
        message = `Таны #${shortId} захиалгын төлбөр баталгаажлаа. Хүргэлт: ${deliveryEstimate || order.deliveryEstimate || "Тодорхойлогдоно"}`;
        break;
      case "processing":
        title = "⚙️ Захиалга бэлтгэгдэж байна";
        message = `Таны #${shortId} захиалгыг хүргэлтэд бэлтгэж байна.`;
        break;
      case "shipped":
        title = "📦 Захиалга хүргэлтэд гарлаа!";
        message = `Таны #${shortId} захиалсан бараа хүргэлтэд гарлаа. Түр хүлээнэ үү!`;
        break;
      case "delivered":
        title = "🎉 Захиалга хүргэгдлээ!";
        message = `Таны #${shortId} захиалга хүргэгдлээ. Биднийг сонгосонд баярлалаа!`;
        break;
      case "cancelled":
        title = "❌ Захиалга цуцлагдлаа";
        message = `Таны #${shortId} захиалга цуцлагдлаа.`;
        break;
      case "pending":
        title = "⏳ Захиалга хүлээгдэж байна";
        message = `Таны #${shortId} захиалга үүслээ. Төлбөрөө төлнө үү.`;
        break;
      default:
        title = `🔄 Захиалгын төлөв шинэчлэгдлээ`;
        message = `Таны #${shortId} захиалгын төлөв дараах байдлаар өөрчлөгдлөө: ${status}`;
        break;
    }

    // 1. Insert in-app notification in DB
    await notificationsCollection.insertOne({
      userId,
      title,
      message,
      type: "order",
      isRead: false,
      link: `/orders/${orderId}`,
      createdAt: new Date(),
    });

    // 2. Send FCM Push Notification
    await sendPushToUser({
      userId,
      title,
      body: message,
      data: {
        url: `/orders/${orderId}`,
        orderId,
        type: "order_status_update",
        status
      }
    });

    console.log(`[notifyOrderStatusUpdate] Successfully sent notification to user ${userId} for order ${orderId} (${status})`);
  } catch (error) {
    console.error(`[notifyOrderStatusUpdate] Error sending notification for order ${orderId}:`, error);
  }
}
