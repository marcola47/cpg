import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const membros = await prisma.familiaPessoa.groupBy({
            by: ['familiaId'],
            _count: {
                familiaId: true
            }
        });

        console.log(membros)

        return new NextResponse(
            JSON.stringify(membros), 
            { status: 200 }
        );
    }

    catch (e) {
        console.log(e)

        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
    
}