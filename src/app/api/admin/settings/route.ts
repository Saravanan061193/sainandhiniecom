import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await connectDB();

        const settings = await Settings.findOneAndUpdate({}, data, { new: true, upsert: true });
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
