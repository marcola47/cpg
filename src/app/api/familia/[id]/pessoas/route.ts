import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const peopleIds = await prisma.familiaPessoa.findMany({
            where: {
                familiaId: params.id
            }
        })

        const people = await prisma.pessoa.findMany({
            where: {
                id: {
                    in: peopleIds.map(p => p.pessoaId)
                }
            },
            include: {
                esposo: true,
                esposa: true,
                paiDe: true,
                maeDe: true,
            }
        })

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