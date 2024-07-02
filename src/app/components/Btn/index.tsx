"use client"
import Link from "next/link";
import clsx from "clsx";
import s from "./style.module.scss";

type colors = "black" | "white" | "grey" | "orange" | "blue" | "red" | "green";

type CommonBtnProps = {
    loading?: boolean,
    link?: boolean,

    color?: colors,
    bgColor?: colors,
    borderColor?: colors,
    
    text: string,
    icon?: React.ReactElement,
    iconColor?: colors,
    
    transition?: "grow" | "fill" | "border" | "bg" | "color",
    fillColor?: colors,
    fullWidth?: boolean,
}

type BtnProps = 
    | (CommonBtnProps & { 
        link: true,
        href: string,
        onClick?: undefined,
    })

    | (CommonBtnProps & { 
        link?: false,
        href?: undefined,
        onClick: () => any,
    });

export function Btn(props: BtnProps): JSX.Element {
    const { 
        onClick,
        loading,
        link,
        href,
        color,
        bgColor,
        borderColor,
        text,
        icon,
        iconColor,
        transition,
        fillColor,
        fullWidth
    } = props;
    
    const btnColor = color 
    ? `color${getUppercase(color)}`
    :  "colorGrey"

    const btnBgColor = bgColor
    ? `bg${getUppercase(bgColor)}`
    :  ""

    const btnBorderColor = borderColor 
    ? `border${getUppercase(borderColor)}`
    :  ""

    const btnIconColor = iconColor 
    ? `icon${getUppercase(iconColor)}`
    :  "iconBlack"

    const btnTransition = transition 
    ? `trans${getUppercase(transition)}`
    :  "transGrow"

    const btnFillColor = /Fill|Border|Bg|Color/.test(btnTransition)
    ? `${btnTransition}${getUppercase(fillColor)}`
    :  ""

    const className = clsx(
        s.btn,
        s[btnColor],
        s[btnBgColor],
        s[btnBorderColor],
        s[btnIconColor],
        s[btnTransition],
        s[btnFillColor],
        loading && s.loading,
        fullWidth && s.fullWidth,
    ) 

    if (link) {
        return (
            <Link
                className={ className }
                href={ href }
            > { text }
            </Link>
        )
    }

    return (
        <button 
            className={ className }
            onClick={ onClick }
        >   
            {
                loading 
                ?   <span className="loader loader--xs"/>
                :   <>
                        { icon && icon }
                        <span className={ clsx(s.text) }>
                            { text }
                        </span>
                    </>
            }
        </button>
    )

    function getUppercase(value?: string) {
        if (!value)
            return ""
        
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
    }
}