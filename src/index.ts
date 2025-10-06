import * as readlineSync from 'readline-sync';
import { db } from './services/database.js';
import { CadastroAeronave } from './services/cadastroAeronave.js';
import { CadastroFuncionario } from './services/cadastroFuncionario.js';
import { CadastroEtapa } from './services/cadastroEtapa.js';
import { Funcionario } from './models/funcionario.js';
import { NivelPermissao, TipoAeronave } from './models/enums.js';

class AeroCodeCLI {
    private cadastroAeronave = new CadastroAeronave();
    private cadastroFuncionario = new CadastroFuncionario();
    private cadastroEtapa = new CadastroEtapa();
    private usuarioLogado: Funcionario | null = null;

    public async start() {
        console.log('--- Bem-vindo ao AeroCode - Gestão de Produção de Aeronaves ---');
        await db.carregar();
        this.handleLogin();
        this.mainLoop();
    }

    private handleLogin() {
        console.log('\n--- Controle de Acesso ---');
        while (!this.usuarioLogado) {
            const usuario = readlineSync.question('Usuário: ');
            const senha = readlineSync.question('Senha: ', { hideEchoBack: true });

            const funcionario = this.cadastroFuncionario.autenticar(usuario, senha);
            if (funcionario) {
                this.usuarioLogado = funcionario;
                console.log(`\nLogin bem-sucedido! Bem-vindo, ${this.usuarioLogado.nome}. Nível: ${this.usuarioLogado.nivelPermissao}`);
            } else {
                console.log('Usuário ou senha inválidos. Tente novamente.');
            }
        }
    }

    private mainLoop() {
        while (true) {
            switch (this.usuarioLogado!.nivelPermissao) {
                case NivelPermissao.ADMINISTRADOR:
                    this.exibirMenuAdmin();
                    break;
                case NivelPermissao.ENGENHEIRO:
                    this.exibirMenuEngenheiro();
                    break;
                case NivelPermissao.OPERADOR:
                    this.exibirMenuOperador();
                    break;
            }
        }
    }

    private exibirMenuAdmin() {
        console.log('\n--- Menu Administrador ---');
        console.log('1. Cadastrar Novo Funcionário');
        console.log('2. Cadastrar Nova Aeronave');
        console.log('3. Listar Aeronaves');
        console.log('0. Sair');
        const opcao = readlineSync.question('Escolha uma opção: ');
        switch (opcao) {
            case '1': this.cadastrarFuncionario(); break;
            case '2': this.cadastrarAeronave(); break;
            case '3': this.listarAeronaves(); break;
            case '0': process.exit(0);
            default: console.log('Opção inválida.');
        }
    }

    private exibirMenuEngenheiro() {
        console.log('\n--- Menu Engenheiro ---');
        console.log('1. Listar Aeronaves');
        console.log('2. Adicionar Etapa de Produção');
        console.log('0. Sair');
        const opcao = readlineSync.question('Escolha uma opção: ');
         switch (opcao) {
            case '1': this.listarAeronaves(); break;
            case '2': this.adicionarEtapa(); break;
            case '0': process.exit(0);
            default: console.log('Opção inválida.');
        }
    }

    private exibirMenuOperador() {
        console.log('\n--- Menu Operador ---');
        console.log('1. Visualizar Etapas de uma Aeronave');
        console.log('2. Iniciar Etapa');
        console.log('3. Finalizar Etapa');
        console.log('0. Sair');
        const opcao = readlineSync.question('Escolha uma opção: ');
        switch (opcao) {
            case '1': this.visualizarEtapas(); break;
            case '2': this.iniciarEtapa(); break;
            case '3': this.finalizarEtapa(); break;
            case '0': process.exit(0);
            default: console.log('Opção inválida.');
        }
    }
    
