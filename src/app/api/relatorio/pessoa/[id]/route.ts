import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    id: string;
};

interface Ancestral extends PessoaPrisma{
    grau: number;
}

async function findAncestors(id: string, ancestors: Ancestral[], level: number) {
    const pessoa = await prisma.pessoa.findFirst({
        where: {
            id
        }
    });

    if(!pessoa){
        return ancestors;
    }

    ancestors.push({...pessoa, grau: level});
    if(pessoa.genitorId){
        await findAncestors(pessoa.genitorId, ancestors, level + 1);
    }

    if(pessoa.genitoraId){
        await findAncestors(pessoa.genitoraId, ancestors, level + 1);
    }

    return ancestors;
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
        let FatherAncestors;
        let MotherAncestors;

        if(pessoa.genitorId)
            FatherAncestors = await findAncestors(pessoa.genitorId, [], 1);
        if(pessoa.genitoraId)
            MotherAncestors = await findAncestors(pessoa.genitoraId, [], 1);

        return new NextResponse(JSON.stringify({
            "Materno": MotherAncestors,
            "Paterno": FatherAncestors,
            "Nome": pessoa.nome,
        }), {
            status: 200,
        });
        
    }catch(e) {
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }

} 