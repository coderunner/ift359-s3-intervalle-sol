export type Intervalle = readonly [number, number];

export function intervalle(inf: number, sup: number): Intervalle {
  if (inf >= sup) {
    throw new Error(`La borne inférieure (${inf}) doit être inférieure à la borne supérieure (${sup})`);
  }
  return [inf, sup];
}

export function inf(i: Intervalle): number {
  return i[0];
}

export function sup(i: Intervalle): number {
  return i[1];
}

export function contient(i: Intervalle, n: number): boolean {
  return inf(i) <= n && n <= sup(i);
}

export function seChevauchent(i1: Intervalle, i2: Intervalle): boolean {
  return inf(i1) <= sup(i2) && inf(i2) <= sup(i1);
}

export function combiner(i1: Intervalle, i2: Intervalle): Intervalle {
  if (!seChevauchent(i1, i2)) {
    throw new Error(`Les intervalles doivent se chevaucher pour pouvoir les combiner`);
  }
  return intervalle(Math.min(inf(i1), inf(i2)), Math.max(sup(i1), sup(i2)));
}

// On suppose que les intervalles sont triés par ordre croissant de borne inférieure.
// Version simple, mais sous-optimale. Nous verrons comment améliorer au prochain cours.
export function simplifier(i: Intervalle[]): Intervalle[] {
  if (i.length <= 1) {
    return i;
  }
  const [i1, i2, ...reste] = i;
  if (seChevauchent(i1, i2)) {
    const c = combiner(i1, i2);
    return simplifier([c, ...reste]);
  }
  return [i1, ...simplifier([i2, ...reste])];
}

export function afficher(i: Intervalle): string {
  return `[${inf(i)}, ${sup(i)}]`;
}
