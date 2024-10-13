import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import qs from "querystring";
import jwt from "jsonwebtoken";

const URL = "http://localhost:5000/api/v1/"; // change it

interface DecodedToken {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  isAdmin: string;
}

function decodeJwt(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: ".com" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${URL}auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include",
          });

          if (!res.ok) {
            console.error("Login failed:", await res.text());
            return null;
          }

          const setCookie = qs.decode(
            res.headers.get("set-cookie") || "",
            "; ",
            "="
          );
          const [cookieName, cookieValue] = Object.entries(setCookie)[0] as [
            string,
            string
          ];

          cookies().set({
            name: cookieName,
            value: cookieValue,
            httpOnly: true,
            maxAge: parseInt(setCookie["Max-Age"] as string) || 0,
            path: setCookie.Path as string,
            sameSite: "strict",
            expires: new Date(setCookie.Expires as string),
            secure: true,
          });

          const { accessToken } = await res.json();
          const decodedToken = decodeJwt(accessToken);

          if (!decodedToken) {
            throw new Error("Failed to decode access token");
          }

          return {
            id: decodedToken.id,
            name: decodedToken.username,
            email: credentials.email,
            accessToken,
            isAdmin: decodedToken.role,
            exp: decodedToken.exp,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (!token || Object.keys(token).length === 0) {
        try {
          const refreshToken = cookies().get("jwt")?.value;
          if (refreshToken) {
            await fetch(`${URL}auth/logout`, {
              method: "POST",
              credentials: "include",
              headers: {
                Cookie: `jwt=${refreshToken}`,
              },
            });
            cookies().delete("jwt");
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
        return token;
      }

      if (trigger === "signIn" || trigger === "signUp") {
        return { ...token, ...user };
      }

      console.log("***************  EXPIRATION *****************");

      console.log(token.exp);
      console.log(Date.now());
      console.log((token.exp as number) * 1000 - 60000);

      if (
        token.exp &&
        typeof token.exp === "number" &&
        Date.now() / 1000 > token.exp
      ) {
        console.log(
          "********************************************* NO rEFRESH ********************************************"
        );

        return token;
      } else {
        console.log(
          "********************************************* JWT REFRESH ********************************************"
        );

        try {
          const refreshToken = cookies().get("jwt")?.value;
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await fetch(`${URL}auth/refresh`, {
            method: "GET",
            credentials: "include",
            headers: {
              Cookie: `jwt=${refreshToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const { accessToken } = await response.json();
          const decodedToken = decodeJwt(accessToken);

          if (!decodedToken) {
            throw new Error("Failed to decode refreshed access token");
          }
          console.log(
            "********************************************* Token refreshed successfully ********************************************"
          );

          console.log("Token refreshed successfully");

          return {
            ...token,
            accessToken,
            exp: decodedToken.exp,
            isAdmin: decodedToken.role,
          };
        } catch (error) {
          console.error("Error refreshing token:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("SESSION", session);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          isAdmin: token.isAdmin as string,
        },
        accessToken: token.accessToken as string,
        error: token.error as string | undefined,
      };
    },
  },

  pages: {
    signIn: "Login",
    newUser: "Dashboared/Home",
  },

  debug: process.env.NODE_ENV === "development",
};
