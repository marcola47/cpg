import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    id: string;
}

export async function GET(req: NextRequest, context: {params: FindById}) {
    try {
        const pessoa = await prisma.pessoa.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(
            JSON.stringify(pessoa), 
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

export async function PUT(req: NextRequest, context: { params: FindById }) {
    try {
        const data = await req.json();
        let pessoa = await prisma.pessoa.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        if (!pessoa) {
            return new NextResponse(
                JSON.stringify({ error: "Pessoa não encontrada" }), 
                { status: 404 }
            );
        }

        pessoa = await prisma.pessoa.update({
            where: {
                id: context.params.id
            },
            data: data
        });
        
        
        if (data.genitorId != pessoa.genitorId || data.genitoraId != pessoa.genitoraId){
            let descedentes: string[] = [];
            descedentes.push(context.params.id);
            await updateDescedents(descedentes);
        }

        return new NextResponse(
            JSON.stringify(pessoa), 
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
        const pessoa = await prisma.pessoa.delete({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(
            JSON.stringify(pessoa), 
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

async function updateDescedents(descedentes: string[]) {
    const id = descedentes.shift();

    if (!id)
        return;

    const pessoa = await prisma.pessoa.findFirst({
        where: {
            id: id
        }
    })

    if (!pessoa)
        return;
    
    const descedentesPessoa = await prisma.pessoa.findMany({
        where: {
            OR: [
                { genitorId: id },
                { genitoraId: id }
            ]
        }
    });

    const familiaPessoaDelete = await prisma.familiaPessoa.deleteMany({
        where: {
            pessoaId: id
        }
    });

    const familias = await prisma.familiaPessoa.findMany({
        where: {
            OR: [
                { pessoaId: pessoa.genitorId ? pessoa.genitorId : '' },
                { pessoaId: pessoa.genitoraId? pessoa.genitoraId : '' }
            ]
        }
    });

    for (const f of familias) {
        const pessoaFamilia = await prisma.familiaPessoa.create({
            data: {
                familiaId: f.familiaId,
                pessoaId: id
            }
        });
    }

    for (const d of descedentesPessoa) {
        console.log(d.id);
        descedentes.push(d.id);
    }

    await updateDescedents(descedentes);
}