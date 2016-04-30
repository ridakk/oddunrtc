require('webrtc-adapter');

import Media from './webrtc/media';
import Config from './config/config';
import PubSub from './pubsub/pubsub';
import {
  SUBSCRIBER_API
} from './pubsub/subscribers';
import {
  EVENT_API_READY,
  EVENT_API_OFFLINE
} from './pubsub/events';

export default class ODD {

  constructor() {}

  static init(params = {
    keys: {
      product: null,
      js: null
    },
    session: {
      id: null,
      custom: {}
    }
  }) {
    // TODO: check if browser is supported
    // TODO: check audioinput, audiooutput, videoinput availability
    // TODO: validate product and js key with server
    // TODO: open websocket connection with returned token
    // TODO: if all succeeds, then fire 'ready' event of api
    // TODO: if one fail, then fire 'failure' event of api accordingly
    Config.validate(params.keys);
    return;
  }

  static ready(callback) {
    // TODO: what to do if 'callback' is not a function? ignore? warning?
    PubSub.subscribe({
      subscriber: SUBSCRIBER_API,
      event: EVENT_API_READY,
      callback: callback
    });
  }

  static offline(callback) {
    // TODO: what to do if 'callback' is not a function? ignore? warning?
    PubSub.subscribe({
      subscriber: SUBSCRIBER_API,
      event: EVENT_API_OFFLINE,
      callback: callback
    });
  }

  static createConnection() {
    return;
  }

  static get media() {
    return Media;
  }

}
