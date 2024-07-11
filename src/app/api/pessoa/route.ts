import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const pessoas = await prisma.pessoa.findMany();
  
    return new NextResponse(
        JSON.stringify(pessoas), 
        { status: 200 }
    );
}

const parseDate = (dateString: string): Date | null => {
    if (!dateString)
        return null;
    
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return isNaN(date.getTime()) ? null : date;
};

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data)
            throw new Error("Alguns dados da requisição estão faltando")
        
        if (data.observacoes.length > 0) {
            data.observacoesObj = data.observacoes.reduce((acc: any, obs: any) => {
                acc[obs.key] = obs.value;
                return acc;
            }, {} as Record<string, string>)
        }

        await prisma.$transaction(async prisma => {
            const pessoa = await prisma.pessoa.create({ 
                data: {
                    nome: data.nome,
                    ...(data.genitorId && { genitorId: data.genitorId }),
                    ...(data.genitoraId && { genitoraId: data.genitoraId }),
                    
                    dataNascimento: parseDate(data.dataNascimento),
                    localNascimento: data.localNascimento,
                    dataBatismo: parseDate(data.dataBatismo),
                    localBatismo: data.localBatismo,
                    dataFalecimento: parseDate(data.dataFalecimento),
                    localFalecimento: data.localFalecimento,
                    observacoes: data.observacoesObj
                } 
            })
    
            if (data.genitorId || data.genitoraId) {
                const familias = await prisma.familiaPessoa.findMany({
                    where: {
                        OR:[
                            { pessoaId: data.genitorId },
                            { pessoaId: data.genitoraId }
                        ]
                    }
                });
                    
                for (const familia of familias) {
                    const f = await prisma.familiaPessoa.findFirst({
                        where: {
                            familiaId: familia.familiaId,
                            pessoaId: pessoa.id
                        }
                    })
                    
                    if (!f) {
                        await prisma.familiaPessoa.create({
                            data: {
                                familiaId: familia.familiaId,
                                pessoaId: pessoa.id
                            }
                        })
                    }
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
    
                await prisma.pessoa.update({
                    where: {
                        id: pessoa.id
                    },
                    data: {
                        genitorFamilia: familia.id
                    }
                })

                const f = await prisma.familiaPessoa.findFirst({
                    where: {
                        familiaId: familia.id,
                        pessoaId: pessoa.id
                    }
                })
    
                if (!f) {
                    await prisma.familiaPessoa.create({
                        data: {
                            pessoaId: pessoa.id,
                            familiaId: familia.id,
                        }
                    })
                }
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
    
                await prisma.pessoa.update({
                    where: {
                        id: pessoa.id
                    },
                    data: {
                        genitoraFamilia: familia.id
                    }
                })

                const f = await prisma.familiaPessoa.findFirst({
                    where: {
                        familiaId: familia.id,
                        pessoaId: pessoa.id
                    }
                })
    
                if (!f) {
                    await prisma.familiaPessoa.create({
                        data: {
                            pessoaId: pessoa.id,
                            familiaId: familia.id,
                        }
                    })
                }
            }
    
            if (data.genero === "male") {
                for (const casamento of data.casamentos) {
                    await prisma.casamento.create({
                        data: {
                            esposaId: casamento.person.id,
                            esposoId: pessoa.id,
                            dataCasamento: parseDate(casamento.date),
                            localCasamento: casamento.place
                        }
                    })
                }
            }
    
            else {
                for (const casamento of data.casamentos) {
                    await prisma.casamento.create({
                        data: {
                            esposaId: pessoa.id,
                            esposoId: casamento.person.id,
                            dataCasamento: parseDate(casamento.date),
                            localCasamento: casamento.place
                        }
                    })
                }
            }
        })
        
        return new NextResponse(
            JSON.stringify("ok"), 
            { status: 201 }
        );
    }

    catch (e) {
        console.log(e)

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