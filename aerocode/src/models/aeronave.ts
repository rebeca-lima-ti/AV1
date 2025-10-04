import { tipoAeronave } from "./enums.js";
import { Peca } from "./peca.js";
import { Etapa } from "./etapa.js";
import { Teste } from "./teste.js";

export class Aeronave {
    codigo: string;
    modelo: string;
    tipo: tipoAeronave;
    capacidade: number;
    alcance: number;
    
    pecas: Peca[] = [];
    etapas: Etapa[] = [];
    testes: Teste[] = [];

    constructor(codigo: string, modelo: string, tipo: tipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }

    public adicionarPeca(peca: Peca): void {
        this.pecas.push(peca);
    }

    public adicionarEtapa(etapa: Etapa): void {
        this.etapas.push(etapa);
    }

    public adicionarTeste(teste: Teste): void {
        this.testes.push(teste);
    }

    public exibirDetalhes(): void {
        console.log(`--- Detalhes da Aeronave: ${this.modelo} (${this.codigo}) ---`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance} km`);
        console.log(`Peças: ${this.pecas.length}`);
        console.log(`Etapas de Produção: ${this.etapas.length}`);
        console.log(`Testes Realizados: ${this.testes.length}`);
        console.log(`-------------------------------------------------`);
    }
}