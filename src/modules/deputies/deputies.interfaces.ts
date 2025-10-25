export interface IExpense {
    tipoDespesa: string;
    dataDocumento: string;
    valorDocumento: number;
    valorLiquido: number;
    nomeFornecedor: string;
    cnpjCpfFornecedor: string;
}

export interface ISimplifiedDeputy {
    id: number;
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
    email: string;
}

export interface IEnrichedDeputy {
  id: number;
  nome: string;
  nomeCivil: string;
  cpf: string;
  sexo: string;
  dataNascimento: string;
  ufNascimento: string;
  municipioNascimento: string;
  escolaridade: string;
  urlFoto: string;
  redeSocial: string[];
  siglaPartido: string;
}
