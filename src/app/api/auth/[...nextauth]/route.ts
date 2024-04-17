import prisma from "@/lib/prisma"
import { AuthOptions, Awaitable } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'


export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
    },

    jwt: {
        secret: process.env.JWT_SECRET
    },

    secret: process.env.JWT_SECRET,
    
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "mail@mail.com"
                },
                password: {
                    label: "Senha",
                    type: "password"
                }
            },

            async authorize(credentials: Record<string, string> | undefined){
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email
                    }
                });

                if(!user || credentials?.password === undefined){
                    return null;
                }

                const isValid = await bcrypt.compare(credentials?.password, user.password);
                if(isValid){
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.nome
                    }
                }

                return null;
            }
        })
    ]
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};


