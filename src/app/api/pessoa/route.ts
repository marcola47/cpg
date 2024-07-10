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
                ...(data.genitorId ? { genitorId: data.genitorId } : { genitorFamilia: data.genitorFamilia }),
                ...(data.genitoraId ? { genitoraId: data.genitoraId } : { genitoraFamilia: data.genitoraFamilia }),

                dataNascimento: data.dataNascimento,
                localNascimento: data.localNascimento,
                dataBatismo: data.dataBatismo,
                localBatismo: data.localBatismo,
                dataFalecimento: data.dataFalecimento,
                localFalecimento: data.localFalecimento,
            } 
        })

        if (data.genitorId || data.genitoraId) {
            const familias = await prisma.familiaPessoa.findMany({
                where: {
                    OR:[
                        {
                            pessoaId: data.genitorId
                        },
                        {
                            pessoaId: data.genitoraId
                        }
                    ]
                }
            });
            
            for (const f of familias) {
                await prisma.familiaPessoa.create({
                    data: {
                        familiaId: f.familiaId,
                        pessoaId: pessoa.id
                    }
                })
            }
        }

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

        if (!data.genitoraId) {
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

        if (data.genero === "male") {
            for (const parceiro of data.parceiros) {
                await prisma.casamento.create({
                    data: {
                        esposaId: parceiro.person.id,
                        esposoId: pessoa.id,
                        dataCasamento: parceiro.date,
                        localCasamento: parceiro.place
                    }
                })
            }
        }

        else {
            for (const parceiro of data.parceiros) {
                await prisma.casamento.create({
                    data: {
                        esposaId: pessoa.id,
                        esposoId: parceiro.person.id,
                        dataCasamento: parceiro.date,
                        localCasamento: parceiro.place
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