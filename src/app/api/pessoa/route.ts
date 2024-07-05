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
        const data = await req.json();

        if (!data)
            throw new Error("")
        
        const pessoa = await prisma.pessoa.create({ 
            data 
        })

        if (!data.genitorId) {
            const familia = await prisma.familia.findUnique({
                where: {
                    id: data.genitorFamilia
                }
            })

            if (!familia)
                throw new Error("Não foi possível encontrar a familia do genitor")

            await prisma.familiaPessoa.create({
                data: {
                    pessoaId: pessoa.id,
                    familiaId: familia.id,
                }
            })
        }

        if (!data.genitoraId) {
            const familia = await prisma.familia.findUnique({
                where: {
                    id: data.genitoraFamilia
                }
            })

            if (!familia)
                throw new Error("Não foi possível encontrar a familia da genitora")

            await prisma.familiaPessoa.create({
                data: {
                    pessoaId: pessoa.id,
                    familiaId: familia.id
                }
            })
        }

        if (data.idEsposa) {
            await prisma.casamento.create({
                data: {
                    esposaId: data.idEsposa,
                    esposoId: pessoa.id,
                    dataCasamento: data.dataCasamento,
                    localCasamento: data.localCasamento
                }
            });
        }
        
        else if (data.idEsposo) {
            await prisma.casamento.create({
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