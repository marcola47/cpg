import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    id: string;
}

export async function GET(req: NextRequest, context: {params: FindById}) {
    try{
        const pessoa = await prisma.pessoa.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(JSON.stringify(pessoa), {
            status: 200,
        });

    }catch(e) {
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }
}

export async function PUT(req: NextRequest, context: {params: FindById}) {
    let data = await req.json();
    try{
        const pessoa = await prisma.pessoa.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        if(!pessoa){
            return new NextResponse(JSON.stringify({error: "Pessoa não encontrada"}), {
                status: 404,
            });
        }

        data = {...pessoa, ...data};

        const p = await prisma.pessoa.update({
            where: {
                id: context.params.id
            },
            data: data
        });

        if(data.genitorId || data.genitoraId){
            const familias = await prisma.familiaPessoa.findMany({
                where: {
                    OR: [
                        {pessoaId: data.genitorId},
                        {pessoaId: data.genitoraId}
                    ]
                }
            });
            for(const f of familias){
                await prisma.familiaPessoa.create({
                    data: {
                        familiaId: f.familiaId,
                        pessoaId: p.id
                    }
                });
            } 
        }

        return new NextResponse(JSON.stringify(p), {
            status: 200,
        });
    }catch(e) {
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }

}

export async function DELETE(req: NextRequest, context: {params: FindById}) {
    try{
        const pessoa = await prisma.pessoa.delete({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(JSON.stringify(pessoa), {
            status: 200,
        });
    }catch(e) {
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }
}