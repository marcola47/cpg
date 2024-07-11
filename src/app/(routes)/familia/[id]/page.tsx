"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import { FaUserPlus, FaMagnifyingGlass } from "react-icons/fa6";
import PageLoading from "@/app/loading";
import PageError from "@/app/error";
import Form from "@/app/components/Form";
import { Btn } from "@/app/components/Btn";

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export default function Page({ params }: { params: { id: string } }): JSX.Element {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    const [formShown, setFormShown] = useState<boolean>(false);
    
    const [family, setFamily] = useState<Family | null>(null);
    const [people, setPeople] = useState<Person[]>([]);

    const [filter, setFilter] = useState<string>("");
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([])

    useEffect(() => {
        if (params.id) {
            getFamily(params.id);
            getPeople(params.id);
        }
    }, [])

    useEffect(() => {
        setFilteredPeople(people.filter(p => p.nome.toLowerCase().includes(filter.toLowerCase())))
    }, [])

    if (loading)
        return <PageLoading/>

    if (error || !family) {
        return (
            <PageError
                error={ error }
                reset={ () => { router.refresh() } }
            />
        )
    }

    return (
        <div className={ clsx(app.page, s.page) }>
            {
                formShown &&
                createPortal(
                    <div className={ clsx(app.backdrop) }>
                        <Form
                            type="create"
                            location="modal"
                            onClose={ () => setFormShown(false) }
                        />
                    </div>, 
                    document.body
                )
            }
            
            <div className={ clsx(s.header) }>
                <div className={ clsx(s.subtitle) }>
                    Família
                </div>

                <div className={ clsx(s.title) }>
                    { family.nome }
                </div>
            </div>

            <div className={ clsx(s.controls) }>
                <div className={ clsx(s.searchbar) }>
                    <FaMagnifyingGlass className={ clsx(s.icon) }/>

                    <input 
                        className={ clsx(s.input) }
                        type="text" 
                        name="filter" 
                        id="filter"
                        placeholder="Digite o nome da pessoa"
                        value={ filter }
                        onChange={ e => setFilter(e.currentTarget.value) } 
                    />
                </div>

                <Btn
                    onClick={ () => setFormShown(true) }

                    color="black"
                    borderColor="black"

                    text="ADICIONAR PESSOA"
                    icon={ <FaUserPlus/> }
                    iconColor="black"
                    
                    transition="shadow"
                    thin
                />
            </div>

            <div className={ clsx(s.people) }>
                {
                    people.length <= 0 &&
                    <div className={ clsx(s.warning) }>
                        Esta familia ainda não possui pessoas cadastradas
                    </div>
                }
            </div>
        </div>
    )

    async function getFamily(id: string) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/familia/${id}`, {
            cache: "no-store",
            headers: {
                "Content-type": "application/json"
            }
        })
        if (!res.ok) 
            throw new Error("500_Não foi possivel buscar dados desta familia.")
    
        const data = await res.json();
        setFamily(data);
        setLoading(false);
    }
    
    async function getPeople(id: string) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/familia/${id}/pessoas`, {
            cache: "no-store",
            headers: {
                "Content-type": "application/json"
            }
        })
        if (!res.ok) 
            throw new Error("500_Não foi possivel buscar as pessoas desta família.")
    
        const data = await res.json();
        setPeople(data);
        setFilteredPeople(data);
        setLoading(false);
    }
}