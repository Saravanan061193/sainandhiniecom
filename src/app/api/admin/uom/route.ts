import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UOM from "@/models/UOM";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all UOMs
export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const filter = includeInactive ? {} : { isActive: true };
        const uoms = await UOM.find(filter).sort({ name: 1 });

        return NextResponse.json(uoms);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// CREATE new UOM
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { name, code, isActive } = await req.json();

        const finalCode = code || name.toLowerCase().replace(/\s+/g, '');

        // Check if exists
        const existing = await UOM.findOne({ $or: [{ name }, { code: finalCode }] });
        if (existing) {
            return NextResponse.json({ error: "UOM with this name or code already exists" }, { status: 400 });
        }

        const uom = await UOM.create({
            name,
            code: finalCode,
            isActive: isActive !== undefined ? isActive : true
        });

        return NextResponse.json(uom, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
