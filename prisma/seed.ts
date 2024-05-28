import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function addToFamily(pessoa: any) {
    const familias = await prisma.familiaPessoa.findMany({
        where: {
            OR: [
                {pessoaId: pessoa.genitorId == null ? "1" : pessoa.genitorId},
                {pessoaId: pessoa.genitoraId == null ? "1" : pessoa.genitoraId},
                
            ]
        }
    });

    for (const f of familias) {
        await prisma.familiaPessoa.create({
            data: {
                familiaId: f.familiaId,
                pessoaId: pessoa.id
            }
        })
    }
}

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

    // primeiro Silva
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

    await prisma.familiaPessoa.create({
        data: {
            familiaId: familia1.id,
            pessoaId: pessoa1.id
        }
    });

    // Primeiro Santos
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

    await prisma.familiaPessoa.create({
        data: {
            familiaId: familia2.id,
            pessoaId: pessoa2.id
        }
    });

    await prisma.casamento.create({
        data: {
            esposaId: pessoa2.id,
            esposoId: pessoa1.id,
            dataCasamento: new Date("1880-01-01"),
            localCasamento: "Brasil"
        }
    });

    // Primeiro filho Silva Santos
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
                info: "1 Silva Santos"
            }
        }
    });

    await addToFamily(pessoa3);

    // Segundo filho Silva Santos
    const pessoa32 = await prisma.pessoa.create({
        data: {
            nome: "Claudia Silva Santos",
            genitorId: pessoa1.id,
            genitoraId: pessoa2.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "2 Silva Santos"
            }
        }
    });

    await addToFamily(pessoa32);

    // Terceiro filho Silva Santos
    const pessoa33 = await prisma.pessoa.create({
        data: {
            nome: "Marcia Silva Santos",
            genitorId: pessoa1.id,
            genitoraId: pessoa2.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "3 Silva Santos"
            }
        }
    });

    await addToFamily(pessoa33);

    // Primeiro Oliveira
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

    await prisma.familiaPessoa.create({
        data: {
            familiaId: familia3.id,
            pessoaId: pessoa4.id
        }
    });

    await prisma.casamento.create({
        data: {
            esposaId: pessoa3.id,
            esposoId: pessoa4.id,
            dataCasamento: new Date("1910-01-01"),
            localCasamento: "Brasil"
        }
    });


    // Primeiro filho Oliveira Silva
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

    await addToFamily(pessoa5);

    // Segundo filho Oliveira Silva
    const pessoa52 = await prisma.pessoa.create({
        data: {
            nome: "Maria Oliveira Silva",
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

    await addToFamily(pessoa52);


    const pessoa6 = await prisma.pessoa.create({
        data: {
            nome: "Luiz Silva Null",
            genitorId: null,
            genitoraId: pessoa33.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Sem pai conhecido"
            }
        }
    });

    await addToFamily(pessoa6);

    const pessoa7 = await prisma.pessoa.create({
        data: {
            nome: "Maria Souza",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Primeira Souza"
            }
        }
    });

    await prisma.familiaPessoa.create({
        data: {
            familiaId: familia4.id,
            pessoaId: pessoa7.id
        }
    });

    const pessoa71= await prisma.pessoa.create({
        data: {
            nome: "Eduarda Souze",
            genitorId: null,
            genitoraId: pessoa7.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Primeira Souza"
            }
        }
    });

    await prisma.casamento.create({
        data: {
            esposaId: pessoa71.id,
            esposoId: pessoa6.id,
            dataCasamento: new Date("1910-01-01"),
            localCasamento: "Brasil"
        }
    });

    

    const pessoa8 = await prisma.pessoa.create({
        data: {
            nome: "Henrique Silva Souza",
            genitorId: pessoa6.id,
            genitoraId: pessoa71.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Segundo Souza"
            }
        }
    });

    await addToFamily(pessoa8);

    const familia5 = await prisma.familia.create({
        data: {
            nome: "Ricardao"
        }
    });

    const ricardao = await prisma.pessoa.create({
        data: {
            nome: "Ricardo Ricardao",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Ricardao"
            }
        }
    });

    await prisma.familiaPessoa.create({
        data: {
            familiaId: familia5.id,
            pessoaId: ricardao.id
        }
    });

    console.log("Data seeded.");
    console.log("Familia Silva", familia1.id);
    console.log("Marica", pessoa33.id);
    console.log("Ricardao", ricardao.id);
    console.log("Ricardao Familia", familia5.id);
    console.log("Marcia", pessoa33);
    
   


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
