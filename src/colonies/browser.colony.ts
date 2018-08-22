import { BrowserService } from '../services/browser.service';

/**
 * It setups all connections in isolated scope and routes requests
 *
 * @return {void}
 */
export function activate(): void {
  const browserService = new BrowserService();
  browserService.setUpLinks();

  // Routes the request
  self.addEventListener('message', event => {
    const data = event.data;
    switch (data.type) {
      case 'order':
        browserService.setOrder(data);
        break;
      case 'task':
        browserService.setTask(data);
        break;
      case 'query':
        browserService.setQuery(data);
        break;
      case 'info':
        browserService.getInfo(data);
        break;
      case 'auth':
        browserService.authPeer(data);
        break;
      case 'watch':
        browserService.setWatch(data);
        break;
    }
  });

}
