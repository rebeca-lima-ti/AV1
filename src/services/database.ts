import { Aeronave } from '../models/aeronave.js';
import { Funcionario } from '../models/funcionario.js';
import { carregarDados, salvarDados } from './dados.js';

class Database {
    public aeronaves: Aeronave[] = [];
    public funcionarios: Funcionario[] = [];

    private readonly arquivoAeronaves = 'aeronaves.json';
    private readonly arquivoFuncionarios = 'funcionarios.json';

    async carregar() {
        const dadosAeronaves = await carregarDados<any[]>(this.arquivoAeronaves);
        if (dadosAeronaves) {
            this.aeronaves = dadosAeronaves.map(d => 
                new Aeronave(d.codigo, d.modelo, d.tipo, d.capacidade, d.alcance, d.pecas, d.etapas, d.testes)
            );
        }

        const dadosFuncionarios = await carregarDados<any[]>(this.arquivoFuncionarios);
        if (dadosFuncionarios) {
            this.funcionarios = dadosFuncionarios.map(d =>
                new Funcionario(d.id, d.nome, d.telefone, d.endereco, d.usuario, d.senha, d.nivelPermissao)
            );
        }
    }

    async salvar() {
        await salvarDados(this.arquivoAeronaves, this.aeronaves);
        await salvarDados(this.arquivoFuncionarios, this.funcionarios);
    }
}

export const db = new Database();