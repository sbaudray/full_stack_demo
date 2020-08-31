import * as Account from "./account";
import { Request } from "express";

export async function signUp(
  _: any,
  { input }: any,
  context: Request | undefined
) {
  let result = await Account.signUp(input);

  if (context?.session && result.user) {
    context.session.user = result.user;
  }

  return result;
}

export async function login(
  _: any,
  { input }: any,
  context: Request | undefined
) {
  let result = await Account.login(input);

  if (context?.session && result.user) {
    context.session.user = result.user;
  }

  return result;
}

export async function logout(
  _parent: any,
  _args: any,
  context: Request | undefined
) {
  if (context?.session?.user) {
    delete context.session.user;
  }

  return { ok: true };
}

export async function me(
  _parent: any,
  _args: any,
  context: Request | undefined
) {
  if (context?.session?.user) {
    return { user: context.session.user, resultErrors: [] };
  }

  return { user: null, resultErrors: [Account.NotAuthenticated] };
}
