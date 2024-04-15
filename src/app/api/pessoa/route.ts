import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const pessoas = await prisma.pessoa.findMany();

  return new NextResponse(JSON.stringify(pessoas), {
    status: 200,
  });
}

