import * as Account from "./account";
import * as User from "./account.user";

export async function signUp(_: any, { input }: { input: User.toDb }) {
  let result = await Account.signUp(input);

  return result;
}

export async function login(_: any, { input }: { input: User.toDb }) {
  let result = await Account.login(input);

  return result;
}
