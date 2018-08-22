/**
 * Result is used a response on Task request
 */
export class Result {
  agent: string;
  subject: string;
  predicate: Predicate;
  data: {
    created: boolean,
    attribute: string,
    value: any
  };
  error?: Error;
  type: string;
  sn: string;
}

export enum Predicate {
  add,
  exc,
  set,
  get,
  has
}


/**
 * it could return the value of created property
 * and the id if the object was created
 */
