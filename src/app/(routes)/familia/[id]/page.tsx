import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss";

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
    return data;
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
    return data;
}

export default async function Page({ params }: { params: { id: string } }): Promise<JSX.Element> {
    const family = await getFamily(params.id);
    const people = await getPeople(params.id);

    console.dir(people, { depth: null })

    return (
        <div className={ clsx(app.page, s.page) }>

        </div>
    )
}