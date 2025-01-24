import { emitter } from "../hooks/PubSub";

class WebSocketService {
  private sockets: Record<string, WebSocket> = {};

  connect(channel: string) {
    if (this.sockets[channel]) return;

    const socket = new WebSocket(`ws://localhost:3000/${channel}`);
    socket.onopen = () => this.handleEvent(channel, "connected");
    socket.onmessage = (event) =>
      this.handleEvent(channel, "message", JSON.parse(event.data));
    socket.onerror = (error) => this.handleEvent(channel, "error", error);
    socket.onclose = () => this.handleEvent(channel, "disconnected");
    this.sockets[channel] = socket;
  }

  disconnect(channel: string) {
    if (!this.sockets[channel]) return;

    this.sockets[channel].close();
    delete this.sockets[channel];
  }

  sendMessage(channel: string, message: object) {
    const socket = this.sockets[channel];
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }
   
  handleEvent(channel: string, event: string, data: any = null) {
    const eventEmitter = emitter;
    eventEmitter.emit(`${channel}-${event}`, data);
  }

  isConnected(channel: string): boolean {
    return this.sockets[channel]?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
