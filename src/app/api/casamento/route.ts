import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const casamentos = await prisma.casamento.findMany();

        return new NextResponse(
            JSON.stringify(casamentos), 
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

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const casamento = await prisma.casamento.create({
            data: {
                dataCasamento: data.dataCasamento,
                localCasamento: data.localCasamento,
                esposoId: data.esposoId,
                esposaId: data.esposaId
            }
        });

        return new NextResponse(
            JSON.stringify(casamento), 
            { status: 201 }
        );
    }

    catch (e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
}