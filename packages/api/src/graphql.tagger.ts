import { toGlobalId } from "graphql-relay";

function tag(tag: string) {
  return (obj: any) => {
    obj.__type = tag;

    obj.id = toGlobalId(tag, obj._id);
    delete obj._id;

    return obj;
  };
}

export let tagMovie = tag("Movie");
