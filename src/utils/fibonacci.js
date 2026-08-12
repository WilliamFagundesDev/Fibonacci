/**
 * Utilitários para cálculo da Sequência de Fibonacci e medição de performance.
 * Utiliza BigInt para suportar números enormes que ultrapassam o limite seguro do JavaScript (Number.MAX_SAFE_INTEGER).
 */

// 1. Abordagem Recursiva Clássica
// O(2^n) - Crescimento exponencial. Extremamente lenta para N > 40.
// ATENÇÃO: Sem trava de segurança conforme solicitado pelo usuário. Pode travar a aba do navegador para N grande.
export function fibRecursive(n) {
  if (n <= 0) return 0n;
  if (n === 1) return 1n;
  // Precisamos converter os argumentos de volta para number, pois a função espera um número,
  // mas o BigInt é retornado. A entrada 'n' é tratada como Number para controle de fluxo.
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 2. Abordagem com Memoization / Programação Dinâmica (Iterativa Bottom-Up)
// O(n) - Crescimento linear. Muito rápida, limite é a memória para armazenar o array ou limite de iterações.
export function fibMemoization(n) {
  if (n <= 0) return 0n;
  if (n === 1) return 1n;
  
  let a = 0n;
  let b = 1n;
  let temp;
  
  for (let i = 2; i <= n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  
  return b;
}

// 3. Abordagem de Exponenciação de Matrizes
// O(log n) - Crescimento logarítmico. Incrivelmente rápida, ideal para números gigantescos (ex: N = 1.000.000).
function multiplyMatrix(F, M) {
  const x = F[0][0] * M[0][0] + F[0][1] * M[1][0];
  const y = F[0][0] * M[0][1] + F[0][1] * M[1][1];
  const z = F[1][0] * M[0][0] + F[1][1] * M[1][0];
  const w = F[1][0] * M[0][1] + F[1][1] * M[1][1];
  
  F[0][0] = x;
  F[0][1] = y;
  F[1][0] = z;
  F[1][1] = w;
}

function powerMatrix(F, n) {
  if (n === 0 || n === 1) return;
  
  const M = [[1n, 1n], [1n, 0n]];
  
  powerMatrix(F, Math.floor(n / 2));
  multiplyMatrix(F, F);
  
  if (n % 2 !== 0) {
    multiplyMatrix(F, M);
  }
}

export function fibMatrix(n) {
  if (n <= 0) return 0n;
  
  const F = [[1n, 1n], [1n, 0n]];
  powerMatrix(F, n - 1);
  
  return F[0][0];
}

/**
 * Função Wrapper para medir o tempo de execução de qualquer função de Fibonacci.
 * 
 * @param {Function} fn Função a ser executada
 * @param {Number} n O valor de N
 * @returns {Object} Um objeto contendo o { resultado, tempoMs }
 */
export function measurePerformance(fn, n) {
  const t0 = performance.now();
  const result = fn(n);
  const t1 = performance.now();
  
  // Evitar conversão .toString() em BigInts massivos (n > 10000) que podem travar a main thread do navegador
  let resultStr = '';
  if (n > 10000) {
    // Cálculo aproximado do número de dígitos de F(n) -> n * log10(phi)
    const digits = Math.floor(n * 0.2089876) + 1;
    resultStr = `[Número Colossal com aprox. ${digits.toLocaleString()} dígitos computado na memória]`;
  } else {
    resultStr = result.toString();
  }
  
  return {
    result: resultStr, // Converte ou oculta dependendo do tamanho
    time: (t1 - t0) // Tempo em milissegundos (float)
  };
}
