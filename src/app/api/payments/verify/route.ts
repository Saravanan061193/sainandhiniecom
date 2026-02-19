import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Settings from "@/models/Settings";

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

        await connectDB();
        const settings = await Settings.findOne();
        const key_secret = settings?.payment?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

        if (!key_secret) {
            console.error("RAZORPAY_KEY_SECRET is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await connectDB();
            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
                paidAt: Date.now(),
                paymentResult: {
                    id: razorpay_payment_id,
                    status: "completed",
                    email_address: "", // Can fetch from Razorpay API if needed
                }
            }, { new: true });

            if (!updatedOrder) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Payment verified successfully", orderId: updatedOrder._id });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
