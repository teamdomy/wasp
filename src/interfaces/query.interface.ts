import { WaspAgent } from '../agents/wasp.agent';
import { PeerAgent } from '../agents/peer.agent';
import { SwarmAgent } from '../agents/swarm.agent';

export interface Query {
  agent: string;
  action: Actions;
  data: {
    attribute: string,
    part?: Part
    value?: string
  };
  type?: string;
  sn?: string;
}

export enum Actions {
  all,
  get,
  one,
  del
}

export enum Part {
  name,
  id
}

export type AgentType = WaspAgent | PeerAgent | SwarmAgent;
