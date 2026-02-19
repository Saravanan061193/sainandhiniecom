import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replace(/\s/g, "_");

        // Define the path to the public/uploads directory
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Save the file
        await writeFile(path.join(uploadDir, filename), buffer);

        // Return the URL
        return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
