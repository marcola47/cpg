"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import { FaUserPlus, FaMagnifyingGlass } from "react-icons/fa6";
import PageLoading from "@/app/loading";
import PageError from "@/app/error";
import Row from "@/app/components/Row";
import Form from "@/app/components/Form";
import { Btn } from "@/app/components/Btn";

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

export default function Page({ params }: { params: { id: string } }): JSX.Element {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    const [formCreateShown, setFormCreateShown] = useState<boolean>(false);
    const [formEditShown, setFormEditShown] = useState<boolean>(false);
    const [formPerson, setFormPerson] = useState<Person | undefined>()

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
    }, [filter])

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
                formCreateShown &&
                createPortal(
                    <div className={ clsx(app.backdrop) }>
                        <Form
                            type="create"
                            location="modal"
                            onClose={ () => setFormCreateShown(false) }
                        />
                    </div>, 
                    document.body
                )
            }

            {
                formEditShown &&
                createPortal(
                    <div className={ clsx(app.backdrop) }>
                        <Form
                            type="edit"
                            location="modal"
                            person={ formPerson }
                            onClose={ () => setFormEditShown(false) }
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
                    onClick={ () => setFormCreateShown(true) }

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

                {
                    people.length > 0 &&
                    <>
                        <div className={ clsx(s.labels) }>
                            <div className={ clsx(s.label, s.labelActions) }>
                                Ações
                            </div>

                            <div className={ clsx(s.label) }>
                                Pessoa
                            </div>

                            <div className={ clsx(s.label) }>
                                Genitor/Genitora
                            </div>

                            <div className={ clsx(s.label, s.labelDate) }>
                                Nascimento
                            </div>

                            <div className={ clsx(s.label, s.labelDate) }>
                                Batizado
                            </div>

                            <div className={ clsx(s.label, s.labelDate) }>
                                Óbito
                            </div>

                            <div className={ clsx(s.label, s.labelDate) }>
                                Matrimonio
                            </div>

                            <div className={ clsx(s.label, s.labelObs) }>
                                Observações
                            </div>
                        </div>

                        <div className={ clsx(s.separator) }/>

                        <div className={ clsx(s.values) }>
                            {
                                filteredPeople.map(person => (
                                    <Row
                                        key={ person.id }
                                        person={ person }
                                        showForm={ () => {
                                            setFormEditShown(true);
                                            setFormPerson(person);
                                        } }
                                    />
                                ))
                            }
                        </div>
                    </>
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
        console.log(data)

        setPeople(data);
        setFilteredPeople(data);
        setLoading(false);
    }
}