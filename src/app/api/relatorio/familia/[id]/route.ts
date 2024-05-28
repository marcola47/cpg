import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from 'pdfkit';

type FindById = {
    id: string;
};

async function getDescendants(nivel: string,descendants: string[], family: {[key: string]: {[key: string] : any }}) {
    const id: string | undefined = descendants.shift();
    if (!id) {
        return;
    }

    const pessoa = await prisma.pessoa.findUnique({
        where: {
            id: id
        }
    });

    if(!pessoa){
        return;
    }

    const filhos = await prisma.pessoa.findMany({
        where: {
            OR: [
                {
                    genitorId: id
                },
                {
                    genitoraId: id
                }
            ]
        },
        orderBy: {
            dataNascimento: 'asc'
        },
    });

    const conjuges = await prisma.casamento.findMany({
        where: {
            OR: [
                {
                    esposoId: id
                },
                {
                    esposaId: id
                }
            ]
        }, orderBy: {
            dataCasamento: 'asc'
        }, include: {
            esposo: true,
            esposa: true
        }
    });
    
    family[id] = {
        filhos: [],
        conjuges: [],
        info: {},
        nivel: nivel
    }

    family[id].info = {
        nome: pessoa.nome,
        genitorId: pessoa.genitorId,
        genitoraId: pessoa.genitoraId,
        dataNascimento: pessoa.dataNascimento,
        localNascimento: pessoa.localNascimento,
        dataFalecimento: pessoa.dataFalecimento,
        localFalecimento: pessoa.localFalecimento,
        localBatismo: pessoa.localBatismo,
        dataBatismo: pessoa.dataBatismo,
        observacoes: pessoa.observacoes
    }

    for(let c of conjuges){
        const idConjuge = c.esposoId === id ? c.esposaId : c.esposoId;
        const paisDoConjuge = await prisma.pessoa.findUnique({
            where: {
                id: idConjuge
            },
            select: {
                genitor: true,
                genitora: true,
            }
        });

        let copyConjuge = {
            conjuge: c.esposoId === idConjuge ? c.esposo : c.esposa,
            dataCasamento: c.dataCasamento,
            localCasamento: c.localCasamento,
            genitor: paisDoConjuge?.genitor?.nome,
            genitora: paisDoConjuge?.genitora?.nome
        }
        

        family[id].conjuges.push(
            copyConjuge
        );
    }

    let numFilhos = 0;
    for(let f of filhos){
        family[id].filhos.push({
            id: f.id,
            genitorId: f.genitorId,
            genitoraId: f.genitoraId,
        });
        descendants.push(f.id);
        numFilhos++;
        const nivelFilho = nivel + '.' + numFilhos;
        await getDescendants(nivelFilho,descendants, family);
    }
    
}
function parseDate(date: Date | null | undefined): string {
    if(!date){
        return 'Desconhecido';
    }
    return date.toISOString().split('T')[0].replace(/-/g, '/');
}


export async function GET(req: NextRequest, context: { params: FindById }) {
    try{
        const familia = await prisma.familia.findFirst({
            where: {
                id: context.params.id
            }
        });
        
        if(!familia){
            return new NextResponse(JSON.stringify({error: "Familia não encontrada"}), {
                status: 404,
            });
        }

        const PrimeiraPessoa = await prisma.familiaPessoa.findFirst({
            where: {
                familiaId: familia.id
                },
                include: {
                    pessoa: true
                }
            });

        if(!PrimeiraPessoa){
            return new NextResponse(JSON.stringify({error: "Familia sem pessoas"}), {
                status: 404,
            });
        }

        let descendants: string[] = [];
        let family: {[key:string]: { [key: string] : any}} = {};
        descendants.push(PrimeiraPessoa.pessoa.id);
        let nivel: string = '1';
        await getDescendants(nivel,descendants, family);

        let stringFamily = "";
        for(const [id, values] of Object.entries(family)){
            const nivel = values.nivel;
            const info = values.info;
            const filhos = values.filhos;
            const conjuges = values.conjuges;

            stringFamily += "\t".repeat(nivel.split('.').length);
            stringFamily += `${nivel} ${info.nome} nasc. ${info.dataNascimento ? parseDate(info.dataNascimento) : 'Desconhecido'} `;
            stringFamily += `em ${info.localNascimento ? info.localNascimento : 'Desconhecido'}.`;
            let multipleCasamentos = false;

            if (conjuges.length > 0) {
                stringFamily += `Casou com`;
                for (const c of conjuges) {
                    stringFamily += `${multipleCasamentos ? 'Também, casou com' : ''} `;
                    stringFamily += `${c.conjuge.nome} ${c.dataCasamento ? "em " + parseDate(c.dataCasamento) : ''} `;
                    stringFamily += `descendente de ${c.genitor ? c.genitor : 'Desconhecido'} e ${c.genitora ? c.genitora : 'Desconhecido'} `;
                    stringFamily += `${c.conjuge.dataNascimento ? ", nasc." + parseDate(c.conjuge.dataNascimento) : ''} `;
                    stringFamily += `${c.conjuge.localNascimento ? "em " + c.conjuge.localNascimento : ''} `;
                    stringFamily += `${c.conjuge.dataFalecimento ? c.conjuge.nome + "faleceu em" + parseDate(c.conjuge.dataFalecimento) : ''}.`;
                    multipleCasamentos = true;
                }
            }

            stringFamily += `${info.dataFalecimento ? info.nome + "faleceu em " + parseDate(info.dataFalecimento) : ''}`;

            if (filhos.length > 0) {
                stringFamily += `Constam ${filhos.length} filhos:`;
                if(conjuges.length > 1){
                    stringFamily += ' Sendo';
                    for (const c of conjuges) {
                        let count: number = 0;
                        for (const f of filhos) {
                            if(f.genitorId === c.conjuge.id || f.genitoraId === c.conjuge.id){
                                count++;
                            }
                        }
                        stringFamily += ` $${count} filhos com ${c.conjuge.nome},`;
                    }
                }
            }
            stringFamily += '\n';            
        }   

        return new NextResponse(stringFamily, {
            status: 200,
        });

    }catch(e){
        return new NextResponse(JSON.stringify({error: e}), {
            status: 404,
        });
    }
}
