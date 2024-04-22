import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.familiaPessoa.deleteMany();
    await prisma.casamento.deleteMany();
    await prisma.pessoa.deleteMany();
    await prisma.familia.deleteMany();
    

    const familia1 = await prisma.familia.create({
        data: {
            nome: "Silva"
        }
    });

    const familia2 = await prisma.familia.create({
        data: {
            nome: "Santos"
        }
    });

    const familia3 = await prisma.familia.create({
        data: {
            nome: "Oliveira"
        }
    });

    const familia4 = await prisma.familia.create({
        data: {
            nome: "Souza"
        }
    });

    const pessoa1 = await prisma.pessoa.create({
        data: {
            nome: "João Silva",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1860-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1861-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                navio: "HMS Pinafore"
            }
        }
    });

    const familiaPessoa1 = await prisma.familiaPessoa.create({
        data: {
            familiaId: familia1.id,
            pessoaId: pessoa1.id
        }
    });

    const pessoa2 = await prisma.pessoa.create({
        data: {
            nome: "Maria Santos",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1865-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1866-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                navio: "HMS Pinafore"
            }
        }
    });

    const familiaPessoa2 = await prisma.familiaPessoa.create({
        data: {
            familiaId: familia2.id,
            pessoaId: pessoa2.id
        }
    });

    const casamento1 = await prisma.casamento.create({
        data: {
            esposaId: pessoa2.id,
            esposoId: pessoa1.id,
            dataCasamento: new Date("1880-01-01"),
            localCasamento: "Brasil"
        }
    });

    const pessoa3 = await prisma.pessoa.create({
        data: {
            nome: "José Santos Silva",
            genitorId: pessoa1.id,
            genitoraId: pessoa2.id,
            dataNascimento: new Date("1880-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1881-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                lotes: "12 hectares"
            }
        }
    });

    const familias1 = await prisma.familiaPessoa.findMany({
        where: {
            OR:[
                {pessoaId: pessoa1.id},
                {pessoaId: pessoa2.id}
            ]
        }
    });
    
    for (const f of familias1) {
        await prisma.familiaPessoa.create({
            data: {
                familiaId: f.familiaId,
                pessoaId: pessoa3.id
            }
        })
    }

    const pessoa4 = await prisma.pessoa.create({
        data: {
            nome: "Ana Oliveira",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                lotes: "12 hectares"
            }
        }
    });

    const familiaPessoa4 = await prisma.familiaPessoa.create({
        data: {
            familiaId: familia3.id,
            pessoaId: pessoa4.id
        }
    });

    const casamento2 = await prisma.casamento.create({
        data: {
            esposaId: pessoa3.id,
            esposoId: pessoa4.id,
            dataCasamento: new Date("1910-01-01"),
            localCasamento: "Brasil"
        }
    });

    const pessoa5 = await prisma.pessoa.create({
        data: {
            nome: "Pedro Oliveira Silva",
            genitorId: pessoa3.id,
            genitoraId: pessoa4.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                lotes: "12 hectares"
            }
        }
    });

    const familias2 = await prisma.familiaPessoa.findMany({
        where: {
            OR:[
                {pessoaId: pessoa3.id},
                {pessoaId: pessoa4.id}
            ]
        }
    });

    for (const f of familias2) {
        await prisma.familiaPessoa.create({
            data: {
                familiaId: f.familiaId,
                pessoaId: pessoa5.id
            }
        })
    }







}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
