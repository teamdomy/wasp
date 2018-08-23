import { SwarmService } from '../services/swarm.service';
import { SwarmAgent } from '../agents/swarm.agent';
import { WaspProxy } from './wasp.proxy';

/**
 * It simplify swarm manipulation by proxying function calls
 */
export class SwarmProxy {

  public swarm() {
    const swarmService = new SwarmService();

    return new Proxy(Object, {
      get: (first, name) => {
        return new Proxy(Object, {
          get: (second, method) => {
            return (...params) => {
              return swarmService.findOneBy('name', <string>name)
                .then(result => {
                  const swarmAgent = new SwarmAgent(result.id);

                  if (typeof swarmAgent[method] === 'function') {
                    return swarmAgent[method](params);
                  } else {
                    if (result.id) {
                      const waspProxy = new WaspProxy();
                      const wasp = waspProxy.wasp();
                      return swarmAgent.run(wasp[method](...params));
                    } else {
                      return Promise.reject('Swarm not found');
                    }
                  }
                })
            }
          }
        });
      }
    });
  }
}
