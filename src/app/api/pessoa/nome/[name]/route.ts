import { NextRequest, NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import { log } from 'console';

type FindByName = {
    name: string;
}

export async function GET(req: NextRequest, context: {params: FindByName}) {
    try{
        log(context.params.name);
        const pessoas = await prisma.pessoa.findMany({
            where: {
                nome: {
                    contains: context.params.name
                }
            }
        });
        return new NextResponse(JSON.stringify(pessoas), {
            status: 200,
        });
    }catch(e) {
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }

}