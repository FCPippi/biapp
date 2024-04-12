// chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createConversation')
  async onCreateConversation(client: Socket, userIds: string[]) {
    const conversation = await this.chatService.createConversation(userIds);
    client.join(conversation.id);
    this.server.to(conversation.id).emit('conversationCreated', conversation);
  }

  @SubscribeMessage('joinConversation')
  async onJoinConversation(client: Socket, conversationId: string) {
    const conversation =
      await this.chatService.getConversationById(conversationId);
    client.join(conversationId);
    client.emit('conversationJoined', conversation);
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    client: Socket,
    payload: { conversationId: string; content: string },
  ) {
    const { conversationId, content } = payload;
    const userId = client.handshake.query.userId as string;
    const message = await this.chatService.createMessage(
      conversationId,
      userId,
      content,
    );
    this.server.to(conversationId).emit('messageReceived', message);
  }
}
