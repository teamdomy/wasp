import { PeerAgent } from '../agents/peer.agent';
import { WaspAgent } from '../agents/wasp.agent';
import { AgentService } from './agent.service';

export class SwarmService extends AgentService {

  protected agent: string;

  constructor() {
    super();
    this.agent = 'swarms';
  }


  /**
   * Selects peers by swarm id
   *
   * @param {string} id
   * @return {Promise<PeerAgent[] | null>}
   */
  public getPeers(id: string): Promise<PeerAgent[] | null> {
    return this.getProperty(id, 'peers')
      .then(result =>
        this.scatter(result, PeerAgent)
      );
  }

  /**
   * Selects masters by swarm id
   *
   * @param {string} id
   * @return {Promise<PeerAgent[] | null>}
   */
  public getMasters(id: string): Promise<PeerAgent[] | null> {
    return this.getProperty(id, 'masters')
      .then(result =>
        this.scatter(result, PeerAgent)
      );
  }

  /**
   * Selects wasps by swarm id
   *
   * @param {string} id
   * @return {Promise<WaspAgent[] | null>}
   */
  public getWasps(id: string): Promise<WaspAgent[] | null> {
    return this.getProperty(id, 'wasps')
      .then(result =>
        this.scatter(result, WaspAgent)
      );
  }

  /**
   * Executes the wasp in swarm context
   *
   * @param {Promise<WaspAgent> | WaspAgent,} wasp
   * @param {string} id
   * @return {Promise<any>}
   */
  public run(
    wasp: Promise<WaspAgent> | WaspAgent,
    id: string
  ): Promise<any> {
    return this.sourceService.execute(wasp, id, 'swarms')
  }

  /**
   * Listen to the swarm event - run, join, leave
   *
   * @param {string} id
   * @param {string} action
   */
  public listen(id: string, action: string): Promise<any> {
    return this.sourceService.setWatch({
      subject: id,
      action: action
    }).then(result => !!result.action);
  }
}
