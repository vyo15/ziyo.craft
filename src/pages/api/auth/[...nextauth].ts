import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { loginWithGoogle, signIn } from "../../../services/auth/services";

// Extend the User type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      fullname?: string | null;
      phone?: string | null;
      role?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    fullname?: string | null;
    phone?: string | null;
    role?: string | null;
    image?: string | null;
    accessToken?: string; // accessToken made optional
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullname?: string | null;
    phone?: string | null;
    role?: string | null;
    image?: string | null;
    accessToken: string;
  }
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          const user: any = await signIn(email);
          if (user) {
            const passwordConfirm = await compare(password, user.password);
            if (passwordConfirm) {
              return user;
            } else {
              console.error("Password anda salah");
              return null;
            }
          } else {
            console.error("Pengguna tidak ditemukan");
            return null;
          }
        } catch (error) {
          console.error("Error dalam authorize:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user) {
        token.id = user.id;
        token.email = user.email;
        token.fullname = user.fullname ?? null;
        token.phone = user.phone ?? null;
        token.role = user.role ?? null;
        token.image = user.image ?? null;
        if (user.accessToken) {
          token.accessToken = user.accessToken;
        }
      }

      if (account?.provider === "google" && user) {
        const data = {
          fullname: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
          type: "google",
        };

        try {
          const result = await new Promise<{
            id: string;
            email: string;
            fullname: string;
            role: string;
            image: string;
            accessToken: string;
          }>((resolve, reject) => {
            loginWithGoogle(data, (status: boolean, res: any) => {
              if (status) {
                resolve(res);
              } else {
                reject(new Error("Login with Google failed"));
              }
            });
          });

          token.id = result.id;
          token.email = result.email;
          token.fullname = result.fullname;
          token.role = result.role;
          token.image = result.image;
          token.accessToken = result.accessToken;
        } catch (error) {
          console.error("Error login dengan Google:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.fullname = token.fullname;
      session.user.phone = token.phone;
      session.user.role = token.role;
      session.user.image = token.image;

      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });

      session.accessToken = accessToken;
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
