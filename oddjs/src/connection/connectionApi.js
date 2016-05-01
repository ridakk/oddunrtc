import OutgoingConnection from './outgoingConnection';

export default class ConnectionApi {

  static create(data = {
    to: null
  }) {
    return new OutgoingConnection(data);
  }

  // TODO: incoming connection callback? onConnection?

}
