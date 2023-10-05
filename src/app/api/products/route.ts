import { NextResponse } from "next/server";
import { productData } from "@/constants/data";

export const GET = async () => {
  try {
    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      productData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Product loading failed" },
      { status: 500 }
    );
  }
};
