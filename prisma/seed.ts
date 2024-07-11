import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function addToFamily(pessoa: any) {
    const familias = await prisma.familiaPessoa.findMany({
        where: {
            OR: [
                { pessoaId: pessoa.genitorId == null ? "1" : pessoa.genitorId },
                { pessoaId: pessoa.genitoraId == null ? "1" : pessoa.genitoraId },
                
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
            nome: "Boniatti"
        }
    });

    const familia2 = await prisma.familia.create({
        data: {
            nome: "Colpo"
        }
    });

    const familia3 = await prisma.familia.create({
        data: {
            nome: "Soprano"
        }
    });

    const familia4 = await prisma.familia.create({
        data: {
            nome: "Tolio"
        }
    });

    // primeiro Boniatti
    const pessoa1 = await prisma.pessoa.create({
        data: {
            nome: "João Boniatti",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1860-01-01"),
            localNascimento: "Italia",
            dataBatismo: new Date("1861-01-01"),
            localBatismo: "Genova",
            dataFalecimento: new Date("1920-03-07"),
            localFalecimento: null,
            observacoes: {
                navio: "HMS Pinafore",
                info: "Primeiro Bonniati"
            }
        }
    });

    await prisma.familiaPessoa.create({
        data: {
            familiaId: familia1.id,
            pessoaId: pessoa1.id
        }
    });

    // Primeiro Colpo
    const pessoa2 = await prisma.pessoa.create({
        data: {
            nome: "Maria Colpo",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1865-01-01"),
            localNascimento: "Italia",
            dataBatismo: new Date("1866-01-01"),
            localBatismo: "genova",
            dataFalecimento: new Date("1923-07-01"),
            localFalecimento: null,
            observacoes: {
                facelimento: "Morte devido a um acidente com um cavalo"
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

    // Primeiro filho Boniatti Colpo
    const pessoa3 = await prisma.pessoa.create({
        data: {
            nome: "José Colpo Boniatti",
            genitorId: pessoa1.id,
            genitoraId: pessoa2.id,
            dataNascimento: new Date("1883-08-11"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1881-09-12"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Primogenito Boniatti Colpo"
            }
        }
    });

    await addToFamily(pessoa3);

    // Segundo filho Boniatti Colpo
    const pessoa32 = await prisma.pessoa.create({
        data: {
            nome: "Claudia Boniatti Colpo",
            genitorId: pessoa1.id,
            genitoraId: pessoa2.id,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1885-02-02"),
            localBatismo: "Brasil",
            dataFalecimento: new Date("1947-07-01"),
            localFalecimento: null,
            observacoes: {
                info: "Engenheira da ponte Rio-Niteroi"
            }
        }
    });

    await addToFamily(pessoa32);

    // Terceiro filho Boniatti Colpo
    const pessoa33 = await prisma.pessoa.create({
        data: {
            nome: "Marcia Boniatti Colpo",
            genitorId: pessoa1.id,
            genitoraId: pessoa2.id,
            dataNascimento: new Date("1887-04-07"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1888-02-05"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: "Italia",
            observacoes: {
                info: "Se mudou para a Italia em 1910"
            }
        }
    });

    await addToFamily(pessoa33);

    // Primeiro Soprano
    const pessoa4 = await prisma.pessoa.create({
        data: {
            nome: "Ana Soprano",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1887-09-10"),
            localNascimento: "Santa Maria",
            dataBatismo: new Date("1887-09-10"),
            localBatismo: "Santa Maria",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Primeira da familia Soprano, Casou com José Boniatti Colpo"
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
            localCasamento: "Pelotas - RS"
        }
    });


    // Primeiro filho Soprano Boniatti
    const pessoa5 = await prisma.pessoa.create({
        data: {
            nome: "Pedro Soprano Boniatti",
            genitorId: pessoa3.id,
            genitoraId: pessoa4.id,
            dataNascimento: new Date("1900-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1900-02-02"),
            localBatismo: "Brasil",
            dataFalecimento: new Date("1944-07-01"),
            localFalecimento: "Italia",
            observacoes: {
                info: "Lutou na segunda guerra"
            }
        }
    });

    await addToFamily(pessoa5);

    // Segundo filho Soprano Boniatti
    const pessoa52 = await prisma.pessoa.create({
        data: {
            nome: "Maria Soprano Boniatti",
            genitorId: pessoa3.id,
            genitoraId: pessoa4.id,
            dataNascimento: new Date("1904-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1904-02-02"),
            localBatismo: "Brasil",
            dataFalecimento: new Date("1974-07-01"),
            localFalecimento: "Paraguai",
            observacoes: {
                lotes: "12 hectares no paraguai"
            }
        }
    });

    await addToFamily(pessoa52);


    const pessoa6 = await prisma.pessoa.create({
        data: {
            nome: "Luiz Boniatti Null",
            genitorId: null,
            genitoraId: pessoa33.id,
            dataNascimento: new Date("1905-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1905-02-02"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Sem pai conhecido, filho de Marcia Boniatti Colpo"
            }
        }
    });

    await addToFamily(pessoa6);

    
    const pessoa7 = await prisma.pessoa.create({
        data: {
            nome: "Maria Tolio",
            genitorId: null,
            genitoraId: null,
            dataNascimento: new Date("1885-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1886-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Primeira Tolio"
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
            nome: "Eduarda Tolio",
            genitorId: null,
            genitoraId: pessoa7.id,
            dataNascimento: new Date("1912-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1913-01-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Filha de Maria Tolio, sem Pai conhecido"
            }
        }
    });

    await prisma.casamento.create({
        data: {
            esposaId: pessoa71.id,
            esposoId: pessoa6.id,
            dataCasamento: new Date("1934-01-01"),
            localCasamento: "Brasil"
        }
    });


    const pessoa8 = await prisma.pessoa.create({
        data: {
            nome: "Henrique Boniatti Tolio",
            genitorId: pessoa6.id,
            genitoraId: pessoa71.id,
            dataNascimento: new Date("1935-01-01"),
            localNascimento: "Brasil",
            dataBatismo: new Date("1935-02-01"),
            localBatismo: "Brasil",
            dataFalecimento: null,
            localFalecimento: null,
            observacoes: {
                info: "Filho de Luiz Boniatti Null e Eduarda Tolio"
            }
        }
    });

    await addToFamily(pessoa8);

    let user = {
        id: "31e0771e-1b9e-4d34-9c3b-2b8766337657",
        email: "default@email.com",
        password: await bcrypt.hash("192837465", 10),
        nome: "Default"
    }

    user = await prisma.user.create({
        data: user
    })

    console.log(user.nome);
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
