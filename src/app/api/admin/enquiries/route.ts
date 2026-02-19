import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });

        return NextResponse.json(enquiries);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch enquiries" },
            { status: 500 }
        );
    }
}
