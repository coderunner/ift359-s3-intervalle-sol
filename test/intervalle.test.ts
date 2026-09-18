import { describe, it, expect } from "vitest";
import { intervalle, inf, sup, contient, seChevauchent, combiner, simplifier } from "../src/intervalle.js";

describe("Barrière d'abstraction : Constructeur et Sélecteurs", () => {
  it("construit un intervalle valide et extrait ses bornes", () => {
    const i = intervalle(2, 8);
    expect(inf(i)).toBe(2);
    expect(sup(i)).toBe(8);
  });

  it("lève une erreur si la borne inférieure est supérieure ou égale à la supérieure", () => {
    expect(() => intervalle(5, 2)).toThrow(/borne inférieure/);
    expect(() => intervalle(3, 3)).toThrow(/borne inférieure/);
  });
});

describe("Prédicats et Mesures", () => {
  const i = intervalle(10, 20);

  it("vérifie l'appartenance d'une valeur avec contient", () => {
    expect(contient(i, 10)).toBe(true);
    expect(contient(i, 15)).toBe(true);
    expect(contient(i, 20)).toBe(true);
    expect(contient(i, 9.99)).toBe(false);
    expect(contient(i, 20.01)).toBe(false);
  });
});

describe("Prédicat : seChevauchent", () => {
  it("détecte une intersection partielle", () => {
    const i1 = intervalle(1, 5);
    const i2 = intervalle(4, 8);
    expect(seChevauchent(i1, i2)).toBe(true);
    expect(seChevauchent(i2, i1)).toBe(true);
  });

  it("détecte le chevauchement sur une borne commune [1, 4] et [4, 7]", () => {
    const i1 = intervalle(1, 4);
    const i2 = intervalle(4, 7);
    expect(seChevauchent(i1, i2)).toBe(true);
    expect(seChevauchent(i2, i1)).toBe(true);
  });

  it("détecte l'inclusion totale d'un sous-intervalle", () => {
    const grand = intervalle(0, 10);
    const petit = intervalle(3, 7);
    expect(seChevauchent(grand, petit)).toBe(true);
    expect(seChevauchent(petit, grand)).toBe(true);
  });

  it("renvoie false pour deux intervalles disjoints", () => {
    const i1 = intervalle(1, 3);
    const i2 = intervalle(5, 8);
    expect(seChevauchent(i1, i2)).toBe(false);
    expect(seChevauchent(i2, i1)).toBe(false);
  });
});

describe("Opérateur : combiner", () => {
  it("fusionne deux intervalles sécants en englobant les deux", () => {
    const i1 = intervalle(2, 6);
    const i2 = intervalle(4, 9);
    const res = combiner(i1, i2);

    expect(inf(res)).toBe(2);
    expect(sup(res)).toBe(9);
  });

  it("fusionne lorsqu'un intervalle est inclus dans l'autre", () => {
    const i1 = intervalle(1, 10);
    const i2 = intervalle(3, 6);
    const res = combiner(i1, i2);

    expect(inf(res)).toBe(1);
    expect(sup(res)).toBe(10);
  });

  it("lève une exception si les intervalles ne se chevauchent pas", () => {
    const i1 = intervalle(1, 3);
    const i2 = intervalle(5, 8);
    expect(() => combiner(i1, i2)).toThrow(/doivent se chevaucher/);
  });
});

describe("Opérateur : simplifier (sur liste triée par borne inférieure)", () => {
  it("gère les cas de base : liste vide et singleton", () => {
    expect(simplifier([])).toEqual([]);
    const unique = [intervalle(1, 5)];
    expect(simplifier(unique)).toEqual(unique);
  });

  it("conserve intacts des intervalles déjà disjoints", () => {
    const disjoints = [intervalle(1, 3), intervalle(5, 7), intervalle(9, 12)];
    const res = simplifier(disjoints);

    expect(res.map((i) => [inf(i), sup(i)])).toEqual([
      [1, 3],
      [5, 7],
      [9, 12],
    ]);
  });

  it("fusionne une chaîne d'intervalles sécants consécutifs", () => {
    // [1, 4] et [3, 7] -> [1, 7], puis [1, 7] et [6, 10] -> [1, 10]
    const chaine = [intervalle(1, 4), intervalle(3, 7), intervalle(6, 10)];
    const res = simplifier(chaine);

    expect(res).toHaveLength(1);
    expect(inf(res[0])).toBe(1);
    expect(sup(res[0])).toBe(10);
  });

  it("absorbe les intervalles entièrement inclus", () => {
    const avecInclusions = [intervalle(1, 10), intervalle(2, 4), intervalle(5, 8), intervalle(12, 15)];
    const res = simplifier(avecInclusions);

    expect(res.map((i) => [inf(i), sup(i)])).toEqual([
      [1, 10],
      [12, 15],
    ]);
  });

  it("simplifie un ensemble mixte alternant fusions et séparations", () => {
    const liste = [intervalle(1, 3), intervalle(2, 6), intervalle(8, 10), intervalle(9, 12), intervalle(15, 18)];
    const res = simplifier(liste);

    expect(res.map((i) => [inf(i), sup(i)])).toEqual([
      [1, 6],
      [8, 12],
      [15, 18],
    ]);
  });
});
