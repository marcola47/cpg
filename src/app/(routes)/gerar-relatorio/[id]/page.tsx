"use client"
import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss"
import { useEffect, useState } from "react";

export default function Page({params}: {params: {id: string}}) {

   /*  const idFamilia = params.id;
    const [data, setData] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            if (!idFamilia) return;
            const res = await fetch(`/api/relatorio/familia/${idFamilia}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        "cpfOrdenador":"041-267-810-13",
                        "userId": "31e0771e-1b9e-4d34-9c3b-2b8766337657",
                        "nomeOrdenador":"Felipe"
                    }
                ),
            });
            const json = await res.json();
            setData(json);
        }

        fetchData();
    }, [idFamilia]);
    console.log("data", data); */
    
    return (
        <div>
            ttttt
        </div>
    )
}