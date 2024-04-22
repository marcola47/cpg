import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    id: string;
};

async function findAncestors(id: string, ancestry: PessoaPrisma[]): Promise<PessoaPrisma[]> {
    const pessoa: PessoaPrisma | null = await prisma.pessoa.findUnique({
        where:{
            id
        }
    })

    if(!pessoa){
        return ancestry;
    }

    ancestry.push(pessoa);

    if(pessoa.genitorId){
        await findAncestors(pessoa.genitorId, ancestry);
    }

    if(pessoa.genitoraId){
        await findAncestors(pessoa.genitoraId, ancestry);
    }

    return ancestry;
    
}

export async function GET(req: NextRequest, context: { params: FindById }) {
    try{
        let pessoa: PessoaPrisma = await prisma.pessoa.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        if(!pessoa){
            return new NextResponse(JSON.stringify({error: "Pessoa não encontrada"}), {
                status: 404,
            });
        }

        let familiaMaterna;
        let familiaPaterna;

        if(pessoa.genitorId){
             familiaPaterna = await findAncestors(pessoa.genitorId, []); // [pessoa
        }
        
        if(pessoa.genitoraId){
            familiaMaterna = await findAncestors(pessoa.genitoraId, []);
        }
        

        const familia = {
            "materna": familiaMaterna?.map(p => p.nome),
            "paterna": familiaPaterna?.map(p => p.nome),
            "pessoa": pessoa
        }


        return new NextResponse(JSON.stringify({familia}), {
            status: 200,
        });
        
    }catch(e) {
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }

} 