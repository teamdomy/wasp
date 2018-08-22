export interface Order {
  agent: string;
  subject: string;
  hash?: string;
  type?: string;
  sn?: string;
  app?: string;
  timeout?: number;
  local?: boolean;
  data: {
    id?: string,
    version?: number,
    pure?: boolean,
    body?: string,
    params?: any[],
    value?: any;
  }
}
