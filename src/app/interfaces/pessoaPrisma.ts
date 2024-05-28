interface PessoaPrisma{
    id: string;
    nome: string;
    genitorId: string | null;
    genitoraId: string | null;
    dataNascimento: Date | null;
    localNascimento: string | null;
    dataBatismo: Date | null;
    localBatismo: string | null;
    dataFalecimento: Date | null;
    localFalecimento: string | null;
    createdAt: Date;
    updatedAt: Date;
}