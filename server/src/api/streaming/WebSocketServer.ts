import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export class WebSocketServer {
  private static io: Server;

  public static initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*', // We can tighten this later
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Basic health ping
      socket.on('ping', (data) => {
        socket.emit('pong', { message: 'Server is alive', timestamp: new Date().toISOString() });
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });

    console.log('✅ WebSocket Server initialized');
  }

  // Method to broadcast metrics to all connected dashboards
  public static broadcastMetric(metric: any): void {
    if (this.io) {
      this.io.emit('metric:stream', metric);
    }
  }
}
