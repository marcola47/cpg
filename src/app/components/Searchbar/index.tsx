"use client"
import { FaMagnifyingGlass } from "react-icons/fa6";
import clsx from "clsx"
import s from "./style.module.scss";

type SearchbarProps = {
    type: "family" | "person",
    state: string,
    setState: StateSetter<string>,
}

export default function Searchbar(props: SearchbarProps) {
    const { type, state, setState } = props;

    return (
        <div className={ clsx(s.searchbar) }>
            <FaMagnifyingGlass className={ clsx(s.icon) }/>
            <input 
                className={ clsx(s.input) }
                type="text" 
                name="searchbar" 
                id="searchbar" 
                placeholder={`Digite o nome da ${type === "family" ? "família" : "pessoa"}`}
                value={ state }
                onChange={ e => setState(e.currentTarget.value) }
            />
        </div>
    )
}