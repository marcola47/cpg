import { FaFileCircleXmark } from "react-icons/fa6"

export default async function NotFound(): Promise<JSX.Element> {
    return (
        <div className="page page--not-found">
            <h1 className="title page__title">
                Página não encontrada
            </h1>

            <h3 className="subtitle page__subtitle">
                A página que você está tentando acessar não existe ou foi removida do nosso sistema
            </h3>

            <FaFileCircleXmark className="icon"/>
        </div>
    )
}