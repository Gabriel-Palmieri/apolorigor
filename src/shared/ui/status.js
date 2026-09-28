/** @type {Readonly<Record<import('../../domain/types').EstoqueStatus, {tone: import('../../domain/types').Tone}>>} */
export const STATUS_MAP = {
  "Disponível": {
    "tone": "green"
  },
  "Alugado": {
    "tone": "orange"
  },
  "Em Ajuste": {
    "tone": "yellow"
  },
  "Indisponível": {
    "tone": "red"
  },
  "Vendido": {
    "tone": "grey"
  },
  "Misto": {
    "tone": "blue"
  }
};
/** @type {Readonly<Record<import('../../domain/types').AjusteStatus, {tone: import('../../domain/types').Tone}>>} */
export const AJUSTE_MAP = {
  "Pendente": {
    "tone": "grey"
  },
  "Em costura": {
    "tone": "blue"
  },
  "Concluído": {
    "tone": "green"
  }
};
/** @type {Readonly<Record<import('../../domain/types').ContratoStatus, {tone: import('../../domain/types').Tone}>>} */
export const CONTRATO_MAP = {
  "Rascunho": {
    "tone": "grey"
  },
  "Aguardando assinatura loja": {
    "tone": "orange"
  },
  "Aguardando assinatura cliente": {
    "tone": "blue"
  },
  "Confirmado": {
    "tone": "green"
  }
};
/** @type {Readonly<Record<import('../../domain/types').IntegranteStatus, {tone: import('../../domain/types').Tone}>>} */
export const INTEGRANTE_STATUS_MAP = {
  "Aguardando retirada": {
    "tone": "grey"
  },
  "Comparecimento pendente": {
    "tone": "orange"
  },
  "Com o cliente": {
    "tone": "blue"
  },
  "Devolvido": {
    "tone": "green"
  },
  "Atrasado": {
    "tone": "red"
  }
};
/** @type {Readonly<Record<import('../../domain/types').PagamentoStatus, {tone: import('../../domain/types').Tone}>>} */
export const PAGAMENTO_MAP = {
  "Pendente": {
    "tone": "orange"
  },
  "Parcial": {
    "tone": "yellow"
  },
  "Pago": {
    "tone": "green"
  },
  "Incluso no pacote": {
    "tone": "grey"
  }
};
/** @type {Readonly<Record<import('../../domain/types').PedidoStatus, {tone: import('../../domain/types').Tone}>>} */
export const PEDIDO_MAP = {
  "Novo": {
    "tone": "blue"
  },
  "Em análise": {
    "tone": "yellow"
  },
  "Aprovado": {
    "tone": "green"
  },
  "Recusado": {
    "tone": "red"
  }
};
/** @type {Readonly<Record<import('../../domain/types').PedidoTipo, {tone: import('../../domain/types').Tone}>>} */
export const TIPO_MAP = {
  "locacao_avulsa": {
    "tone": "orange"
  },
  "venda": {
    "tone": "green"
  },
  "locacao_padronizada": {
    "tone": "blue"
  }
};
