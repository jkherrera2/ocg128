import { google2 } from "$lib/server/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google2.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // store state verifier as cookie
  event.cookies.set("state", state, {
    secure: import.meta.env.PROD, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  // store code verifier as cookie
  event.cookies.set("code_verifier", codeVerifier, {
    secure: import.meta.env.PROD, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  redirect(302, url.toString());
}
