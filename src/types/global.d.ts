import React from "react";

import {
    Familia as FamiliaPrisma,
    Pessoa as PessoaPrisma,
    FamiliaPessoa as FamiliaPessoaPrisma
} from "@prisma/client";

declare global {
    type Family = FamiliaPrisma & {
        relatorios?: number;
        membros?: number;
    };

    type Person = PessoaPrisma & {
        familias?: Partial<Family>[];
        genitor?: Partial<Person>;
        genitora?: Partial<Person>;
    };

    type FamilyPerson = FamiliaPessoaPrisma;
    type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
}

export {};