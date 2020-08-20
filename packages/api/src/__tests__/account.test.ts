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

let signUpMutation = `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
        user {
          id
          username
          email
        }
        resultErrors {
          __typename
        }
    }
  }
  `;

let loginMutation = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
        user {
          id
          username
          email
        }
        resultErrors {
          __typename
        }
      }
    }
  `;

beforeEach(async () => {
  await global.database.collection("users").deleteMany({});
  Account.init(global.database);
});

test("signup an user, not twice", async () => {
  let params = { input: { ...validUser } };

  let result = (await graphql(
    schema,
    signUpMutation,
    null,
    null,
    params
  )) as any;

  expect(result.data.signUp.user.username).toBe(validUser.username);
  expect(result.data.signUp.user.email).toBe(validUser.email);
  expect(result.data.signUp.user.id).toBeDefined();
  expect(result.data.signUp.resultErrors).toHaveLength(0);

  let duplicate = (await graphql(
    schema,
    signUpMutation,
    null,
    null,
    params
  )) as any;

  expect(duplicate.data.signUp.user).toBeNull();
  expect(duplicate.data.signUp.resultErrors).toHaveLength(1);
});

test("it hashes the password", async () => {
  let spy = jest.spyOn(argon2, "hash");

  await Account.signUp(validUser);

  expect(spy).toHaveBeenCalled();
});

test("can login", async () => {
  await Account.signUp(validUser);

  let params = {
    input: { email: validUser.email, password: validUser.password },
  };

  let result = (await graphql(
    schema,
    loginMutation,
    null,
    null,
    params
  )) as any;

  expect(result.data.login.user.id).toBeDefined();
  expect(result.data.login.user.email).toBe(validUser.email);
  expect(result.data.login.user.username).toBe(validUser.username);
  expect(result.data.login.user.password).not.toBeDefined();
  expect(result.data.login.resultErrors).toHaveLength(0);
});

test("can't login with invalid password", async () => {
  await Account.signUp(validUser);

  let params = {
    input: { email: validUser.email, password: "INVALID" },
  };
  let result = (await graphql(
    schema,
    loginMutation,
    null,
    null,
    params
  )) as any;

  expect(result.data.login.user).toBeNull();
  expect(result.data.login.resultErrors).toHaveLength(1);
});
