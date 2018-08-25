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
                .then(id => {
                  const swarmAgent = new SwarmAgent(id);

                  if (typeof swarmAgent[method] === 'function') {
                    return swarmAgent[method](params);
                  } else {
                    if (id) {
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
