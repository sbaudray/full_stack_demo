import * as Account from "../account";
import Global from "../__types__/node.global";
import { graphql } from "graphql";
declare var global: Global;
import schema from "../graphql.schema";
import argon2 from "argon2";

let validUser = {
  email: "batman@robin.com",
  username: "Batman",
  password: "batcave",
};

beforeEach(async () => {
  await global.database.collection("users").deleteMany({});
  Account.init(global.database);
});

test("signup an user", async () => {
  let mutation = `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      ...on SignUpSuccess {
        user {
          id
          username
          email
        }
      }
    }
  }
  `;

  let params = { input: { ...validUser } };

  let result = (await graphql(schema, mutation, null, null, params)) as any;

  let {
    data: {
      signUp: { user },
    },
  } = result;

  expect(user.username).toBe("Batman");
  expect(user.email).toBe("batman@robin.com");
  expect(user.id).toBeDefined();
});

test("cannot signup twice", async () => {
  let user = await Account.signUp(validUser);

  expect(user.__typename).toBe("SignUpSuccess");

  let duplicate = await Account.signUp(validUser);

  expect(duplicate.__typename).toBe("DuplicateUserError");
});

test("it hashes the password", async () => {
  let spy = jest.spyOn(argon2, "hash");

  await Account.signUp(validUser);

  expect(spy).toHaveBeenCalled();
});
