import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    id: string;
};

export async function GET(req: NextRequest, context: {params: FindById}) {
    try {
        const relatorio = await prisma.relatorio.findUniqueOrThrow({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(
            JSON.stringify(relatorio), 
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

export async function PUT(req: NextRequest, context: {params: FindById}) {
    try {
        const data = await req.json();
        const { 
            cpfOrdenador, 
            nomeOrdenador, 
            observacoes, 
            userId, 
            idFamilia 
        } = data;
        
        if (!cpfOrdenador || !nomeOrdenador || !userId || !idFamilia) {
            return new NextResponse(
                JSON.stringify({ error: "Dados incompletos" }), 
                { status: 400 }
            );
        }

        const r = await prisma.relatorio.findUnique({
            where: {
                id: context.params.id
            }
        });

        const relatorio = await prisma.relatorio.update({
            where: {
                id: context.params.id
            },
            data: {
                cpfOrdenador,
                nomeOrdenador,
                observacoes,
                userId,
                idFamilia
            }
        });

        return new NextResponse(
            JSON.stringify(relatorio), 
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

export async function DELETE(req: NextRequest, context: {params: FindById}) {
    try {
        const relatorio = await prisma.relatorio.delete({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(
            JSON.stringify(relatorio), 
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