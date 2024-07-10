"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { FaArrowLeft, FaPlus, FaMinus, FaMagnifyingGlass, FaMars, FaVenus } from "react-icons/fa6";
import PageError from "@/app/error";
import PageLoading from "@/app/loading";
import { Btn } from "@/app/components/Btn";

import { formatDate } from "@/lib/input-functions";

import clsx from "clsx";
import s from "./style.module.scss";

type Partner = {
    person: Person,
    date?: string,
    place?: string,
}

type Observation = {
    key: string,
    value: string
}

type FormProps = {
    type: "create" | "edit";
    location: "page" | "modal";
    person?: Partial<Person>
}

export default function Form(props: FormProps): JSX.Element {
    const { type, location, person } = props;
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>("");
    
    const [people, setPeople] = useState<Person[]>([])
    const [families, setFamilies] = useState<Person[]>([])

    const [fatherListShown, setFatherListShown] = useState<boolean>(false);
    const [fatherRefType, setFatherRefType] = useState<"id" | "family">("id")
    const [fatherFilter, setFatherFilter] = useState<string>("")
    const [fatherPeople, setFatherPeople] = useState<Person[]>([])
    const [fatherFamilies, setFatherFamilies] = useState<Family[]>([])
    
    const [motherListShown, setMotherListShown] = useState<boolean>(false);
    const [motherRefType, setMotherRefType] = useState<"id" | "family">("id")
    const [motherFilter, setMotherFilter] = useState<string>("")
    const [motherPeople, setMotherPeople] = useState<Person[]>([])
    const [motherFamilies, setMotherFamilies] = useState<Family[]>([])
    
    const [partnersListShown, setPartnersListShown] = useState<boolean>(false);
    const [partnersFilter, setPartnersFilter] = useState<string>("");
    const [partnersPeople, setPartnersPeople] = useState<Person[]>([])
    
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
    
    const [gender, setGender] = useState<"male" | "female">("male")
    const [partners, setPartners] = useState<Partner[]>([]);
    const [observations, setObservations] = useState<Observation[]>([])
    const [observationKey, setObservationKey] = useState<string>("")
    const [observationValue, setObservationValue] = useState<string>("")

    // POG: Programação Orientada a Gambiarra
    useEffect(() => {
        getPeopleAndFamilies();
    }, [])

    useEffect(() => { console.log(partners) }, [partners])

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
        setFatherPeople(people.filter(p => {
            const isValidFather = !partners.map(pp => pp.person.id).includes(p.id) 
                && motherId !== p.id
                && p.nome.toLowerCase().includes(fatherFilter.toLowerCase())

            if (isValidFather)
                return p;
        }))
        
        setMotherPeople(people.filter(p => {
            const isValidMother = !partners.map(pp => pp.person.id).includes(p.id) 
                && fatherId !== p.id
                && p.nome.toLowerCase().includes(motherFilter.toLowerCase())

            if (isValidMother)
                return p;
        }))
        
        setPartnersPeople(people.filter(p => {
            const isValidPartner = !partners.map(pp => pp.person.id).includes(p.id)
                && fatherId !== p.id
                && motherId !== p.id 
                && p.nome.toLowerCase().includes(partnersFilter.toLowerCase()) 

            if (isValidPartner)
                return p;
        }))
    }, [people, fatherFilter, motherFilter, partnersFilter, partners])
    
    useEffect(() => {
        setFatherFamilies(families.filter(f => f.nome.toLowerCase().includes(fatherFamily.toLowerCase())))
    }, [families, fatherFamily])
    
    useEffect(() => {
        setMotherFamilies(families.filter(f => f.nome.toLowerCase().includes(motherFamily.toLowerCase())))
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
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={ clsx(s.input, s.inputFather) }>
                    <div className={ clsx(s.btns) }>
                        <button
                            className={ clsx( s.btn, fatherRefType === "id" && s.btnSelected ) }
                            onClick={ () => setFatherRefType("id") }
                            type="button"
                            > GENITOR
                        </button> 

                        <button
                            className={ clsx( s.btn, fatherRefType === "family" && s.btnSelected ) }
                            onClick={ () => setFatherRefType("family") }
                            type="button"
                        > FAMILIA DO GENITOR
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
                            setFatherListShown(true)
                            setMotherListShown(false)
                            setPartnersListShown(false)
                        } }
                        onBlur={ () => setFatherListShown(false) }
                        autoComplete="off"
                    />

                    {
                        fatherListShown && fatherRefType === "id" &&
                        <ul className={ s.list }>
                            {
                                fatherPeople.map(item => (
                                    <li 
                                        className={ s.item }
                                        key={ item.id }
                                        onMouseDown={ () => {
                                            setFatherId(item.id);
                                            setFatherFilter(item.nome)
                                        } }
                                    > 
                                        {
                                            item.dataNascimento &&
                                            <span>{ new Date(item.dataNascimento).getFullYear() }</span>
                                        }
            
                                        <span>{ item.nome }</span>
                                    </li>
                                ))
                            }
                        </ul>
                    }

                    {
                        fatherListShown && fatherRefType === "family" &&
                        <ul className={ s.list }>
                            {
                                fatherFamilies.map(item => (
                                    <li 
                                        className={ s.item }
                                        key={ item.id }
                                        onMouseDown={ () => setFatherFamily(item.nome) }
                                    > { item.nome }
                                    </li>
                                ))
                            }
                        </ul>
                    }
                </div>

                <div className={ clsx(s.input, s.inputMother) }>
                    <div className={ clsx(s.btns) }>
                        <button
                            className={ clsx( s.btn, motherRefType === "id" && s.btnSelected ) }
                            onClick={ () => setMotherRefType("id") }
                            type="button"
                            > GENITORA
                        </button> 

                        <button
                            className={ clsx( s.btn, motherRefType === "family" && s.btnSelected ) }
                            onClick={ () => setMotherRefType("family") }
                            type="button"
                        > FAMILIA DA GENITORA
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
                            setMotherListShown(true)
                            setFatherListShown(false)
                            setPartnersListShown(false)
                        } }
                        onBlur={ () => setMotherListShown(false) }
                        autoComplete="off"
                    />

                    {
                        motherListShown && motherRefType === "id" &&
                        <ul className={ s.list }>
                            {
                                motherPeople.map(item => (
                                    <li 
                                        className={ s.item }
                                        key={ item.id }
                                        onMouseDown={ () => {
                                            setMotherId(item.id);
                                            setMotherFilter(item.nome)
                                        } }
                                    > 
                                        {
                                            item.dataNascimento &&
                                            <span>{ new Date(item.dataNascimento).getFullYear() }</span>
                                        }
            
                                        <span>{ item.nome }</span>
                                    </li>
                                ))
                            }
                        </ul>
                    }

                    {
                        motherListShown && motherRefType === "family" &&
                        <ul className={ s.list }>
                            {
                                motherFamilies.map(item => (
                                    <li 
                                        className={ s.item }
                                        key={ item.id }
                                        onMouseDown={ () => setMotherFamily(item.nome) }
                                    > { item.nome }
                                    </li>
                                ))
                            }
                        </ul>
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
                            onChange={ e => setBirthDate(formatDate(e.currentTarget.value)) }
                            autoComplete="off"
                        />

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="birthPlace"
                            id="birthPlace"
                            placeholder="Local"
                            value={ birthPlace }
                            onChange={ e => setBirthPlace(e.currentTarget.value) }
                            autoComplete="off"
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
                            onChange={ e => setBaptismDate(formatDate(e.currentTarget.value)) }
                            autoComplete="off"
                        />

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="baptismPlace"
                            id="baptismPlace"
                            placeholder="Local"
                            value={ baptismPlace }
                            onChange={ e => setBaptismPlace(e.currentTarget.value) }
                            autoComplete="off"
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
                            onChange={ e => setDeathDate(formatDate(e.currentTarget.value)) }
                            autoComplete="off"
                        />

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="deathPlace"
                            id="deathPlace"
                            placeholder="Local"
                            value={ deathPlace }
                            onChange={ e => setDeathPlace(e.currentTarget.value) }
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className={ clsx(s.input, s.inputGender) }>
                    <label 
                        className={ clsx(s.label) }
                        htmlFor="" 
                    > Gênero
                    </label>

                    <div className={ clsx(s.btns) }>
                        <Btn
                            onClick={ () => setGender("male") }
                            classes={ gender === "male" ? clsx(s.male) : "" }
                            
                            color="blue"
                            borderColor="blue"

                            text="Masculino"
                            icon={ <FaMars/> }
                            iconColor="blue"
                            
                            transition="fill"
                            fillColor="blue"
                        />

                        <Btn
                            onClick={ () => setGender("female") }
                            classes={ gender === "female" ? clsx(s.female) : "" }

                            color="orange"
                            borderColor="orange"

                            text="Feminino"
                            icon={ <FaVenus/> }
                            iconColor="orange"
                            
                            transition="fill"
                            fillColor="orange"
                        />
                    </div>
                </div>

                <div className={ clsx(s.partners) }>
                    <div className={ clsx(s.label) }>
                        Matrimônios            
                    </div>

                    <div className={ clsx(s.searchbar) }>
                        <FaMagnifyingGlass className={ clsx(s.icon) }/>
                        <input 
                            className={ clsx(s.input) }
                            type="text" 
                            name="partnersFilter" 
                            id="partnersFilter"
                            placeholder="Digite o nome da pessoa"
                            value={ partnersFilter } 
                            onChange={ e => setPartnersFilter(e.currentTarget.value) }
                            onFocus={ () => {
                                setPartnersListShown(true)
                                setMotherListShown(false)
                                setFatherListShown(false)
                            } }
                            onBlur={ () => setPartnersListShown(false) }
                            autoComplete="off"
                        />

                        {
                            partnersListShown &&
                            <ul className={ s.list }>
                                {
                                    partnersPeople.map(item => (
                                        <li 
                                            className={ s.item }
                                            key={ item.id }
                                            onMouseDown={ () => {
                                                setPartners((prevPartners) => ([...prevPartners, { person: item }]));
                                                setPartnersFilter("")
                                            } }
                                        > 
                                            {
                                                item.dataNascimento &&
                                                <span>{ new Date(item.dataNascimento).getFullYear() }</span>
                                            }
                
                                            <span>{ item.nome }</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>

                    <div className={ clsx(s.people) }>
                        {
                            partners.map((partner: Partner) => (
                                <div 
                                    className={ clsx(s.partner) }
                                    key={ partner.person.id }
                                >
                                    <FaMinus 
                                        className={ clsx(s.icon) }
                                        onClick={ () => setPartners(partners.filter(p => p.person.id !== partner.person.id)) }
                                    />

                                    <div className={ clsx(s.person) }>
                                        <div className={ clsx(s.name) }>
                                            {
                                                partner.person.dataNascimento &&
                                                <span>{ new Date(partner.person.dataNascimento).getFullYear() }</span>
                                            }

                                            <span>{ partner.person.nome }</span>
                                        </div>

                                        <input 
                                            className={ clsx(s.date) } 
                                            type="text" 
                                            name={`${partner.person.id}_name`}
                                            id={`${partner.person.id}_date`}
                                            placeholder="DD/MM/AAAA"
                                            value={ partner.date }
                                            onChange={ e => {
                                                const newPartners = partners.map(p => {
                                                    if (p.person.id === partner.person.id)
                                                        p.date = formatDate(e.currentTarget.value);

                                                    return p;
                                                })

                                                setPartners(newPartners);
                                            } }
                                            autoComplete="off"
                                        />

                                        <input 
                                            className={ clsx(s.place) } 
                                            type="text" 
                                            name={`${partner.person.id}_place`}
                                            id={`${partner.person.id}_place`}
                                            placeholder="Local"
                                            value={ partner.place }
                                            onChange={ e => {
                                                const newPartners = partners.map(p => {
                                                    if (p.person.id === partner.person.id)
                                                        p.place = e.currentTarget.value;

                                                    return p;
                                                })

                                                setPartners(newPartners);
                                            } }
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={ clsx(s.observations) }>
                    <div className={ clsx(s.label) }>
                        Observações
                    </div>

                    <div className={ clsx(s.inputs) }>
                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="observationKey"
                            id="observationKey"
                            placeholder="Nome da observação"
                            value={ observationKey }
                            onChange={ e => setObservationKey(e.currentTarget.value) }
                        />

                        <div className={ clsx(s.colon) }>
                            :
                        </div>

                        <input 
                            className={ clsx(s.field) } 
                            type="text" 
                            name="observationValue"
                            id="observationValue"
                            placeholder="Dados da observação"
                            value={ observationValue }
                            onChange={ e => setObservationValue(e.currentTarget.value) }
                        />

                        <FaPlus
                            className={ clsx(s.add) }
                            onClick={ () => {                                
                                if (observationKey && observationValue) {
                                    setObservations((prevObservations) => ([
                                        ...prevObservations, { 
                                            key: observationKey.trim(), 
                                            value: observationValue.trim() 
                                        }]
                                    ))

                                    setObservationKey("")
                                    setObservationValue("")
                                }

                                else 
                                    toast.error("Por favor, preencha tanto o campo de nome quanto dados da observação.")
                            } }
                        />
                    </div>

                    <div className={ clsx(s.data) }>
                        {
                            observations.map((observation, index) => (
                                <div 
                                    className={ clsx(s.observation) }
                                    key={ index }
                                >
                                    <div className={ clsx(s.text) }>
                                        { observation.key }
                                    </div>

                                    <div className={ clsx(s.colon) }>
                                        :
                                    </div>

                                    <div className={ clsx(s.text) }>
                                        { observation.value }
                                    </div>

                                    <FaMinus
                                        className={ clsx(s.remove) }
                                        onClick={ () => setObservations(observations.filter(o => o.key !== observation.key)) }
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <Btn
                color="white"
                bgColor="green"
                text="CRIAR PESSOA"
                type="submit"
            />
        </form>
    )

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const res = await fetch("/api/pessoa", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                nome: name,
                genitorId: fatherId,
                genitorFamilia: fatherFamily,
                genitoraId: motherId,
                genitoraFamilia: motherFamily,

                dataNascimento: birthDate,
                localNascimento: birthPlace,
                dataBatismo: baptismDate,
                localBatismo: baptismPlace,
                dataFalecimento: deathDate,
                localFalecimento: deathPlace,

                genero: gender,
                casamentos: partners,
                observacoes: observations
            })
        })

        if (type === "create") {
            setName("");
            setFatherId("");
            setFatherFamily("");
            setMotherId("");
            setMotherFamily("");
            
            setBirthDate("");
            setBirthPlace("");
            setBaptismDate("");
            setBaptismPlace("");
            setDeathDate("");
            setDeathPlace("");

            setGender("male")
            setPartners([]);
            setObservations([])
            toast.success("Pessoa criada com sucesso!");
        }

        else 
            toast.success("Pessoa editada com sucesso!")
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
        
        const sortedPeople = dataPeople.sort((a: Person, b: Person) => {
            if (a.dataNascimento === null && b.dataNascimento === null) 
              return 0
            
            else if (a.dataNascimento === null) 
              return 1
            
            
            else if (b.dataNascimento === null) 
              return -1
            
            else 
              return new Date(a.dataNascimento).getTime() - new Date(b.dataNascimento).getTime();
          });

        const sortedFamilies = dataFamilies.sort((a: Family, b: Family) => a.nome.localeCompare(b.nome))

        setPeople(sortedPeople);
        setFamilies(sortedFamilies);
        setLoading(false);
    }
}