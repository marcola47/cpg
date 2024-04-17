import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { log } from "console";

export default async function protectedRoute(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return false
    }

    return true;

}