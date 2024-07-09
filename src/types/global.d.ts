import React from "react";

import {
    Familia as FamiliaPrisma,
    Pessoa as PessoaPrisma,
    FamiliaPessoa as FamiliaPessoaPrisma,
    Casamento as CasamentoPrisma
} from "@prisma/client";

declare global {
    type Family = FamiliaPrisma & {
        relatorios?: number;
        membros?: number;
    };

    type Person = PessoaPrisma & {
        familias?: Partial<Family>[],
        genitor?: Partial<Person>,
        genitora?: Partial<Person>,
        esposo?: Mariage[],
        esposa?: Mariage[],
    };

    type FamilyPerson = FamiliaPessoaPrisma;
    type Marriage = CasamentoPrisma;
    type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
}

export {};