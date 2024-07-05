import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindByIdFamilia = {
    idFamilia: string;
}

export async function GET(req: NextRequest, context: { params: FindByIdFamilia }) {
    try {
        const pessoas = await prisma.familiaPessoa.findMany({
            where: {
                familiaId: context.params.idFamilia
            }, 
            select:{ 
                pessoa: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            }
        });
    
        return new NextResponse(
            JSON.stringify(pessoas), 
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

export async function POST(req: NextRequest, context: { params: FindByIdFamilia }) {
    try {
        const { idPessoa } = await req.json();

        const familiaPessoa = await prisma.familiaPessoa.create({
            data: {
                familiaId: context.params.idFamilia,
                pessoaId: idPessoa
            },
        });

        return new NextResponse(
            JSON.stringify(familiaPessoa), 
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