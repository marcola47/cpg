"use client"
import { FaFileDownload, FaEye, FaPlus } from "react-icons/fa"
import { Btn } from "@/app/components/Btn";

import clsx from "clsx";
import s from "./style.module.scss";

export default function Card(): JSX.Element {
    return (
        <div className={ clsx(s.card) }>
            <div className={ clsx(s.family) }>
                <div className={ clsx(s.name) }>
                    Bagesteiro
                </div>
                
                <div className={ clsx(s.members) }>
                    69 indivíduos
                </div>
            </div>

            <div className={ clsx(s.reqs) }>
                420 requisições
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
                    onClick={ () => {} }
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

export function CardAdd(): JSX.Element {
    return (
        <div className={ clsx(s.card, s.cardAdd) }>
            <FaPlus className={ clsx(s.icon) }/>

            <h2 className={ clsx(s.title) }>
                ADICIONAR FAMÍLIA
            </h2>
        </div>
    )
}