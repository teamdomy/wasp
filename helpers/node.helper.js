const vm = require('vm');

global.result = undefined;
global.params = undefined;
global.wasp = undefined;

/**
 * Executes the wasp and returns the result
 */
process.on('message', data => {
  if (
    data.order &&
    data.order.data
  ) {

    const order = data.order;
    const script = data.script;

    params = order.data.params;
    order.data['value'] = {};

    const promise = new Promise((resolve, reject) => {
      wasp = vm.createScript(
        `result = (${script}).apply(null, params)`
      );
      resolve(wasp.runInThisContext());
    });

    promise.then(() => {
      order.data.value = result;
      process.send({ order: order });
    }).catch(err => console.log(err))
  }
});
