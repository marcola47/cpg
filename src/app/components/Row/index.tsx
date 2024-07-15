"use client"

import { formatDate } from "@/lib/input-functions";

import clsx from "clsx"
import s from "./style.module.scss";

export default function Row({ person, showForm }: { person: Person, showForm: any }): JSX.Element {
    function convertDate(dateString: string | Date) {
        // Split the date and time parts
        const datePart = dateString.toString().split('T')[0];
      
        // Split the date part by '-'
        const parts = datePart.split('-');
      
        // Rearrange and join the parts into 'dd/mm/yyyy' format
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      
        return formattedDate;
      }
    
    const ObjectPrinter = ({ obj }) => {
        return (
            <div>
                {Object.entries(obj).map(([key, value]) => (
                    <p key={key}>{key}: {value}</p>
                ))}
            </div>
        );
    };
    
    return (
        <div className={ clsx(s.person) }>
            <div className={ clsx(s.value, s.actions) }>
                <div 
                    className={ clsx(s.action, s.update) }
                    onClick={ showForm }
                >
                    Alterar
                </div>
                <div className={ clsx(s.action, s.delete) }>
                    Deletar
                </div>
            </div>

            <div className={ clsx(s.value) }>
                { person.nome }
            </div>

            <div className={ clsx(s.value) }>
                <span>{ person.genitor?.nome || "Não informado" }</span>
                <span>{ person.genitora?.nome || "Não informado" }</span>
            </div>

            <div className={ clsx(s.value, s.date) }> 
                <span>{ person.dataNascimento ? convertDate(person.dataNascimento) : "Não Informado" }</span>
                <span>{ person.localNascimento || "Não informado" }</span>
            </div>

            <div className={ clsx(s.value, s.date) }> 
                <span>{ person.dataBatismo ? convertDate(person.dataBatismo) : "Não Informado" }</span>
                <span>{ person.localBatismo || "Não informado" }</span>
            </div>

            <div className={ clsx(s.value, s.date) }> 
                <span>{ person.dataFalecimento ? convertDate(person.dataFalecimento) : "Não Informado" }</span>
                <span>{ person.localFalecimento || "Não informado" }</span>
            </div>

            <div className={ clsx(s.value, s.date) }> 
                <span>Não Informado</span>
                <span>Não Informado</span>
                <span>Não Informado</span>
            </div>
            
            <div className={ clsx(s.value) }>
                { person.observacoes && <ObjectPrinter obj={ person.observacoes }/> }
            </div>
        </div>
    )
}