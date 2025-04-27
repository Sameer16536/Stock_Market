import { emitter } from "../hooks/PubSub";

class WebSocketService {
  private socket: WebSocket | null = null;

  connect() {
    if (this.socket) return; // Prevent multiple connections

    this.socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL as string);

    this.socket.onopen = () => emitter.emit("ws-connected");
    this.socket.onmessage = (event) =>
      emitter.emit("ws-message", JSON.parse(event.data));
    this.socket.onerror = (error) => emitter.emit("ws-error", error);
    this.socket.onclose = () => {
      emitter.emit("ws-disconnected");
      this.socket = null; // Reset socket on disconnect
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: object) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
