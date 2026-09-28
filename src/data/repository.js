// Persistence is injected so domain behavior can be tested without a browser.
// Storage failures keep a coherent in-memory snapshot and expose a visible warning.
export function createRepository({
  key,
  initialData,
  storage,
  validate,
  legacyKey
}) {
  const listeners = new Set();
  const getStorage = () => typeof storage === 'function' ? storage() : storage;
  let snapshot;
  let status = null;
  let unsaved = false;
  function decode(raw) {
    const value = JSON.parse(raw);
    if (!validate(value)) throw new Error('Os dados salvos têm um formato inválido.');
    return value;
  }
  try {
    const adapter = getStorage();
    const saved = adapter.getItem(key);
    snapshot = saved === null ? initialData() : decode(saved);
    if (saved === null && legacyKey) {
      const legacy = adapter.getItem(legacyKey);
      if (legacy !== null) {
        const pedidos = JSON.parse(legacy);
        if (!Array.isArray(pedidos)) throw new Error('Os pedidos antigos têm um formato inválido.');
        const migrated = {
          ...snapshot,
          pedidos
        };
        if (!validate(migrated)) throw new Error('Os pedidos antigos têm registros inválidos.');
        snapshot = migrated;
      }
    }
  } catch {
    snapshot = initialData();
    status = 'Não foi possível ler os dados salvos. Esta aba está usando dados de demonstração.';
  }
  const emit = () => listeners.forEach(listener => listener());
  return {
    getSnapshot: () => snapshot,
    getStatus: () => status,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(updater) {
      // A second tab may have written before its storage event reaches this one.
      // Read the latest persisted snapshot unless it would discard unsaved changes.
      if (!unsaved) {
        try {
          const saved = getStorage().getItem(key);
          if (saved !== null) snapshot = decode(saved);
        } catch {/* keep the coherent snapshot already in this tab */}
      }
      const next = updater(snapshot);
      if (!validate(next)) throw new Error('A alteração produziu dados inválidos.');
      try {
        getStorage().setItem(key, JSON.stringify(next));
        status = null;
        unsaved = false;
      } catch {
        unsaved = true;
        status = 'Não foi possível salvar neste navegador. As alterações ficam apenas nesta aba e podem se perder ao recarregar.';
      }
      snapshot = next;
      emit();
      return next;
    },
    sync(event) {
      if (event.key !== key && event.key !== null) return;
      if (unsaved) {
        status = 'Há alterações apenas nesta aba. Os dados de outra aba não foram aplicados para preservar essas alterações.';
        emit();
        return;
      }
      try {
        const saved = getStorage().getItem(key);
        snapshot = saved === null ? initialData() : decode(saved);
        status = null;
      } catch {
        status = 'Não foi possível atualizar os dados deste navegador. Os dados desta aba foram mantidos.';
      }
      emit();
    }
  };
}
