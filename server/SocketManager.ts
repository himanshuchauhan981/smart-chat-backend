const SocketIO = require('socket.io');

class SocketManager {
  io: any;

  public init(server: any): void {
    this.io = SocketIO(server);
  }
}

export default new SocketManager;