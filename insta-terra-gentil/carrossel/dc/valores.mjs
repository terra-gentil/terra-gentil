// Roda a lógica do molde (renderVals) numa caixa isolada e devolve os valores prontos.
import vm from 'node:vm';

// Versão mínima do DCLogic do Claude Design: só guarda as props, o suficiente para renderVals.
class DCLogic {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }
  setState() {}
  forceUpdate() {}
}

// O código do molde é nosso (vem do canvas aprovado), mas roda sem acesso a require, fs ou rede.
export function carregarComponente(codigo) {
  const caixa = vm.createContext({ DCLogic });
  vm.runInContext(codigo, caixa, { timeout: 1000 });
  const Componente = vm.runInContext('typeof Component === "function" ? Component : null', caixa);
  if (!Componente) throw new Error('[dc] o script do molde não define "class Component"');
  return Componente;
}

export function calcularValores(Componente, props) {
  const valores = new Componente(props).renderVals();
  if (!valores || typeof valores !== 'object') {
    throw new Error('[dc] renderVals não devolveu objeto');
  }
  return valores;
}
