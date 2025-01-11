import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/lib/users";
import { User } from "@prisma/client";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook: ", error);
    return new Response("Error occurred during verification", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = evt.data;

    // Validate necessary fields
    if (!id || !email_addresses || email_addresses.length === 0) {
      return new Response("Error occurred -- missing data", {
        status: 400,
      });
    }

    // Construct user object
    const user = {
      clerkUserId: id,
      email: email_addresses[0]?.email_address || "",
      ...(first_name ? { firstName: first_name } : {}),
      ...(last_name ? { lastName: last_name } : {}),
      ...(image_url ? { imageUrl: image_url } : {}),
    };

    try {
      await createUser(user as User);
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error occurred while creating user", {
        status: 500,
      });
    }
  }

  return new Response("", { status: 200 });
}