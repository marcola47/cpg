interface Pessoa {
    id?: string;
    nome: string;
    genitorId?: string;
    genitoraId?: string;
    dataNascimento?: Date;
    localNascimento?: string;
    dataBatismo?: Date;
    localBatismo?: string;
    dataFalecimento?: Date;
    localFalecimento?: string;
    dataCasamento?: Date;
    localCasamento?: string;
    idEsposa?: string;
    idEsposo?: string;
    observacoes?: object;
}