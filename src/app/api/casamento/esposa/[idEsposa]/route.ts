import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    idEsposa: string;
};

export async function GET(req: NextRequest, context: { params: FindById }) {
    try {
        const casamento = await prisma.casamento.findMany({
            where: {
                esposaId: context.params.idEsposa
            }
        });

        if (!casamento) {
            return new NextResponse(JSON.stringify({ error: "Casamentos não encontrado" }), {
                status: 404,
            });
        }

        return new NextResponse(JSON.stringify(casamento), {
            status: 200,
        });
    }catch(e){
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
    
}