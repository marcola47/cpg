import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const relatorios = await prisma.relatorio.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return new NextResponse(
            JSON.stringify(relatorios), 
            { status: 200 }
        );
    }

    catch (e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
    
}