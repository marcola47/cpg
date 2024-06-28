import prisma from "@/lib/prisma"
import { AuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },

    jwt: {
        secret: process.env.JWT_SECRET
    },

    secret: process.env.JWT_SECRET,
    adapter: PrismaAdapter(prisma) as Adapter,
    
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
                if(isValid) {
                    return user;
                }

                return null;
            }
        })
    ],

    callbacks: {
        async jwt({token, user}: {token: any, user: any}) {
            if (user) {
                token.sub = user.id;
            }

            return token;
        },

        async session({session, token}) {
            if (token) {
                session.user.id = token.sub as string;
            }

            return session;
        }, 
      
    }
}