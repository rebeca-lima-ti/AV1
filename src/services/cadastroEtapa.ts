import { Aeronave } from "../models/aeronave.js";
import { Etapa } from "../models/etapa.js";
import { StatusEtapa } from "../models/enums.js";
import { db } from "./database.js";

export class CadastroEtapa {

    adicionarEtapa(aeronave: Aeronave, nomeEtapa: string, prazo: string) {
        const novaEtapa = new Etapa(nomeEtapa, prazo);
        aeronave.adicionarEtapa(novaEtapa);
        db.salvar();
    }

    iniciarEtapa(aeronave: Aeronave, nomeEtapa: string): boolean {
        const indexEtapa = aeronave.etapas.findIndex(e => e.nome === nomeEtapa);

        if (indexEtapa === -1) {
            console.error("Erro: Etapa não encontrada.");
            return false;
        }

        const etapaAtual = aeronave.etapas[indexEtapa];
        if (!etapaAtual) {
            console.error("Erro: Etapa inválida.");
            return false;
        }

        if (indexEtapa === 0) {
            etapaAtual.iniciarEtapa();
            db.salvar();
            return true;
        }

        const etapaAnterior = aeronave.etapas[indexEtapa - 1];
        if (etapaAnterior && etapaAnterior.status === StatusEtapa.CONCLUIDA) {
            etapaAtual.iniciarEtapa();
            db.salvar();
            return true;
        } else {
            console.error("Erro: A etapa anterior ainda não foi concluída.");
            return false;
        }
    }

    finalizarEtapa(aeronave: Aeronave, nomeEtapa: string): boolean {
        const etapa = aeronave.etapas.find(e => e.nome === nomeEtapa);

        if (!etapa) {
            console.error("Erro: Etapa não encontrada.");
            return false;
        }

        if (etapa.status === StatusEtapa.EM_ANDAMENTO) {
            etapa.finalizarEtapa();
            db.salvar();
            return true;
        } else {
            console.error("Erro: A etapa não pode ser finalizada pois não está em andamento.");
            return false;
        }
    }
}
