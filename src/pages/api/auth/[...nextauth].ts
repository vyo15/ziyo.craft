import { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "@/lib/firebase/service";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";

// Extend the User type
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      fullname?: string;
      phone?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    email: string;
    fullname?: string;
    phone?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    fullname?: string;
    phone?: string;
    role?: string;
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
        const user: any = await signIn(email);
        if (user) {
          const passwordConfirm = await compare(password, user.password);
          if (passwordConfirm) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials") {
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.fullname) {
        session.user.fullname = token.fullname;
      }
      if (token.phone) {
        session.user.phone = token.phone;
      }
      if (token.role) {
        session.user.role = token.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
