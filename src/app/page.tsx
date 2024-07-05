"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

import PageError from "./error"
import PageLoading from "./loading";
import Searchbar from "./components/Searchbar"
import Card, { CardAdd } from "@/app/components/Card"

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss"

export default function Page(): JSX.Element | null {
    const router = useRouter();
    
    const [filter, setFilter] = useState<string>("")
    const [families, setFamilies] = useState<Family[]>([]);
    const [familiesFiltered, setFamiliesFiltered] = useState<Family[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    
    useEffect(() => {
        getFamilies();
    }, [])

    useEffect(() => {
        setFamiliesFiltered(families.filter(f => f.nome.toLowerCase().includes(filter)))
    }, [filter, families])

    if (error) {
        return (
            <PageError
                error={ error }
                reset={ () => { router.refresh() } }
            />
        )
    }

    if (loading)
        return <PageLoading/>

    return (
        <div className={ clsx(app.page, s.home) }>
            <Searchbar
                type="family"
                state={ filter }
                setState= { setFilter }
            />

            <div className={ clsx(s.grid) }>
                <CardAdd
                    families={ families }
                    setFamilies={ setFamilies }
                />

                {
                    familiesFiltered.map(family => (
                        <Card
                            key={ family.id }
                            family={ family }
                        />
                    ))
                }
            </div>
        </div> 
    )

    async function getFamilies() {
        const resFamilies = await fetch("/api/familia", {
            cache: "no-store",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resFamilies.ok)
            setError(new Error("500_Ocorreu um erro ao buscar as familias."))

        const resRelatorios = await fetch("/api/relatorio/familia/count", {
            cache: "no-store",
            headers: {
                "Content-type": "application/json"
            }
        })
        
        if (!resRelatorios.ok)
            setError(new Error("500_Ocorreu um erro ao buscar os relatórios das famílias."))
        
        const resMembros = await fetch("/api/pessoa/count", {
            cache: "no-store",
            headers: {
                "Content-type": "application/json"
            }
        })
        
        if (!resMembros.ok)
            setError(new Error("500_Ocorreu um erro ao buscar os membros das famílias."))

        const familiesData = await resFamilies.json();
        const relatoriosData = await resRelatorios.json();
        const membrosData = await resMembros.json();

        familiesData.map((f: Family) => {
            const relatorio = relatoriosData.find((r: any) => r.idFamilia === f.id)
            f.relatorios = relatorio ? relatorio._count.id : 0
            
            const membros = membrosData.find((m: any) => m.familiaId === f.id)
            f.membros = membros ? membros._count.familiaId : 0

            return f;
        })
        
        setFamilies(familiesData.sort((a: Family, b: Family) => a.nome.localeCompare(b.nome)));
        setLoading(false);
    }
}