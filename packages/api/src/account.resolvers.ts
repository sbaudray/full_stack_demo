import * as Account from "./account";
import * as User from "./account.user";
import { Request } from "express";

export async function signUp(_: any, { input }: { input: User.toDb }) {
  let result = await Account.signUp(input);

  return result;
}

export async function login(
  _: any,
  { input }: { input: User.toDb },
  context: Request | undefined
) {
  let result = await Account.login(input);

  if (context?.session && result.user) {
    context.session.user = result.user;
  }

  return result;
}
