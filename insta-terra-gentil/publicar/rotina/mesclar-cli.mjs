// Passo "mesclar" do workflow: acha as branches da rotina no remoto e mescla as válidas.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { mesclarRamos, resumoDosResultados } from './mesclar.mjs';
import { PREFIXO_RAMO } from './validar.mjs';

const REPO = process.env.GITHUB_REPOSITORY;
const run = (programa, ...args) => execFileSync(programa, args, { encoding: 'utf8' }).trim();
const git = (...args) => run('git', ...args);
const CONFERIR = 'insta-terra-gentil/pauta/rotina-cli.mjs';

function listarRamos() {
  const saida = git('ls-remote', '--heads', 'origin', `refs/heads/${PREFIXO_RAMO}*`);
  return saida
    .split('\n')
    .map((linha) => linha.split('\t')[1]?.replace('refs/heads/', ''))
    .filter(Boolean);
}

// O login do committer vem da API do GitHub (só existe com e-mail verificado: não é forjável).
function loginDoCommit(sha) {
  const login = run('gh', 'api', `repos/${REPO}/commits/${sha}`, '--jq', '.committer.login');
  return login && login !== 'null' ? login : null;
}

async function obterInfo(ramo) {
  git('fetch', 'origin', 'main', `${ramo}:refs/remotes/origin/${ramo}`);
  const shas = git('rev-list', `origin/main..origin/${ramo}`).split('\n').filter(Boolean);
  const commits = shas.map((sha) => ({ sha, login: loginDoCommit(sha) }));
  const arquivos = git('diff', '--name-only', `origin/main...origin/${ramo}`).split('\n');
  return { commits, arquivos: arquivos.filter(Boolean) };
}

// Mescla, refaz a conferência dos fatos na main e só então empurra. Falhou: volta ao remoto.
async function aplicar(ramo) {
  git('checkout', 'main');
  git('reset', '--hard', 'origin/main');
  git('merge', '--no-ff', '-m', `insta: mescla ${ramo}`, `origin/${ramo}`);
  try {
    run('node', CONFERIR, 'conferir');
  } catch (erro) {
    git('reset', '--hard', 'origin/main');
    throw new Error(`conferência dos posts falhou: ${erro.stderr ?? erro.message}`.trim());
  }
  git('push', 'origin', 'HEAD:main');
  git('push', 'origin', '--delete', ramo);
}

git('config', 'user.name', 'github-actions[bot]');
git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');
const resultados = await mesclarRamos(listarRamos(), { obterInfo, aplicar });
console.log(resumoDosResultados(resultados));
if (process.env.GITHUB_OUTPUT) {
  const mesclou = resultados.some((r) => r.ok);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `mesclou=${mesclou}\n`);
}
if (resultados.some((r) => !r.ok)) process.exit(1);
