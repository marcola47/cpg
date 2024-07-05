"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { FaArrowLeft } from "react-icons/fa";
import PageError from "@/app/error";
import PageLoading from "@/app/loading";

import clsx from "clsx";
import s from "./style.module.scss";

type FormProps = {
    type: "create" | "edit";
    location: "page" | "modal";
    person?: Partial<Person>
}

export default function Form(props: FormProps): JSX.Element {
    const { type, location, person } = props;
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>("");

    const [fatherRefType, setFatherRefType] = useState<"id" | "family">("id")
    const [fatherFilter, setFatherFilter] = useState<string>("")
    const [fatherPeople, setFatherPeople] = useState<Person[]>([])
    const [fatherFamilies, setFatherFamilies] = useState<Family[]>([])

    const [motherRefType, setMotherRefType] = useState<"id" | "family">("id")
    const [motherFilter, setMotherFilter] = useState<string>("")
    const [motherPeople, setMotherPeople] = useState<Person[]>([])
    const [motherFamilies, setMotherFamilies] = useState<Family[]>([])
    
    const [partnerFilter, setParterFilter] = useState<string>("");
    const [partnerPeople, setPartnerPeople] = useState<Person[]>([])
    
    const [listFatherShown, setListFatherShown] = useState<boolean>(false);
    const [listMotherShown, setListMotherShown] = useState<boolean>(false);

    const [people, setPeople] = useState<Person[]>([])
    const [families, setFamilies] = useState<Person[]>([])

    const [name, setName] = useState<string>(person?.nome || "")
    const [fatherId, setFatherId] = useState<string>(person?.genitorId || "");
    const [fatherFamily, setFatherFamily] = useState<string>(person?.genitorFamilia || "");
    const [motherId, setMotherId] = useState<string>(person?.genitorId || "");
    const [motherFamily, setMotherFamily] = useState<string>(person?.genitorFamilia || "");

    const [birthDate, setBirthDate] = useState<string>("");
    const [birthPlace, setBirthPlace] = useState<string>("");
    const [baptismDate, setBaptismDate] = useState<string>("");
    const [baptismPlace, setBaptismPlace] = useState<string>("");
    const [deathDate, setDeathDate] = useState<string>("");
    const [deathPlace, setDeathPlace] = useState<string>("");

    // POG: Programação Orientada a Gambiarra
    useEffect(() => {
        getPeopleAndFamilies();
    }, [])

    useEffect(() => {
        if (families) {
            if (fatherFamily) {
                const family = families.find(f => f.id === fatherFamily)
    
                if (family)
                    setFatherFamily(family.nome)
            }
    
            if (motherFamily) {
                const family = families.find(f => f.id === motherFamily)
    
                if (family)
                    setFatherFamily(family.nome)
            }
        }
    }, [families])

    useEffect(() => {
        setFatherPeople(people.filter(p => p.nome.includes(fatherFilter)))
    }, [people, fatherFilter])

    useEffect(() => {
        setMotherPeople(people.filter(p => p.nome.includes(motherFilter)))
    }, [people, motherFilter])

    useEffect(() => {
        setPartnerPeople(people.filter(p => p.nome.includes(partnerFilter)))
    }, [people, partnerFilter])

    useEffect(() => {
        setFatherFamilies(families.filter(f => f.nome.includes(fatherFamily)))
    }, [families, fatherFamily])

    useEffect(() => {
        setMotherFamilies(families.filter(f => f.nome.includes(motherFamily)))
    }, [families, motherFamily])

    
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
        <form 
            className={ clsx(s.form) }
            onSubmit={ handleSubmit }
        >
            {
                location === "modal" &&
                <FaArrowLeft className={ clsx(s.close) }/>
            }

            <h2 className={ clsx(s.title) }>
                {
                    type === "create"
                    ? "CRIAR PESSOA"
                    : "EDITAR PESSOA"
                }
            </h2>       

            <div className={ clsx(s.inputs) }>
                <div className={ clsx(s.input, s.inputName) }>
                    <label 
                        className={ clsx(s.label) }
                        htmlFor="" 
                    > Nome da pessoa
                    </label>

                    <input 
                        className={ clsx(s.field) } 
                        type="text" 
                        name="name"
                        id="name"
                        placeholder="Apenas o nome sem sobrenome"
                        value={ name }
                        onChange={ e => setName(e.currentTarget.value) }
                    />
                </div>

                <div className={ clsx(s.input, s.inputFather) }>
                    <div className={ clsx(s.btns) }>
                        <button
                            className={ clsx( s.btn, fatherRefType === "id" && s.btnSelected ) }
                            onClick={ () => setFatherRefType("id") }
                        > Genitor
                        </button> 

                        <button
                            className={ clsx( s.btn, fatherRefType === "family" && s.btnSelected ) }
                            onClick={ () => setFatherRefType("family") }
                        > Familia
                        </button> 
                    </div>  

                    <input 
                        className={ clsx(s.field) } 
                        type="text" 
                        name="father"
                        id="father"
                        value={ fatherRefType === "id" ? fatherFilter : fatherFamily }
                        onChange={  fatherRefType === "id" 
                            ? e => setFatherFilter(e.currentTarget.value) 
                            : e => setFatherFamily(e.currentTarget.value)
                        }
                        onFocus={ () => {
                            setListMotherShown(true)
                            setListFatherShown(false)
                        } }
                        onBlur={ () => setListMotherShown(false) }
                    />

                    {
                        listFatherShown &&
                        <List
                            data={ fatherRefType === "id" ? fatherPeople : fatherFamilies }
                            setState={ fatherRefType === "id" ? setFatherId : setFatherFamily }
                            type={ fatherRefType === "id" ? "id" : "nome" }
                        />
                    }
                </div>

                <div className={ clsx(s.input, s.inputMother) }>
                    <div className={ clsx(s.btns) }>
                        <button
                            className={ clsx( s.btn, motherRefType === "id" && s.btnSelected ) }
                            onClick={ () => setMotherRefType("id") }
                        > Genitor
                        </button> 

                        <button
                            className={ clsx( s.btn, motherRefType === "family" && s.btnSelected ) }
                            onClick={ () => setMotherRefType("family") }
                        > Familia
                        </button> 
                    </div>  

                    <input 
                        className={ clsx(s.field) } 
                        type="text" 
                        name="mother"
                        id="mother"
                        value={ motherRefType === "id" ? motherFilter : motherFamily }
                        onChange={ motherRefType === "id" 
                            ? e => setMotherFilter(e.currentTarget.value) 
                            : e => setMotherFamily(e.currentTarget.value)
                        }
                        onFocus={ () => {
                            setListMotherShown(true)
                            setListFatherShown(false)
                        } }
                        onBlur={ () => setListMotherShown(false) }
                    />

                    {
                        listMotherShown &&
                        <List
                            data={ motherRefType === "id" ? motherPeople : motherFamilies }
                            setState={ motherRefType === "id" ? setMotherId : setMotherFamily }
                            type={ motherRefType === "id" ? "id" : "nome" }
                        />
                    }
                </div>

                <div className={ clsx(s.input, s.inputBirth) }>
                    <label 
                        className={ clsx(s.label) }
                        htmlFor="" 
                    > Nascimento
                    </label>

                    <div className={ clsx(s.fields) }>
                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="birthDate"
                            id="birthDate"
                            placeholder="DD/MM/AAAA"
                            value={ birthDate }
                            onChange={ e => setBirthDate(e.currentTarget.value) }
                        />

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="birthPlace"
                            id="birthPlace"
                            placeholder="Local"
                            value={ birthPlace }
                            onChange={ e => setBirthPlace(e.currentTarget.value) }
                        />
                    </div>
                </div>

                <div className={ clsx(s.input, s.inputBaptism) }>
                    <label 
                        className={ clsx(s.label) }
                        htmlFor="" 
                    > Batizado
                    </label>

                    <div className={ clsx(s.fields) }>
                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="baptismDate"
                            id="baptismDate"
                            placeholder="DD/MM/AAAA"
                            value={ baptismDate }
                            onChange={ e => setBaptismDate(e.currentTarget.value) }
                        />

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="baptismPlace"
                            id="baptismPlace"
                            placeholder="Local"
                            value={ baptismPlace }
                            onChange={ e => setBaptismPlace(e.currentTarget.value) }
                        />
                    </div>
                </div>

                <div className={ clsx(s.input, s.inputDeath) }>
                    <label 
                        className={ clsx(s.label) }
                        htmlFor="" 
                    > Óbito
                    </label>

                    <div className={ clsx(s.fields) }>
                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="deathDate"
                            id="deathDate"
                            placeholder="DD/MM/AAAA"
                            value={ deathDate }
                            onChange={ e => setDeathDate(e.currentTarget.value) }
                        />

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="deathPlace"
                            id="deathPlace"
                            placeholder="Local"
                            value={ deathPlace }
                            onChange={ e => setDeathPlace(e.currentTarget.value) }
                        />
                    </div>
                </div>
            </div>
        </form>
    )

    type ListProps = {
        data: Person[] | Family[],
        setState: StateSetter<string>,
        type: "id" | "nome",
    }

    function List(props: ListProps): JSX.Element {
        const { data, setState, type } = props;
        
        return (
            <ul className={ s.list }>
                {
                    data.map(item => (
                        <li 
                            className={ s.item }
                            key={ item.id }
                            onClick={ () => setState(item[type]) }
                        > { item.nome }
                        </li>
                    ))
                }
            </ul>
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    async function getPeopleAndFamilies() {
        const resPeople = await fetch("/api/pessoa", {
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resPeople.ok)
            setError("500_Não foi possivel buscar as pessoas cadastradas")

        const resFamilies = await fetch("/api/familia", {
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resFamilies.ok)
            setError("500_Não foi possivel buscar as familias cadastradas")

        const dataPeople = await resPeople.json();
        const dataFamilies = await resFamilies.json();
        
        setPeople(dataPeople);
        setFamilies(dataFamilies);
        setLoading(false);
    }
}