import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth-options";

export default async function protectedRoute(req: NextRequest) {
    const session = await getServerSession(authOptions);
    
    if (!session) 
        return false

    return true;
}