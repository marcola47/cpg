import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    idEsposo: string;
    idEsposa: string;
};

export async function GET(req: NextRequest, context: { params: FindById }) {
    try {
        const casamento = await prisma.casamento.findFirst({
            where: {
                AND: [
                    { esposoId: context.params.idEsposo },
                    { esposaId: context.params.idEsposa }
                ]
            }
        });

        if (!casamento) {
            return new NextResponse(
                JSON.stringify({ error: "Casamento não encontrado" }), 
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify(casamento), 
            { status: 200 }
        );
    }
    
    catch(e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, context: { params: FindById }) {
    try {
        const data = await req.json();
        
        const casamento = await prisma.casamento.update({
            where: {
                esposoId_esposaId: {
                    esposoId: context.params.idEsposo,
                    esposaId: context.params.idEsposa
                }
            },
            data : {
                dataCasamento: data.dataCasamento,
                localCasamento: data.localCasamento
            }
        });

        return new NextResponse(JSON.stringify(casamento), {
            status: 200,
        });
    }

    catch (e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: { params: FindById }) {
    try {
        const casamento = await prisma.casamento.delete({
            where: {
                esposoId_esposaId: {
                    esposoId: context.params.idEsposo,
                    esposaId: context.params.idEsposa
                }
            }
        });

        return new NextResponse(
            JSON.stringify(casamento), 
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