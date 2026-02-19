import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const settings = await Settings.findOne();

        const key_id = settings?.payment?.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
        const key_secret = settings?.payment?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            return NextResponse.json({
                error: "Razorpay API keys are missing. Please configure them in Admin Settings or .env file."
            }, { status: 500 });
        }

        if (key_id.includes("rzp_test_...") || key_secret.includes("...")) {
            return NextResponse.json({
                error: "Invalid API Keys. It looks like you are using placeholder keys. Please update them in Admin Settings."
            }, { status: 400 });
        }

        const razorpay = new Razorpay({
            key_id,
            key_secret,
        });

        const { amount, currency = "INR" } = await req.json();

        if (!amount || amount < 1) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paisa
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        try {
            const order = await razorpay.orders.create(options);
            // Append key_id to the response
            return NextResponse.json({
                ...order,
                key: key_id
            });
        } catch (rzpError: any) {
            console.error("Razorpay SDK Error:", rzpError);
            // Check for specific Razorpay errors
            const msg = rzpError.error?.description || rzpError.message || "Razorpay SDK Error";
            return NextResponse.json({ error: msg }, { status: 502 });
        }

    } catch (error: any) {
        console.error("Payment Route Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
