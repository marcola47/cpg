import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FindById = {
    idEsposo: string;
    idEsposa: string;
};

export async function GET(req: NextRequest, context: { params: FindById }) {
    try {
        const filhos = await prisma.pessoa.findMany({
            where: {
                AND: [
                    { genitoraId: context.params.idEsposa },
                    { genitorId: context.params.idEsposo }
                ]
            }
        });

        return new NextResponse(JSON.stringify(filhos), {
            status: 200,
        });
    }
    
    catch(e) {
        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: 500 }
        );
    }
}