    private cadastrarFuncionario() {
        console.log('\n--- Cadastro de Novo Funcionário ---');
        const id = parseInt(readlineSync.question('ID (numérico): '), 10);
        const nome = readlineSync.question('Nome: ');
        const telefone = readlineSync.question('Telefone: ');
        const endereco = readlineSync.question('Endereço: ');
        const usuario = readlineSync.question('Usuário de acesso: ');
        const senha = readlineSync.question('Senha: ');
        const niveis = Object.values(NivelPermissao);
        const index = readlineSync.keyInSelect(niveis, 'Qual o nível de permissão?');
        
        if (index !== -1) {
            const nivel = niveis[index] as NivelPermissao;
            const novo = this.cadastroFuncionario.cadastrar(id, nome, telefone, endereco, usuario, senha, nivel);
            if (novo) console.log('Funcionário cadastrado com sucesso!');
        } else {
            console.log('Cadastro cancelado.');
        }
    }

    private cadastrarAeronave() {
        console.log('\n--- Cadastro de Nova Aeronave ---');
        const codigo = readlineSync.question('Código: ');
        const modelo = readlineSync.question('Modelo: ');
        const tipos = Object.values(TipoAeronave);
        const index = readlineSync.keyInSelect(tipos, 'Qual o tipo da aeronave?');
        const capacidade = parseInt(readlineSync.question('Capacidade (passageiros): '), 10);
        const alcance = parseInt(readlineSync.question('Alcance (km): '), 10);
        
        if (index !== -1) {
            const tipo = tipos[index] as TipoAeronave;
            const nova = this.cadastroAeronave.cadastrar(codigo, modelo, tipo, capacidade, alcance);
            if (nova) console.log('Aeronave cadastrada com sucesso!');
        } else {
            console.log('Cadastro cancelado.');
        }
    }

    private listarAeronaves() {
        console.log('\n--- Lista de Aeronaves Cadastradas ---');
        const aeronaves = this.cadastroAeronave.listarTodas();
        if (aeronaves.length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
            return;
        }
        aeronaves.forEach(a => a.exibirDetalhes());
    }

    private adicionarEtapa() {
        const codigo = readlineSync.question('Digite o código da aeronave para adicionar a etapa: ');
        const aeronave = this.cadastroAeronave.buscarPorCodigo(codigo);
        if (!aeronave) {
            console.log('Aeronave não encontrada.');
            return;
        }
        const nomeEtapa = readlineSync.question('Nome da nova etapa: ');
        const prazo = readlineSync.question('Prazo (ex: 15 dias): ');
        this.cadastroEtapa.adicionarEtapa(aeronave, nomeEtapa, prazo);
        console.log('Etapa adicionada com sucesso!');
    }

    private visualizarEtapas() {
        const codigo = readlineSync.question('Digite o código da aeronave para ver as etapas: ');
        const aeronave = this.cadastroAeronave.buscarPorCodigo(codigo);
        if (!aeronave) {
            console.log('Aeronave não encontrada.');
            return;
        }
        console.log(`\n--- Etapas da Aeronave ${aeronave.modelo} ---`);
        if (aeronave.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada para esta aeronave.');
            return;
        }
        aeronave.etapas.forEach((e, i) => {
            console.log(`${i + 1}. ${e.nome} - Prazo: ${e.prazo} - Status: ${e.status}`);
        });
    }

    private iniciarEtapa() {
        const codigo = readlineSync.question('Digite o código da aeronave: ');
        const aeronave = this.cadastroAeronave.buscarPorCodigo(codigo);
        if (!aeronave) {
            console.log('Aeronave não encontrada.');
            return;
        }
        const nomeEtapa = readlineSync.question('Qual etapa deseja iniciar? ');
        const sucesso = this.cadastroEtapa.iniciarEtapa(aeronave, nomeEtapa);
        if (sucesso) {
            console.log(`Etapa '${nomeEtapa}' iniciada com sucesso!`);
        }
    }

    private finalizarEtapa() {
        const codigo = readlineSync.question('Digite o código da aeronave: ');
        const aeronave = this.cadastroAeronave.buscarPorCodigo(codigo);
        if (!aeronave) {
            console.log('Aeronave não encontrada.');
            return;
        }
        const nomeEtapa = readlineSync.question('Qual etapa deseja finalizar? ');
        const sucesso = this.cadastroEtapa.finalizarEtapa(aeronave, nomeEtapa);
        if (sucesso) {
            console.log(`Etapa '${nomeEtapa}' finalizada com sucesso!`);
        }
    }
}

const cli = new AeroCodeCLI();
cli.start();