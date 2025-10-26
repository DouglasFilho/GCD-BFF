import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ChamberService } from "../chamber/chamber.service";
import { IEnrichedDeputy, IExpense, ISimplifiedDeputy } from "./deputies.interfaces";
import { InjectRepository } from '@nestjs/typeorm';
import { Deputy } from "./deputy.entity";
import { Repository } from 'typeorm';
import { ExpensesService } from "../expenses/expenses.service";

@Injectable()
export class DeputiesService {
    constructor(
        private readonly chamberService: ChamberService,
        @InjectRepository(Deputy)
        private deputiesRepository: Repository<Deputy>,
        private readonly expensesService: ExpensesService,
    ) {}

    findAll(): Promise<Deputy[]> {
        return this.deputiesRepository.find();
    }

    findOne(id: number): Promise<Deputy | null> {
        return this.deputiesRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.deputiesRepository.delete(id);
    }

    async addDeputy(deputy: ISimplifiedDeputy) {
        const newDeputy = this.deputiesRepository.create({
            name: deputy.nome,
            chamberApiId: deputy.id,
            partyAcronym: deputy.siglaPartido,
            stateAcronym: deputy.siglaUf,
            photoUrl: deputy.urlFoto
        });

        await this.deputiesRepository.save(newDeputy);
        return newDeputy;
    }

    async updateDeputies() {
        const rawDeputies = await this.chamberService.getDeputies();
        const deputies = this.filterDeputiesListData(rawDeputies);

        if (deputies?.dados) {
            deputies.dados.forEach(async (deputy) => {
                const findDeputy = await this.deputiesRepository.findOneBy({ chamberApiId: deputy.id })
                if (!findDeputy) {
                    this.addDeputy(deputy);
                }
            });
        }

        return this.findAll();
    }
 
    async getFilteredDeputies() {
        const rawDeputies = await this.chamberService.getDeputies();
        return this.filterDeputiesListData(rawDeputies);
    }

    async getFilteredDeputyInfo(id: number) {
        const [depRes, expRes] = await Promise.allSettled([
            this.chamberService.getDeputy(id),
            this.chamberService.getDeputyExpenses(id, { ano: 2025 })
        ]);


        if (depRes.status !== 'fulfilled' || expRes.status !== 'fulfilled') {
            const errors: any = {
                deputy: (depRes as any).reason ?? null,
                expenses: (expRes as any).reason ?? null
            };

            const status = (errors.deputy?.status) || (errors.expenses?.status) || HttpStatus.BAD_GATEWAY;
            const message = (errors.deputy?.message) || (errors.expenses?.message) || "Error accessing external service";
            const response = (errors.deputy?.response) || (errors.expenses?.response) || {};

            throw new HttpException({ message, response }, status);
        }


        const deputy = this.filterDeputyData((depRes as any).value);
        const deputyExpenses = this.filterExpensesData((expRes as any).value);

        const chamberApiId = Number(id);
        let localDeputy = await this.deputiesRepository.findOne({ where: { chamberApiId } });

        let consolidated = null as any;
        if (localDeputy) {
            consolidated = await this.expensesService.findOne(localDeputy.id);
            if (!consolidated) {
                consolidated = await this.expensesService.createOrUpdateConsolidatedExpense(localDeputy.id, deputyExpenses);
            }
        }

        const expenses = {
            data: deputyExpenses,
        }

        return {
            data: { deputy, expenses, consolidatedExpenses: consolidated }
        };
    }


    private filterDeputiesListData(data: any): {dados: ISimplifiedDeputy[], links: String[]} {
        if (data?.dados) {
            return {
                ...data,
                dados: data.dados.map((deputy: any) => ({
                    id: deputy.id,
                    nome: deputy.nome,
                    siglaPartido: deputy.siglaPartido,
                    siglaUf: deputy.siglaUf,
                    urlFoto: deputy.urlFoto,
                    email: deputy.email
                }))
            };
        }
        return data;
    }

    private filterDeputyData(data: any): IEnrichedDeputy {
        if (data?.dados) {
            const deputy = data.dados;
            return {
                id: deputy.id,
                nome: deputy.ultimoStatus?.nome ?? deputy.nome,
                nomeCivil: deputy.nomeCivil,
                cpf: deputy.cpf,
                sexo: deputy.sexo,
                dataNascimento: deputy.dataNascimento,
                ufNascimento: deputy.ufNascimento,
                municipioNascimento: deputy.municipioNascimento,
                escolaridade: deputy.escolaridade,
    //          email: deputy.email,
                urlFoto: deputy.ultimoStatus?.urlFoto ?? deputy.urlFoto,
                redeSocial: deputy.redeSocial,
    //            gabinete: deputy.gabinete,
    //            situacao: deputy.situacao,
    //            condicaoEleitoral: deputy.condicaoEleitoral,
                siglaPartido: deputy.ultimoStatus?.siglaPartido ?? deputy.siglaPartido
            };
        }
        return data;
    }


    private filterExpensesData(data: any): Array<IExpense> {
        if (data?.dados) {
            return data.dados.map((exp: any) => ({
                tipoDespesa: exp.tipoDespesa ?? exp.tipoDocumento,
                dataDocumento: exp.dataDocumento,
                valorDocumento: exp.valorDocumento,
                valorLiquido: exp.valorLiquido,
                nomeFornecedor: exp.nomeFornecedor ?? exp.fornecedor,
                cnpjCpfFornecedor: exp.cnpjCpfFornecedor ?? exp.cpfCnpjFornecedor
            }))
        }

        return [];
    }
}
