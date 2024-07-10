"use client"
import { FaBan } from "react-icons/fa";

type ErrorProps = {
  error: Error & { digest?: string },
  reset: () => void
}

export default function Error(props: ErrorProps) {
    const { error, reset } = props;
    let status, message;
    try{
        status = error.message.split("_")[0];
        message = error.message.split("_")[1];
    }catch(e){
        status = "500";
        message = "Ocorreu um erro inesperado ao processar sua requisição.";
    }
    
    let title = "", subtitle = "";

    switch (status) {
        case "400": 
        title = "Ocorreu um erro ao processar sua requisição"; 
        subtitle = "Verifique seus dados e tente novamente.";
        break;

        case "401": 
        title = "Usuário não autorizado"; 
        subtitle = "Você não tem permissão para acessar este conteúdo.";
        break;

        case "404": 
        title = "Ocorreu um erro ao processar sua requisição"; 
        subtitle = "O conteúdo que você está procurando não existe.";
        break;

        case "409":
        title = "Ocorreu um erro ao processar sua requisição";
        subtitle = "A sua requisição gerou um conflito interno no servidor que não pôde ser resolvido.";
        break;

        case "500": 
        title = "Erro interno do servidor"; 
        subtitle = "Ocorreu um erro inesperado ao processar sua requisição.";
        break;

        case "503":
        title = "Erro interno do servidor"; 
        subtitle = "O conteúdo que você está tentando acessar está indisponível ou em desenvolvimento.";
        break;

        default: 
        title = "Erro desconhecido"; 
        subtitle = "Ocorreu um erro inesperado ao processar sua requisição.";
        break;
    }

    return (
        <div className="page page--error">
            <div className="header">
                <h1 className="title page__title">
                    { title }
                </h1>

                <h3 className="subtitle page__subtitle">
                    { subtitle }
                </h3>
            </div>

            <div className="error__message">
                <p className="error__label t--bold">
                    Mensagem de erro retornada: ({ status })
                </p>

                <p className="error__content">
                    { message }
                </p>
            </div>

            <FaBan className="icon"/>
            
            <button 
                className="btn btn--bg--purple btn--t-grow"
                onClick={ () => reset() }
            > TENTAR NOVAMENTE
            </button>
        </div>
    )
}