import { type Writable, writable } from "svelte/store";

interface ISection {
  page: number;
  data: Map<number | string, any>;
  loading: boolean;
  total?: number;
  next_page_count?: number;
}

const search_store: Writable<{
  articles: ISection;
  users: ISection;
  sportstacks: ISection;
  tags: ISection;
  search: string
}> = writable({
  search: "",
  articles: {
    page: 0,
    data: new Map(),
    total: 0,
    loading: false,
  },
  sportstacks: {
    page: 0,
    data: new Map(),
    total: 0,
    loading: false,
  },
  users: {
    page: 0,
    data: new Map(),
    total: 0,
    loading: false,
  },
  tags: {
    page: 0,
    data: new Map(),
    total: 0,
    loading: false,
  },
});

export default search_store;
