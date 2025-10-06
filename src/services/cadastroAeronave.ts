import { Aeronave } from '../models/aeronave.js';
import { TipoAeronave } from '../models/enums.js';
import { db } from './database.js';

export class CadastroAeronave {
    
    cadastrar(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number): Aeronave | null {
        if (db.aeronaves.some(a => a.codigo === codigo)) {
            console.error("Erro: Já existe uma aeronave com este código.");
            return null;
        }

        const novaAeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
        db.aeronaves.push(novaAeronave);
        db.salvar();
        return novaAeronave;
    }

    buscarPorCodigo(codigo: string): Aeronave | undefined {
        return db.aeronaves.find(a => a.codigo === codigo);
    }

    listarTodas(): Aeronave[] {
        return db.aeronaves;
    }
}