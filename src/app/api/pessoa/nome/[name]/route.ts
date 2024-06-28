import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
 
type FindByName = {
    name: string;
}

export async function GET(req: NextRequest, context: {params: FindByName}) {
    try {
        const pessoas = await prisma.pessoa.findMany({
            where: {
                nome: {
                    contains: context.params.name
                }
            }
        });

        return new NextResponse(
            JSON.stringify(pessoas),
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