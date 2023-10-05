import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/type";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  // @ts-ignore
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const reqBody = await req.json();
    const { items, email } = reqBody;
    const extractingItems = await items.map((item: Product) => ({
      quantity: item.quantity,
      price_data: {
        currency: "inr",
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
          description: item.description,
          images: [item.image],
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: {
        email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Connection is active",
      id: session.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
