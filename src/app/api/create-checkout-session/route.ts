import { NextRequest, NextResponse } from "next/server";
import { Creem } from "creem";

const PRODUCT_ID = "prod_RHh2KVDzjGj7Quow1ronZ";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
          details: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    if (!process.env.CREEM_API_KEY) {
      return NextResponse.json(
        { error: "CREEM_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const creemMode = isProduction ? "live" : "sandbox";

    console.log("Creating checkout session:", {
      email,
      mode: creemMode,
      environment: process.env.NODE_ENV ?? "development",
    });

    const creem = new Creem({
      debugLogger: console,
    });

    const result = await creem.createCheckout({
      xApiKey: process.env.CREEM_API_KEY,
      createCheckoutRequest: {
        productId: PRODUCT_ID,
        units: 1,
        customer: { email },
      },
    });

    console.log("Checkout session created successfully:", {
      checkoutUrl: result.checkoutUrl,
      mode: creemMode,
    });

    return NextResponse.json({
      url: result.checkoutUrl,
      mode: creemMode,
      environment: process.env.NODE_ENV ?? "development",
    });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
        mode: process.env.NODE_ENV === "production" ? "live" : "sandbox",
      },
      { status: 500 }
    );
  }
}
