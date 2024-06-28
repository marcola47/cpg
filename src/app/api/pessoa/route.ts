import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const pessoas = await prisma.pessoa.findMany();
  
    return new NextResponse(
        JSON.stringify(pessoas), 
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
    
    try {
        const data: Pessoa = await req.json();
        const pessoa = await prisma.pessoa.create({ data })

        if (data.genitorId || data.genitoraId) {
            const familias = await prisma.familiaPessoa.findMany({
                where: {
                    OR:[
                        { pessoaId: data.genitorId },
                        { pessoaId: data.genitoraId }
                    ]
                }
            });
        }

        if (data.idEsposa) {
            const casamento = await prisma.casamento.create({
                data: {
                    esposaId: data.idEsposa,
                    esposoId: pessoa.id,
                    dataCasamento: data.dataCasamento,
                    localCasamento: data.localCasamento
                }
            });
        }
        
        else if (data.idEsposo) {
            const casamento = await prisma.casamento.create({
                data: {
                    esposaId: pessoa.id,
                    esposoId: data.idEsposo,
                    dataCasamento: data.dataCasamento,
                    localCasamento: data.localCasamento
                }
            });
        }

        return new NextResponse(
            JSON.stringify(pessoa), 
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