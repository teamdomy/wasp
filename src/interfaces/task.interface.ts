export interface Task {
  agent: string;
  subject: string;
  predicate: Predicate;
  data: {
    attribute: string,
    part?: Part,
    value?: string | number | boolean
  };
  type?: string;
  sn?: string;
}

export enum Predicate {
  add,
  exc,
  set,
  get,
  has
}

export enum Part {
  name,
  id
}
