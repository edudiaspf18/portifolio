export interface OrbitPosition {
  left: string;
  top: string;
}

const trim = (n: number): string => `${Number(n.toFixed(3))}%`;

// Posição em % de um item num círculo (raio 50% do contêiner), começando no topo e andando no sentido horário.
export function orbitPosition(index: number, count: number): OrbitPosition {
  const angle = (2 * Math.PI * index) / count;
  return {
    left: trim(50 + 50 * Math.sin(angle)),
    top: trim(50 - 50 * Math.cos(angle)),
  };
}
