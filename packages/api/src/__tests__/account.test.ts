import * as Account from "../account";
import Global from "../__types__/node.global";
import { graphql } from "graphql";
declare var global: Global;
import schema from "../graphql.schema";

beforeEach(async () => {
  await global.database.collection("users").deleteMany({});

  Account.init(global.database);
});

test("signup an user", async () => {
  let mutation = `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      user {
        id
        username
        email
      }
    }
  }
  `;

  let params = {
    input: {
      email: "batman@robin.com",
      username: "Batman",
      password: "batcave",
    },
  };

  let result = (await graphql(schema, mutation, null, null, params)) as any;

  console.log(result);

  let {
    data: {
      signUp: { user },
    },
  } = result;

  expect(user.username).toBe("Batman");
  expect(user.email).toBe("batman@robin.com");
  expect(user.id).toBeDefined();
});

