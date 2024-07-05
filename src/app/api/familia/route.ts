import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const familias = await prisma.familia.findMany();

        return new NextResponse(
            JSON.stringify(familias), 
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

export async function POST(req: NextRequest) {
    try {
        const { nome } = await req.json();
        const trimmedName = nome.trim();

        const familia = await prisma.familia.create({
            data: {
                nome: trimmedName
            },
        });

        return new NextResponse(
            JSON.stringify(familia), 
            { status: 201 }
        );
    } 
    
    catch (e: any) {
        const status = e.code === "P2002"
        ? 409
        : 500

        return new NextResponse(
            JSON.stringify({ error: e }), 
            { status: status }
        );
    }
}