import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Login attempt for:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter an email and password");
                }

                // Check Hardcoded Fallback FIRST (Works even if DB is offline)
                const fallbackEmail = process.env.ADMIN_EMAIL || "admin@sainandhini.com";
                const fallbackPassword = process.env.ADMIN_PASSWORD || "admin123";

                if (credentials.email === fallbackEmail && credentials.password === fallbackPassword) {
                    console.log("Admin fallback login successful");
                    return {
                        id: "admin-fallback",
                        name: "System Administrator",
                        email: fallbackEmail,
                        role: "admin",
                    };
                }

                try {
                    await connectDB();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        // If user not found, check if this is an OAuth login flow or just plain not found
                        console.log("User not found in DB");
                        return null; // Let standard flow handle it or throw error
                    }

                    if (!user.password) {
                        // This happens if user signed up with Google but trying to login with password
                        throw new Error("Please login with Google");
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                    if (!passwordMatch) {
                        console.log("Password mismatch in DB");
                        throw new Error("Incorrect password");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (dbError: any) {
                    console.error("Database error during login:", dbError);
                    throw new Error(dbError.message || "Database connection error");
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account.provider === "google") {
                try {
                    await connectDB();
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        await User.create({
                            name: user.name,
                            email: user.email,
                            role: "customer",
                            image: user.image,
                            authProvider: "google"
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error creating user from Google login:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }: any) {
            if (user) {
                // If this is the initial sign in, fetch the role from DB again to be sure
                // especially for Google logins where we might have just created the user
                if (account?.provider === "google") {
                    await connectDB();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.id = dbUser._id.toString();
                    }
                } else {
                    token.role = user.role;
                    token.id = user.id;
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
