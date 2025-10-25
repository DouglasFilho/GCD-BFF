import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ChamberService } from "../chamber/chamber.service";
import { IEnrichedDeputy, IExpense, ISimplifiedDeputy } from "./deputies.interfaces";

@Injectable()
export class DeputiesService {
    constructor(private readonly chamberService: ChamberService) { }

    async getFilteredDeputies() {
        const rawDeputies = await this.chamberService.getDeputies();
        return this.filterDeputiesListData(rawDeputies);
    }

    async getFilteredDeputyInfo(id: string) {
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

        const expensesTotal = deputyExpenses.reduce((acc, expense) => acc + expense.valorLiquido, 0)
        const monthsElapsed = new Date().getMonth() + 1
        const averageMonthlyExpense = ((expensesTotal ?? 0) / monthsElapsed).toFixed(2)

        const expenses = {
            data: deputyExpenses,
            total: expensesTotal,
            averageMonthlyExpense: parseFloat(averageMonthlyExpense)
        }

        return {
            data: { deputy, expenses }
        };
    }


    private filterDeputiesListData(data: any): Array<ISimplifiedDeputy> {
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