import { Injectable } from "@nestjs/common";
import { ChamberService } from "../chamber/chamber.service";

@Injectable()
export class DeputiesService {
    constructor(private readonly chamberService: ChamberService) { }

    async getFilteredDeputies() {
        const rawDeputies = await this.chamberService.getDeputies();
        return this.filterDeputiesListData(rawDeputies);
    }

    async getFilteredDeputyInfo(id: string) {
        const [deputyPayload, expensesPayload] = await Promise.all([
            this.chamberService.getDeputy(id),
            this.chamberService.getDeputyExpenses(id, { ano: 2025 })
        ]);

        const deputy = this.filterDeputyData(deputyPayload);
        const expenses = this.filterExpensesData(expensesPayload);
        return { data: { deputy, expenses } };
    }

    private filterDeputiesListData(data: any) {
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

    private filterDeputyData(data: any) {
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
                email: deputy.email,
                urlFoto: deputy.ultimoStatus?.urlFoto ?? deputy.urlFoto,
                redeSocial: deputy.redeSocial,
                gabinete: deputy.gabinete,
                situacao: deputy.situacao,
                condicaoEleitoral: deputy.condicaoEleitoral,
                siglaPartido: deputy.ultimoStatus?.siglaPartido ?? deputy.siglaPartido
            };
        }
        return data;
    }

    private filterExpensesData(data: any) {
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
        return data;
    }
}
