import Connection from './connection';

export default class IncomingConnection extends Connection {
  constructor(data) {
    super(data);
  }

  answer() {
    console.log('answer: ${this.id}');
  }

  reject() {
    console.log('answer: ${this.id}');
  }
}
