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
   * @return {Promise<SwarmAgent[] | null>}
   */
  public getSwarms(id: string): Promise<SwarmAgent[] | null> {
    return this.getProperty(id, 'swarms')
      .then(result =>
        this.scatter(result, SwarmAgent)
      );
  }
}
