import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Message, Conversation } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userIds: string[]): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: userIds.map((userId) => ({ id: userId })),
        },
      },
    });
  }

  async getConversationById(conversationId: string): Promise<Conversation> {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true, messages: true },
    });
  }

  async createMessage(
    conversationId: string,
    authorId: string,
    content: string,
  ): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        conversation: { connect: { id: conversationId } },
      },
    });
  }
}
