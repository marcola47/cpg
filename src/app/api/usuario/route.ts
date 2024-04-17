import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest){
    const data = await req.json();
    let { email, password, nome } = data;
    try{
        password = await bcrypt.hash(password, 10);
        const pessoa = await prisma.user.create({
            data: {
                email,
                password,
                nome
            }
        });

        if(pessoa === null || !pessoa){
            return new NextResponse(JSON.stringify({error: "Erro ao criar usuário"}), {
                status: 400,
            });
        }

        return new NextResponse(JSON.stringify({
            "message": "Usuário criado com sucesso!"
        }), {
            status: 201,
        });
    }catch(e){
        const msgError = (e as PrismaClientKnownRequestError).message;

        return new NextResponse(JSON.stringify({error: msgError}), {
            status: 500,
        });
    }
}

export async function GET(req: NextRequest) {
    const pessoas = await prisma.user.findMany();

    pessoas.forEach(pessoa => {
        pessoa.password = '';
    });

    return new NextResponse(JSON.stringify(pessoas), {
        status: 200,
    });
}