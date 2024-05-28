import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

type FindById = {
    id: string;
}

export async function GET(req: NextRequest, context: {params: FindById}) {
    try{
        const pessoa = await prisma.user.findFirstOrThrow({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(JSON.stringify(pessoa), {
            status: 200,
        });
    }catch(e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
    
}

export async function PUT(req: NextRequest, context: {params: FindById}) {
    try{
        const data = await req.json();
        let {nome, email, password} = data;

        password = bcrypt.hashSync(password, 10);

        const pessoa = await prisma.user.update({
            where: {
                id: context.params.id
            },
            data: {
                nome,
                email,
                password
            }
        });

        return new NextResponse(JSON.stringify(pessoa), {
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
        const pessoa = await prisma.user.delete({
            where: {
                id: context.params.id
            }
        });

        return new NextResponse(JSON.stringify(pessoa), {
            status: 200,
        });
    }
    catch(e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
        });
    }
}