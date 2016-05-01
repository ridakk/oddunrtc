import PubSub from '../pubsub/pubsub';

import {
  EVENT_CONNECTION_API_STATE
} from '../pubsub/events';

let UUID = require('node-uuid');

export default class Connection {

  constructor(data) {
    this.id = UUID.v1();
    this.data = data;
  }

  end() {
    // TODO: send delete request to server
    // TODO: publish end event to FSM
    // TODO: global or per connection FSM?
    console.log('end: ${id}');
  }

  onState(callback) {
    PubSub.subscribe({
      subscriber: this.id,
      event: EVENT_CONNECTION_API_STATE,
      callback: callback
    });
  }

}
