import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const PRIORIDADES = { 'Urgência': 3, 'Prioritário': 2, 'Padrão': 1 };

function sortFila(fila) {
  return [...fila].sort((a, b) => {
    const prioA = PRIORIDADES[a.tipo_atendimento] || 0;
    const prioB = PRIORIDADES[b.tipo_atendimento] || 0;
    if (prioB !== prioA) return prioB - prioA;
    return new Date(a.hora_criacao) - new Date(b.hora_criacao);
  });
}

export const useQueueStore = create(
  persist(
    (set, get) => ({
      fila: [],
      historico: [],
      lastCall: null,

      addToQueue: ({ nome, tipo, unidade }) => {
        const atendimento = {
          id: Date.now(),
          nome_paciente: nome,
          tipo_atendimento: tipo,
          unidade,
          status: 'aguardando',
          hora_criacao: new Date().toISOString(),
          guiche: null,
        };

        set((state) => ({
          fila: [...state.fila, atendimento],
        }));

        return atendimento;
      },

      callNext: (guiche) => {
        const { fila, historico } = get();
        const ordered = sortFila(fila);
        const proximo = ordered[0];
        if (!proximo) return null;

        const filaRestante = ordered.slice(1);
        const chamado = {
          ...proximo,
          status: 'chamado',
          guiche,
          hora_chamada: new Date().toISOString(),
        };

        const novoHistorico = [chamado, ...historico].slice(0, 20);

        set({
          fila: filaRestante,
          historico: novoHistorico,
          lastCall: chamado,
        });

        return chamado;
      },

      updateStatus: (atendimentoId, status) => {
        set((state) => ({
          historico: state.historico.map((a) =>
            a.id === atendimentoId
              ? { ...a, status, hora_finalizacao: new Date().toISOString() }
              : a
          ),
        }));
      },

      clear: () => set({ fila: [], historico: [], lastCall: null }),
    }),
    {
      name: 'queue_data',
      version: 1,
      partialize: (state) => ({
        fila: state.fila,
        historico: state.historico,
        lastCall: state.lastCall,
      }),
    }
  )
);


