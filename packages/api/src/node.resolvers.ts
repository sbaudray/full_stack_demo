import { fromGlobalId } from "graphql-relay";
import * as Library from "./library";

export async function node(_: any, { id: globalId }: any) {
  let { type, id } = fromGlobalId(globalId);

  switch (type) {
    case "Movie":
      return await Library.getMovie(id);
  }
}
