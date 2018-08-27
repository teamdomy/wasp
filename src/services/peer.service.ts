import { SourceService } from './source.service';
import { PeerAgent } from '../agents/peer.agent';
import { AgentService } from './agent.service';
import { SwarmAgent } from '../agents/swarm.agent';
import { WaspAgent } from '../agents/wasp.agent';

export class PeerService extends AgentService {

  protected agent: string;

  constructor() {
    super();
    this.agent = 'peers';
  }


  /**
   * Return current user (host)
   *
   * @return {PeerAgent}
   */
  public getHost(): PeerAgent {
    return SourceService.peer;
  }

  /**
   * Selects swarms by peer id
   *
   * @param {string} id
   * @return {Promise<SwarmAgent[] | null>}
   */
  public getSwarms(id: string): Promise<SwarmAgent[] | null> {
    return this.getProperty(id, 'swarms')
      .then(result =>
        this.scatter(result, SwarmAgent)
      );
  }

  /**
   * Executes the wasp locally or remotely
   *
   * @param {Promise<WaspAgent> | WaspAgent | { body: string, params: any[] }} wasp
   * @param {string} id
   * @return {Promise<any>}
   */
  public run(
    wasp: Promise<WaspAgent> | WaspAgent | { body: string, params: any[] },
    id: string
  ): Promise<any> {
    return this.sourceService.execute(wasp, id, 'peers')
  }
}
