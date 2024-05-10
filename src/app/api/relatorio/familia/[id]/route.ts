import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { log } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


type FindById = {
    id: string;
};

async function getDescendants(descendants: string[], family: {[key: string]: {[key: string] : any }}) {
    const id: string | undefined = descendants.shift();
    if (!id) {
        return;
    }
    const filhos = await prisma.pessoa.findMany({
        where: {
            OR: [
                {
                    genitorId: id
                },
                {
                    genitoraId: id
                }
            ]
        },
        orderBy: {
            dataNascimento: 'asc'
        },
    });
    const conjuges = await prisma.casamento.findMany({
        where: {
            OR: [
                {
                    esposoId: id
                },
                {
                    esposaId: id
                }
            ]
        }, orderBy: {
            dataCasamento: 'asc'
        }
    });
    
    family[id] = {
        filhos: [],
        conjuges: []
    }

    for(let c of conjuges){
        family[id].conjuges.push(
            c.esposoId === id ? c.esposaId : c.esposoId
        );
    }

    for(let f of filhos){
        family[id].filhos.push({
            id: f.id,
            nome: f.nome
        });
        descendants.push(f.id);
    }
    await getDescendants(descendants, family);
}

export async function POST(req: NextRequest, context: { params: FindById }) {
    try{
/* 
        const data = await req.json();
        const { cpfOrdenador, nomeOrdenador, observacoes } = data;

        if(!cpfOrdenador || !nomeOrdenador){
            return new NextResponse(JSON.stringify({error: "Cpf ou Nome não informados"}), {
                status: 400,
            });
        }

        const user = await getServerSession(authOptions);
        
        if (!user) {
            return new NextResponse(JSON.stringify({ error: "Não autorizado" }), {
                status: 401,
            });
        } */
        
        const familia = await prisma.familia.findFirst({
            where: {
                id: context.params.id
            }
        });
        
        if(!familia){
            return new NextResponse(JSON.stringify({error: "Familia não encontrada"}), {
                status: 404,
            });
        }

        const PrimeiraPessoa = await prisma.familiaPessoa.findFirst({
            where: {
                familiaId: familia.id
                },
                include: {
                    pessoa: true
                }
            });

        if(!PrimeiraPessoa){
            return new NextResponse(JSON.stringify({error: "Familia sem pessoas"}), {
                status: 404,
            });
        }

        let descendants: string[] = [];
        let family: {[key:string]: { [key: string] : [{}]}} = {};
        descendants.push(PrimeiraPessoa.pessoa.id);
        await getDescendants(descendants, family);

        

        return new NextResponse(JSON.stringify(family), {
            status: 200,
        });
    }catch(e){
        return new NextResponse(JSON.stringify({error: e}), {
            status: 404,
        });
    }
}
