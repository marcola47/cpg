"use client"
import Card, { CardAdd } from "@/app/components/Card"
import "./style.scss"

export default function Page(): JSX.Element {
    return (
        <div className="page home">
            <Card/>
            <CardAdd/>
        </div>
    )
}