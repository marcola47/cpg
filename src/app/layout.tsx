import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { Toaster } from "sonner";
import SessionProvider from "@/app/contexts/Session";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

const montserrat = Montserrat({ 
    subsets: ["latin"], 
    variable: "--font-montserrat",
    display: "swap"
})

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession(authOptions);
    
    return (
        <html 
            lang="en"
            className={ montserrat.className }
        >
            <body className="app">
                <SessionProvider session={ session }>
                    { children }

                    <Toaster
                        position="top-center"
                        expand={ true }
                        richColors
                        closeButton
                    />
                </SessionProvider>
            </body>
        </html>
    );
}
