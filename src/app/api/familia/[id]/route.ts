import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type FindById = {
    id: string;
}

export async function GET(req: NextRequest, context: {params: FindById}) {
    try{
        const familia = await prisma.familia.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(JSON.stringify(familia), {
            status: 200,
        });
        
    }catch(e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
}

export async function PUT(req: NextRequest, context: {params: FindById}) {
    const data = await req.json();
    try{
        const familia = await prisma.familia.update({
            where: {
                id: context.params.id
            },
            data: data
        });

        return new NextResponse(JSON.stringify(familia), {
            status: 200,
        });
    }catch(e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }

}

export async function DELETE(req: NextRequest, context: {params: FindById}) {
    try{
        const familia = await prisma.familia.delete({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(JSON.stringify(familia), {
            status: 200,
        });
    }catch(e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
}