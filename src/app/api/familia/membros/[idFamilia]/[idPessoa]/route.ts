import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    idFamilia: string;
    idPessoa: string;
}

export async function GET(req: NextRequest, context: {params: FindById}) {
    try{
        const membroFamilia = await prisma.familiaPessoa.findFirstOrThrow({
            where: {
                AND: [
                    {familiaId: context.params.idFamilia},
                    {pessoaId: context.params.idPessoa}
                ]
            },
            include: {
                pessoa: true,
                familia: true
            }
        });

       

        return new NextResponse(JSON.stringify(membroFamilia), {
            status: 200,
        });
        
    }catch(e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
    
}

export async function DELETE(req: NextRequest, context: {params: FindById}) {
    try{
        const membroFamilia = await prisma.familiaPessoa.delete({
            where: {
                pessoaId_familiaId: {
                    familiaId: context.params.idFamilia,
                    pessoaId: context.params.idPessoa
                }
            }
        });

        return new NextResponse(JSON.stringify(membroFamilia), {
            status: 200,
        });
    }catch(e){
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
}