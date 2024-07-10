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
            throw new Error("Alguns dados da requisição estão faltando")
        
        const pessoa = await prisma.pessoa.create({ 
            data: {
                nome: data.nome,

            } 
        })

        if (!data.genitorId) {
            const familia = await prisma.familia.upsert({
                where: {
                    nome: data.genitorFamilia
                },
                update: {
                    nome: data.genitorFamilia
                },
                create: {
                    nome: data.genitorFamilia
                }
            })
            
            if (!familia)
                throw new Error("Não foi possível criar a familia do genitor")

            await prisma.familiaPessoa.create({
                data: {
                    pessoaId: pessoa.id,
                    familiaId: familia.id,
                }
            })
        }

        if (!data.genitorId) {
            const familia = await prisma.familia.upsert({
                where: {
                    nome: data.genitoraFamilia
                },
                update: {
                    nome: data.genitoraFamilia
                },
                create: {
                    nome: data.genitoraFamilia
                }
            })
            
            if (!familia)
                throw new Error("Não foi possível criar a familia da genitora")

            await prisma.familiaPessoa.create({
                data: {
                    pessoaId: pessoa.id,
                    familiaId: familia.id,
                }
            })
        }

        if (data.gender === "male") {
            for (const partner of data.partners) {
                await prisma.casamento.create({
                    data: {
                        esposaId: partner.person.id,
                        esposoId: pessoa.id,
                        dataCasamento: partner.date,
                        localCasamento: partner.place
                    }
                })
            }
        }

        else {
            for (const partner of data.partners) {
                await prisma.casamento.create({
                    data: {
                        esposoId: partner.person.id,
                        esposaId: pessoa.id,
                        dataCasamento: partner.date,
                        localCasamento: partner.place
                    }
                })
            }
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

export async function PATCH(req: NextRequest) {
    try {

    }

    catch (e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    } 
}