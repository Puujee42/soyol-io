import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { broadcastNewMessage, broadcastAdminConversationUpdate } from '@/lib/messageBroadcast';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId: authUserId } = await auth();
        const guestId = req.headers.get('x-guest-id');
        const userId = authUserId || guestId;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
        }

        const messagesCollection = await getCollection('support_messages');
        const messages = await messagesCollection
            .find({ conversationId: new ObjectId(id) })
            .sort({ createdAt: 1 })
            .toArray();

        // Map to ChatMessage format
        const formattedMessages = messages.map(msg => ({
            id: msg._id.toString(),
            senderId: msg.senderId,
            senderName: msg.senderName || 'Guest',
            body: msg.body || msg.content || '',
            createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
            status: msg.status || 'sent'
        }));

        return NextResponse.json(formattedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId: authUserId, role: authRole } = await auth();
        const guestId = req.headers.get('x-guest-id');
        const userId = authUserId || guestId;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
        }

        const body = await req.json();
        const content = body.body || body.content || '';
        const senderName = body.senderName || (authRole === 'admin' ? 'Support Admin' : 'Guest');

        if (!content || typeof content !== 'string' || !content.trim()) {
            return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
        }

        const conversationsCollection = await getCollection('support_conversations');
        const conversation = await conversationsCollection.findOne({ _id: new ObjectId(id) });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const finalSenderId = authRole === 'admin' ? 'support_admin' : userId;

        const messagesCollection = await getCollection('support_messages');
        const newMessage = {
            conversationId: new ObjectId(id),
            senderId: finalSenderId,
            senderName,
            body: content.trim(),
            createdAt: new Date(),
            status: 'sent' as const
        };

        const result = await messagesCollection.insertOne(newMessage);

        // Update conversation state
        const updateDoc: any = {
            $set: {
                lastMessage: content.trim(),
                lastMessageAt: new Date(),
                updatedAt: new Date()
            }
        };

        if (authRole === 'admin') {
            updateDoc.$inc = { userUnreadCount: 1 };
        } else {
            updateDoc.$inc = { adminUnreadCount: 1 };
        }

        await conversationsCollection.updateOne(
            { _id: new ObjectId(id) },
            updateDoc
        );

        const updatedConversation = await conversationsCollection.findOne({ _id: new ObjectId(id) });

        // Map response to ChatMessage format
        const responseMessage = {
            id: result.insertedId.toString(),
            senderId: finalSenderId,
            senderName,
            body: content.trim(),
            createdAt: newMessage.createdAt.toISOString(),
            status: 'sent' as const
        };

        // Broadcast updates
        await broadcastNewMessage(id, responseMessage);
        if (updatedConversation) {
            await broadcastAdminConversationUpdate(updatedConversation);
        }

        return NextResponse.json(responseMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
