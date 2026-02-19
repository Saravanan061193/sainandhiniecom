import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { hash } from "bcryptjs";

export async function GET() {
    try {
        await connectDB();

        // Check and Create Users
        let users = await User.find({});

        if (users.length === 0) {
            const hashedPassword = await hash("password123", 12);

            const adminUser = await User.create({
                name: "Admin User",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
                phone: "9876543210",
                address: {
                    street: "1 Admin Road",
                    city: "Chennai",
                    pincode: "600001",
                    state: "Tamil Nadu"
                }
            });

            const customerUser = await User.create({
                name: "John Doe",
                email: "customer@example.com",
                password: hashedPassword,
                role: "customer",
                phone: "9123456780",
                address: {
                    street: "42 Customer Lane",
                    city: "Bangalore",
                    pincode: "560001",
                    state: "Karnataka"
                }
            });

            users = [adminUser, customerUser];
        }

        const products = await Product.find({});
        if (products.length === 0) return NextResponse.json({ error: "No products found. Please add products first." });

        const statuses = ['Pending', 'Processing', 'Shipping', 'Delivered'];
        const dummyOrders = [];

        // Create 12 orders to have distribution
        for (let i = 0; i < 12; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            // Cycle through statuses to ensure we have some of each
            const status = statuses[i % statuses.length];

            // Pick random items
            const numItems = Math.floor(Math.random() * 3) + 1;
            const orderItems = [];
            let itemsPrice = 0;

            for (let j = 0; j < numItems; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 2) + 1;

                // Use variant price if available, otherwise base price
                let price = product.price;
                if (product.variants && product.variants.length > 0) {
                    price = product.variants[0].price; // Simplified: just pick first variant price
                }

                orderItems.push({
                    name: product.name,
                    qty,
                    image: product.images?.[0] || '',
                    price,
                    product: product._id
                });
                itemsPrice += price * qty;
            }

            const shippingPrice = itemsPrice > 500 ? 0 : 50;
            const taxPrice = itemsPrice * 0.05;
            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            const isPaid = status !== 'Pending';
            const isDelivered = status === 'Delivered';

            const order = {
                user: user._id,
                orderItems,
                shippingAddress: {
                    fullName: user.name,
                    address: user.address?.street || `${100 + i} Gandhi Road`,
                    city: user.address?.city || 'Chennai',
                    pincode: user.address?.pincode || '600017',
                    country: 'India',
                    phone: user.phone || '9876543210',
                    email: user.email
                },
                paymentMethod: 'Credit Card',
                paymentResult: isPaid ? {
                    id: 'pay_' + Math.random().toString(36).substring(7),
                    status: 'success',
                    update_time: new Date().toISOString(),
                    email_address: user.email
                } : {},
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt: isPaid ? new Date(Date.now() - Math.floor(Math.random() * 10000000)) : undefined,
                isDelivered,
                deliveredAt: isDelivered ? new Date() : undefined,
                status,
                awbNumber: (status === 'Shipping' || status === 'Delivered') ? 'AWB' + Math.floor(10000000 + Math.random() * 90000000) : undefined,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Random date in last 30 days
            };

            dummyOrders.push(order);
        }

        await Order.insertMany(dummyOrders);

        return NextResponse.json({
            message: "Added 12 dummy orders",
            usersCreated: users.length === 2 && (await User.countDocuments()) === 2,
            count: dummyOrders.length
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
