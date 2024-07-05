"use client"
import { useState } from "react";

import { toast } from "sonner";
import { FaFileDownload, FaEye, FaPlus } from "react-icons/fa"
import { Btn } from "@/app/components/Btn";

import clsx from "clsx";
import s from "./style.module.scss";

export default function Card({ family }: { family: Family }): JSX.Element {
    return (
        <div className={ clsx(s.card) }>
            <div className={ clsx(s.family) }>
                <div className={ clsx(s.name) }>
                    { family.nome }
                </div>
                
                <div className={ clsx(s.members) }>
                    { family.membros || 0 } indivíduos
                </div>
            </div>

            <div className={ clsx(s.reqs) }>
                { family.relatorios || 0 } requisições
            </div>

            <div className={ clsx(s.btns) }>
                <Btn
                    onClick={ () => {} }
                    color="blue"
                    borderColor="blue"
                    
                    text="GERAR RELATÓRIO"
                    icon= { <FaFileDownload/> }
                    iconColor="blue"

                    transition="bg"
                    fillColor="blue"
                    fullWidth
                />
                
                <Btn
                    link
                    href={`/familia/${family.id}`}
                    color="green"
                    borderColor="green"
                    
                    text="VISUALIZAR"
                    icon= { <FaEye/> }
                    iconColor="green"

                    transition="bg"
                    fillColor="green"
                    fullWidth
                />
            </div>
        </div>
    )
}

type CardAddProps = {
    families: Family[];
    setFamilies: StateSetter<Family[]>
}

export function CardAdd(props: CardAddProps): JSX.Element {
    const { families, setFamilies } = props;
    const [inputShown, setInputShown] = useState<boolean>(false);
    const [reqSent, setReqSent] = useState<boolean>(false);
    const [name, setName] = useState<string>(""); 

    return (
        <div 
            className={ clsx(s.card, s.cardAdd) }
            onClick={ () => setInputShown(true) }
        >
            <FaPlus className={ clsx(s.icon) }/>

            {
                inputShown
                ? <>
                    <input 
                        className={ clsx(s.input) }
                        type="text" 
                        name="searchbar" 
                        id="searchbar" 
                        placeholder="Digite o nome da familia"
                        value={ name }
                        onChange={ e => setName(e.currentTarget.value) }
                        onClick={ e => e.stopPropagation() }
                        autoFocus
                    />

                    <div className={ clsx(s.btns) }>
                        <Btn
                            onClick={ e => handleCancel(e) }
                            color="red"
                            borderColor="red"
                            
                            text="CANCELAR"
                            transition="fill"
                            fillColor="red"
                            fullWidth
                        />
                        <Btn
                            loading={ reqSent }
                            onClick={ e => handleCreate(e) }
                            color="green"
                            borderColor="green"
                            
                            text="CRIAR FAMILIA"
                            transition="fill"
                            fillColor="green"
                            fullWidth
                        />
                    </div>
                </>
                : <h2 className={ clsx(s.title) }> 
                    ADICIONAR FAMÍLIA
                </h2>
            }
        </div>
    )

    function handleCancel(e: React.MouseEvent) {
        e.stopPropagation()
        setInputShown(false);
        setName("");
    }

    async function handleCreate(e: React.MouseEvent) {
        e.stopPropagation()
        setReqSent(true);

        const res = await fetch("/api/familia", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                nome: name
            })
        })

        if (!res.ok) {
            if (res.status === 409)
                toast.error(`Família de nome ${name} já existe.`);

            else
                toast.error("Ocorreu um erro ao criar a família.");

            setReqSent(false);
            return;
        }

        const newFamily = await res.json();
        const newFamilies = [...families, newFamily]

        setFamilies(newFamilies.sort((a: Family, b: Family) => a.nome.localeCompare(b.nome)));
        setInputShown(false);
        setReqSent(false);
        setName("");
    }
}