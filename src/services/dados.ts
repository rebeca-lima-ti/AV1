import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaDados = path.resolve(__dirname, 'data');

async function garantirPasta() {
    try {
        await fs.access(pastaDados);
    } catch {
        await fs.mkdir(pastaDados, { recursive: true });
    }
}

export async function salvarDados(nomeArquivo: string, dados: any): Promise<void> {
    await garantirPasta();
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);
    await fs.writeFile(caminhoArquivo, JSON.stringify(dados, null, 2), 'utf8');
}

export async function carregarDados<T>(nomeArquivo: string): Promise<T | null> {
    await garantirPasta();
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);
    try {
        const dadosRaw = await fs.readFile(caminhoArquivo, 'utf8');
        return JSON.parse(dadosRaw) as T;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}
