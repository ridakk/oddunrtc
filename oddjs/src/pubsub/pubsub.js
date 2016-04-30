import { SUBSCRIBER_GLOBAL } from './subscribers';

let listeners = new WeakMap();

class PubSub {

  constructor() {}

  // params.subscriber
  // params.event
  // params.callback
  subscribe(params) {
    if (params.subscriber === SUBSCRIBER_GLOBAL) {
      listeners.has(SUBSCRIBER_GLOBAL) || this.listeners.set(SUBSCRIBER_GLOBAL, new WeakMap());
      listeners.get(SUBSCRIBER_GLOBAL).has(params.event) || listeners.get(SUBSCRIBER_GLOBAL).set(params.event, []);
      listeners.get(SUBSCRIBER_GLOBAL).get(params.event).push(params.callback);
      return;
    }

    listeners.set(params.subscriber, params.callback);
  }

  publish(params) {
    setTimeout(() => {
      console.log(params.publisher + '->' + params.subscriber + ': ' + params.event);
      listeners.get(params.subscriber)(params);
    }, 0);
  };

  broadcast(params) {
    let i, subsribers = listeners.get(SUBSCRIBER_GLOBAL), childListeners;

    if (!subsribers) {
      return;
    }

    childListeners = subsribers.get(params.event);
    if (!childListeners) {
      return;
    }

    function fireEvent(listener, params) {
      setTimeout(() => {
        listener(params);
      }, 0);
    }

    console.log('broadcasting event: ' + params.event, params);
    for (i in childListeners) {
      if (childListeners.hasOwnProperty(i)) {
        fireEvent(childListeners[i], params);
      }
    }
  };

}

export default new PubSub();
