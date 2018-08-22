export interface Info {
  agent: string;
  subject: string;
  local?: boolean;
  data: {
    property: string;
    value?: any;
  };
  type?: string;
  sn?: string;
}
