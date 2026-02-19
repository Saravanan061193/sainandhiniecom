import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ShippingRate from "@/models/ShippingRate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const rate = await ShippingRate.findByIdAndDelete(id);

        if (!rate) return NextResponse.json({ error: "Rate not found" }, { status: 404 });

        return NextResponse.json({ message: "Rate deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
