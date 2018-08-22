import { NodeService } from '../services/node.service';

/**
 * It setups all connections in isolated scope and routes requests
 */
const nodeService = new NodeService();
nodeService.setUpLinks();

// Routes the request
process.on('message', data => {
  switch (data.type) {
    case 'order':
      nodeService.setOrder(data);
      break;
    case 'task':
      nodeService.setTask(data);
      break;
    case 'query':
      nodeService.setQuery(data);
      break;
    case 'info':
      nodeService.getInfo(data);
      break;
    case 'auth':
      nodeService.authPeer(data);
      break;
    case 'watch':
      nodeService.setWatch(data);
      break;
  }
});
