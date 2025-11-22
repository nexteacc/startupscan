import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "test",
    ideas: [
      {
        source: "测试数据",
        strategy: "测试策略",
        marketing: "测试文案",
        market_potential: "测试市场",
        target_audience: "测试用户",
      },
    ],
  });
}
