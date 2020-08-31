import * as Account from "../account";
import * as Library from "../library";
import app from "../server";
import Global from "../__types__/node.global";
import { graphql } from "graphql";
declare var global: Global;
import schema from "../graphql.schema";
import argon2 from "argon2";
import request from "supertest";
import cookie from "cookie";
import { differenceInCalendarDays } from "date-fns";

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
  Account.init(global.mongoClient);
  Library.init(global.mongoClient);
});

test("can signup an user, not twice", async () => {
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

test("can login with valid credentials", async () => {
  await Account.signUp(validUser);

  let invalidPassword = (await graphql(schema, loginMutation, null, null, {
    input: { email: validUser.email, password: "INVALID" },
  })) as any;

  expect(invalidPassword.data.login.user).toBeNull();
  expect(invalidPassword.data.login.resultErrors).toHaveLength(1);

  let invalidEmail = (await graphql(schema, loginMutation, null, null, {
    input: { email: "INVALID", password: validUser.password },
  })) as any;

  expect(invalidEmail.data.login.user).toBeNull();
  expect(invalidEmail.data.login.resultErrors).toHaveLength(1);

  let result = (await graphql(schema, loginMutation, null, null, {
    input: { email: validUser.email, password: validUser.password },
  })) as any;

  expect(result.data.login.user.id).toBeDefined();
  expect(result.data.login.user.email).toBe(validUser.email);
  expect(result.data.login.user.username).toBe(validUser.username);
  expect(result.data.login.user.password).not.toBeDefined();
  expect(result.data.login.resultErrors).toHaveLength(0);
});

it("should set a cookie when user is logged in", async () => {
  await Account.signUp(validUser);

  let alien = await request(app)
    .post("/graphql")
    .send({
      query: loginMutation,
      variables: { input: { email: "INVALID", password: "INVALID" } },
    });

  expect(alien.header["set-cookie"]).not.toBeDefined();

  let citizen = await request(app)
    .post("/graphql")
    .send({
      query: loginMutation,
      variables: {
        input: { email: validUser.email, password: validUser.password },
      },
    });

  expect(citizen.header["set-cookie"]).toBeDefined();

  let [sessionCookie] = citizen.header["set-cookie"];
  let { Expires } = cookie.parse(sessionCookie);

  expect(differenceInCalendarDays(new Date(Expires), new Date())).toBe(7);
});
