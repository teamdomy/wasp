import { SwarmAgent } from '../agents/swarm.agent';
import { WaspProxy } from './wasp.proxy';
import { PeerService } from '../services/peer.service';

/**
 * It simplify peer manipulations by proxying function calls
 */
export class PeerProxy {

  public peer() {

    if (typeof Proxy !== 'undefined') {

      const peerService = new PeerService();
      const peerAgent = peerService.getHost();

      return new Proxy(Object, {
        get: (target, method) => {
          return (...params) => {
            if (typeof peerAgent[method] === 'function') {
              return peerAgent[method](params);
            } else {
              const waspProxy = new WaspProxy();
              const wasp = waspProxy.wasp();
              return peerAgent.run(wasp[method](...params));
            }
          }
        }
      });
    }

  }
}
