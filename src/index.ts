import { afficher, combiner, contient, Intervalle, intervalle, seChevauchent, simplifier } from "./intervalle.js";

const i1 = intervalle(1, 9);
const i2 = intervalle(8, 10);
const i3 = intervalle(1, 3);
const i4 = intervalle(3, 7);
const i5 = intervalle(1, 2);

console.log(contient(i1, 3));
console.log(contient(i1, 0));
console.log(contient(i1, 10));

console.log(seChevauchent(i1, i2));
console.log(seChevauchent(i3, i2));
console.log(seChevauchent(i3, i4));

const ordonnes = [i5, i3, i4, i2];
console.log(
  simplifier(ordonnes)
    .map((i: Intervalle) => afficher(i))
    .join(","),
);
