import { type Writable, writable } from "svelte/store";

interface ISection {
  page: number;
  data: Map<number | string, any>;
}

const search_store: Writable<{
  articles: ISection;
  users: ISection;
  sportstacks: ISection;
  tags: ISection;
}> = writable({
  articles: {
    page: 0,
    data: new Map(),
  },
  sportstacks: {
    page: 0,
    data: new Map(),
  },
  users: {
    page: 0,
    data: new Map(),
  },
  tags: {
    page: 0,
    data: new Map(),
  },
});

export default search_store;
