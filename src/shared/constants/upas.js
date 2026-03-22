// UPAs disponíveis no sistema
export const UPAS = {
  JANGURUSSU: {
    id: 'jangurussu',
    name: 'UPA Jangurussu',
    slug: 'jangurussu'
  },
  EDSON_QUEIROZ: {
    id: 'edson-queiroz',
    name: 'UPA Edson Queiroz',
    slug: 'edson-queiroz'
  },
  ITAPERI: {
    id: 'itaperi',
    name: 'UPA Itaperi',
    slug: 'itaperi'
  }
};

// Array de UPAs para iteração
export const UPAS_LIST = Object.values(UPAS);

// Mapear slug para UPA
export const getUpaBySlug = (slug) => {
  return UPAS_LIST.find(upa => 
    upa.id === slug || upa.slug === slug
  );
};

