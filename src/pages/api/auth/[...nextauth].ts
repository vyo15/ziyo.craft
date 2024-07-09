import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithGoogle, signIn } from "../../../services/auth/services";
import { compare } from "bcrypt";

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
      console.log(
        "JWT Callback - token:",
        token,
        "account:",
        account,
        "user:",
        user
      );
      if (account?.provider === "credentials" && user) {
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
      }

      if (account?.provider === "google" && user) {
        const data = {
          fullname: user.name,
          email: user.email,
          type: "google",
        };

        try {
          await loginWithGoogle(data, (result: any) => {
            console.log("Google login result:", result);
            token.email = result.email;
            token.fullname = result.fullname;
            token.role = result.role;
          });
        } catch (error) {
          console.error("Error login dengan Google:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      console.log("Session Callback - session:", session, "token:", token);
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
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "signIn Callback - user:",
        user,
        "account:",
        account,
        "profile:",
        profile,
        "email:",
        email,
        "credentials:",
        credentials
      );
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback - url:", url, "baseUrl:", baseUrl);
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
