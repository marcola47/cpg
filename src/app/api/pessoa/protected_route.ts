import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export default async function protectedRoute(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return false
    }

    return true;

}