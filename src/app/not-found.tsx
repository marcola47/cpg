import { FaFileCircleXmark } from "react-icons/fa6"
import clsx from "clsx"
import app from "@/styles/app.module.scss";

export default async function NotFound(): Promise<JSX.Element> {
    return (
        <div className={ clsx(app.page, app.pageNotFound) }>
            <h1 className={ clsx(app.title) }>
                Página não encontrada
            </h1>

            <h3 className={ clsx(app.subtitle) }>
                A página que você está tentando acessar não existe ou foi removida do nosso sistema
            </h3>

            <FaFileCircleXmark className={ clsx(app.icon) }/>
        </div>
    )
}