import prisma from "../configs/prisma.js";


//controller for getting chat
export const getChat = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { listingId, chatId } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    let existingChat;

    if (chatId) {
      existingChat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          listingId,
          OR: [
            { chatUserId: userId },
            { ownerUserId: userId },
          ],
        },
        include: {
          listing: true,
          ownerUser: true,
          chatUser: true,
          messages: true,
        },
      });
    } else {
      existingChat = await prisma.chat.findFirst({
        where: {
          listingId,
          chatUserId: userId,
          ownerUserId: listing.ownerId,
        },
        include: {
          listing: true,
          ownerUser: true,
          chatUser: true,
          messages: true,
        },
      });
    }

    if (existingChat) {
      if (
        existingChat.messages.length > 0 &&
        existingChat.isLastMessageRead === false
      ) {
        const lastMessage = existingChat.messages.at(-1);
        if (lastMessage.sender_id !== userId) {
          await prisma.chat.update({
            where: { id: existingChat.id },
            data: { isLastMessageRead: true },
          });
        }
      }

      return res.json({ chat: existingChat });
    }

    const newChat = await prisma.chat.create({
      data: {
        listingId,
        chatUserId: userId,
        ownerUserId: listing.ownerId,
      },
    });

    const chatWithData = await prisma.chat.findUnique({
      where: { id: newChat.id },
      include: {
        listing: true,
        ownerUser: true,
        chatUser: true,
      },
    });

    return res.json({ chat: chatWithData });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

//controller for getting all chat for user
export const getAllUserChat = async (req, res) => {
  try {
    const { userId } = req.auth();

    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { chatUserId: userId },
          { ownerUserId: userId },
        ],
      },
      include: {
        listing: true,
        ownerUser: true,
        chatUser: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json({ chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

//controller for adding message to chat
export const sendChatMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { chatId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        AND: [
          { id: chatId },
          { OR: [{ chatUserId: userId }, { ownerUserId: userId }] },
        ],
      },
      include: { listing: true, ownerUser: true, chatUser: true },
    });

    if (!chat) {
      return res.status(404).json({ message: "chat not found" });
    } else if (chat.listing.status !== "active") {
      return res.status(400).json({ message: `Listing is ${chat.listing.status}` });
    }

    const newMessage = {
      message,
      sender_id: userId,
      chatId,
      createdAt: new Date(),
    };

    await prisma.message.create({
      data: newMessage,
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: newMessage.message,
        isLastMessageRead: false,
        lastMessageSenderId: userId,
      },
    });

    return res.json({ message: "Message Sent", newMessage });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

