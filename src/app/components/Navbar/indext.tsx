import { Btn } from "@/app/components/Btn";
import clsx from "clsx";
import s from "./style.module.scss";

export default async function Navbar(): Promise<JSX.Element> {
    return (
        <div className={ clsx(s.navbar) }>
            <Btn
                link
                href="/"                
                color="orange"
                text="FAMÍLIAS"
                transition="color"
                fillColor="orange"
            />

            <Btn
                link
                href="/criar-pessoa"                
                color="orange"
                text="CRIAR PESSOA"
                transition="color"
                fillColor="orange"
            />
        </div>
    )
}