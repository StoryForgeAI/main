import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",          // <--- EZ VÁLTOZOTT
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price: "prod_ToZ9XN97yrnQGx",            // <--- Dashboard Price ID
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
