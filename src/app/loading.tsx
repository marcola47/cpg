import clsx from "clsx"
import app from "@/styles/app.module.scss";

export default function Loading(): JSX.Element {
    return (
        <div className={ clsx(app.page, app.pageDefLoading) }>
            <div className={ clsx(app.loader, app.loaderGrey, app.loaderXl) }/>
        </div>
    )
}