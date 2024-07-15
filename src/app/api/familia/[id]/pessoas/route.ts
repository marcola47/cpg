import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getDescendants() {
    
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const peopleIds = await prisma.familiaPessoa.findMany({
            where: {
                familiaId: params.id
            }
        })

        const people = await prisma.pessoa.findMany({
            orderBy: {
                dataNascimento: "asc"
            },
            where: {
                id: {
                    in: peopleIds.map(p => p.pessoaId)
                }
            },
            include: {
                genitor: {
                    select: {
                        nome: true
                    }
                },
                genitora: {
                    select: {
                        nome: true
                    }
                },
                esposo: {
                    select: {
                        esposaId: true
                    }
                },
                esposa: {
                    select: {
                        esposoId: true
                    }
                },
                paiDe: {
                    select: {
                        id: true
                    }
                },
                maeDe: {
                    select: {
                        id: true
                    }
                },
            }
        })

        const orderedPeople: Person[] = [];
        console.log(people.map(p => p.nome))

        return new NextResponse(
            JSON.stringify(people), 
            { status: 200 }
        );
    }

    catch (e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
}