import Form from "@/app/components/Form";

import clsx from "clsx"
import app from "@/styles/app.module.scss";
import s from "./style.module.scss"

export default async function Page(): Promise<JSX.Element> {
    return (
        <div className={ clsx(app.page, s.page) }>
            <Form 
                type="create"
                location="page"
            />
        </div>
    )
}