import * as Account from "./account";
import * as User from "./account.user";

export async function signUp(_: any, { input }: { input: User.toDb }) {
  let user = await Account.signUp(input);
  console.log(user);

  return { user };
}
