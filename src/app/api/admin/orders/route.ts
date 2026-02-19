import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { orderIds, status } = body;

        if (!orderIds || !Array.isArray(orderIds) || !status) {
            return NextResponse.json({ error: "Missing orderIds or status" }, { status: 400 });
        }

        await connectDB();

        const updateData: any = { status };
        if (status === 'Delivered') {
            updateData.isDelivered = true;
            updateData.deliveredAt = Date.now();
        }

        await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: updateData }
        );

        return NextResponse.json({ message: "Orders updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
