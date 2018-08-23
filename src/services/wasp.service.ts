import { SwarmAgent } from '../agents/swarm.agent';
import { AgentService } from './agent.service';

export class WaspService extends AgentService {

  constructor() {
    super();
    this.agent = 'wasps';
  }


  /**
   * Selects swarms by wasp id
   *
   * @param {string} id
   * @return {Promise<SwarmAgent[]>}
   */
  public getSwarms(id: string): Promise<SwarmAgent[]> {
    return this.getProperty(id, 'swarms')
      .then(result =>
        this.scatter(result, SwarmAgent)
      );
  }
}
