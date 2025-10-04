import { StatusEtapa } from "./enums.js";
import { Funcionario } from "./funcionario.js";

export class Etapa {
    nome: string;
    prazo: string;
    status: StatusEtapa;
    funcionarios: Funcionario[] = [];

    constructor(nome: string, prazo: string) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
    }

    public iniciarEtapa(): void {
        this.status = StatusEtapa.EM_ANDAMENTO;
    }

    public finalizarEtapa(): void {
        this.status = StatusEtapa.CONCLUIDA;
    }

    public adicionarFuncionario(funcionario: Funcionario): void {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario);
        }
    }
}