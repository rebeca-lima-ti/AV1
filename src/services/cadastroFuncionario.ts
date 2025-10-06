import { Funcionario } from '../models/funcionario.js';
import { NivelPermissao } from '../models/enums.js';
import { db } from './database.js';

export class CadastroFuncionario {
    
    autenticar(usuario: string, senha: string): Funcionario | undefined {
        const funcionario = db.funcionarios.find(f => f.usuario === usuario);
        
        if (funcionario && funcionario.verificarSenha(senha)) {
            return funcionario;
        }
        
        return undefined;
    }

    cadastrar(id: number, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao): Funcionario | null {
        if (db.funcionarios.some(f => f.id === id || f.usuario === usuario)) {
            console.error("Erro: ID ou nome de usuário já cadastrado.");
            return null;
        }
        
        const novoFuncionario = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao);
        db.funcionarios.push(novoFuncionario);
        db.salvar();
        return novoFuncionario;
    }

    buscarPorId(id: number): Funcionario | undefined {
        return db.funcionarios.find(f => f.id === id);
    }
}