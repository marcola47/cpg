import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const relatorios = await prisma.relatorio.groupBy({
            by: ['idFamilia'],
            _count: {
                id: true
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