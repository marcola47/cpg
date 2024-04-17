import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import protectedRoute from "./protected_route";

export async function GET(req: NextRequest) {
  if(!await protectedRoute(req)){
    return new NextResponse(JSON.stringify({error: "Unauthorized"}), {
      status: 401,
    });
  }

  const pessoas = await prisma.pessoa.findMany();

  return new NextResponse(JSON.stringify(pessoas), {
    status: 200,
  });
}

