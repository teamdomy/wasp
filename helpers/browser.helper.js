/**
 * Wrap the function from the wasp shell (worker execution)
 *
 * @param data
 */
export function wrap(data) {
  return `
    self.addEventListener('message', function(event) {
      if (
        event.data.order &&
        event.data.order.data
      ) {

        var order = event.data.order;
        order.data['value'] = {};

        var result = (${data}).apply(null, order.data.params);

        order.data.value = result;
        self.postMessage({ order: order });
      }
    });
  `;
}
