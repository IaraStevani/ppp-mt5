import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const reportDirectory = path.resolve(projectDirectory, 'cypress', 'results');

if (!reportDirectory.startsWith(`${projectDirectory}${path.sep}`)) {
  throw new Error('Diretório de resultados fora do projeto. Operação cancelada.');
}

await rm(reportDirectory, { recursive: true, force: true });
await mkdir(reportDirectory, { recursive: true });
console.log('Diretório temporário do relatório web preparado.');
