import { WaspService } from '../services/wasp.service';
import { WaspAgent } from '../agents/wasp.agent';

/**
 * It simplify wasp execution and replacement of the function in the shell
 */
export class WaspProxy {

  public wasp() {

    if (typeof Proxy !== 'undefined') {

      const waspService = new WaspService();

      return new Proxy(Object, {
        get: (target, name): Function => {

          const mirror = (...params) => {
            return waspService.findOneBy('name', <string>name)
              .then(id => {
                if (id) {
                  const waspAgent = new WaspAgent(id);
                  waspAgent.setParams(params);
                  return waspAgent;
                } else {
                  return null;
                }
              });
          };

          mirror['set'] = value => {
            if (name && typeof value === 'function') {

              return waspService.findOneBy('name', <string>name)
                .then(id => {

                  const waspAgent = new WaspAgent(id);

                  if (id) {
                    return waspAgent.set(value)
                  } else {
                    return waspAgent.setName(<string>name)
                      .then(() => () => waspAgent.set(value))
                  }
                })
            } else {
              return Promise.reject('Function expected')
            }
          };

          return mirror;
        }
      });

    }
  }

}
