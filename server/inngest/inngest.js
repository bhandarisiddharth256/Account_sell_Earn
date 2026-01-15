import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create Inngest client
export const inngest = new Inngest({ id: "ACCOUNT_SELL_EARN" });

// ✅ User created
const SyncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    const user = await prisma.user.findFirst({
      where: { id: data.id },
    });

    const userData = {
      id: data.id,
      email: data?.email_addresses?.[0]?.email_address ?? "",
      name: `${data?.first_name ?? ""} ${data?.last_name ?? ""}`,
      image: data?.image_url ?? "",
    };

    if (user) {
      await prisma.user.update({
        where: { id: data.id },
        data: userData,
      });
      return;
    }

    await prisma.user.create({ data: userData });
  }
);

// ✅ User deleted
const SyncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    const listings = await prisma.listing.findMany({
      where: { ownerId: data.id },
    });

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ ownerUserId: data.id }, { chatUserId: data.id }],
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: data.id },
    });

    if (
      listings.length === 0 &&
      chats.length === 0 &&
      transactions.length === 0
    ) {
      await prisma.user.delete({ where: { id: data.id } });
    } else {
      await prisma.listing.updateMany({
        where: { ownerId: data.id },
        data: { status: "inactive" },
      });
    }
  }
);

// ✅ User updated
const SyncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses?.[0]?.email_address ?? "",
        name: `${data?.first_name ?? ""} ${data?.last_name ?? ""}`,
        image: data?.image_url ?? "",
      },
    });
  }
);

export const functions = [
  SyncUserCreation,
  SyncUserDeletion,
  SyncUserUpdation,
];
