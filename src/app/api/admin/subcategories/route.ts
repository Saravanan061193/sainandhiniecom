import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SubCategory from "@/models/SubCategory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("category");

        const query: any = { isActive: true };
        if (categoryId) query.parentCategory = categoryId;

        const subCategories = await SubCategory.find(query).populate("parentCategory", "name");
        return NextResponse.json(subCategories);
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

        await connectDB();
        const { name, categoryId, description } = await req.json();

        // Check if category exists? Might be skipped for now
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        const subCategory = await SubCategory.create({
            name,
            slug,
            parentCategory: categoryId,
            description
        });

        return NextResponse.json(subCategory, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
