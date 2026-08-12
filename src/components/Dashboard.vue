<template>
  <!-- Full Screen Initial App Loader -->
  <div v-if="isAppLoading" class="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
    <div class="relative flex items-center justify-center">
      <div class="absolute w-24 h-24 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      <div class="absolute w-16 h-16 border-b-4 border-accent border-solid rounded-full animate-[spin_1.5s_linear_reverse]"></div>
      <Sparkles class="w-8 h-8 text-white animate-pulse" />
    </div>
    <h2 class="mt-8 text-xl text-gray-300 font-medium tracking-widest uppercase animate-pulse">Inicializando Motor Matemático</h2>
    <p class="text-sm text-gray-500 mt-2">Calculando F(500.000) por Matrizes...</p>
  </div>

  <!-- Full Screen Calculation Loader -->
  <div v-if="isCalculatingCustom" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
    <Loader2 class="w-16 h-16 text-primary animate-spin mb-6" />
    <h2 class="text-2xl text-white font-semibold mb-2">Processando Cálculo</h2>
    <p class="text-gray-400">Aguarde... N = {{ customN }}</p>
    <p v-if="calcMode === 'recursive' || calcMode === 'all'" class="text-red-400 text-sm mt-4 animate-pulse">
      Aviso: Processando Árvore Exponencial (O(2^n))...
    </p>
  </div>

  <div v-show="!isAppLoading" class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
    <!-- Header Section -->
    <header class="text-center space-y-4">
      <div class="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
        <Sparkles class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gradient">
        Fibonacci em Foco: Análise de Algoritmos
      </h1>
      <p class="max-w-2xl mx-auto text-lg text-gray-400">
        A sequência de Fibonacci é uma série matemática onde cada número é a soma dos dois anteriores: 
        <span class="font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded">0, 1, 1, 2, 3, 5, 8...</span>
        Explore como diferentes abordagens algorítmicas impactam drasticamente a performance.
      </p>
    </header>

    <!-- Static Test Cases -->
    <section>
      <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-2">
          <Zap class="w-5 h-5 text-secondary" />
          <h2 class="text-2xl font-semibold">Casos de Teste Padrão</h2>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="test in staticTests" :key="test.n" class="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-100">F({{ test.n.toLocaleString() }})</h3>
            <span class="text-sm font-mono text-gray-400 border border-white/10 bg-surface px-2 py-1 rounded">N = {{ test.n.toLocaleString() }}</span>
          </div>
          
          <div class="text-xl md:text-2xl font-mono mb-6 text-primary truncate" :title="test.result">
            {{ test.result }}
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm items-center">
              <span class="text-gray-400 flex items-center gap-1"><IterationCcw class="w-4 h-4 text-red-400"/> Recursiva</span>
              <span v-if="test.times.recursive !== null" class="font-mono text-gray-200">{{ test.times.recursive.toFixed(3) }} ms</span>
              <span v-else class="font-mono text-red-400 text-xs px-2 py-1 bg-red-400/10 rounded border border-red-400/20">Impraticável (Milênios)</span>
            </div>
            <div class="flex justify-between text-sm items-center">
              <span class="text-gray-400 flex items-center gap-1"><Database class="w-4 h-4 text-emerald-400"/> Memoization</span>
              <span class="font-mono text-gray-200">{{ test.times.memo.toFixed(3) }} ms</span>
            </div>
            <div class="flex justify-between text-sm items-center">
              <span class="text-gray-400 flex items-center gap-1"><Grid class="w-4 h-4 text-blue-400"/> Matrizes</span>
              <span class="font-mono text-gray-200">{{ test.times.matrix.toFixed(3) }} ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Playground with History -->
    <section class="glass-panel p-6 md:p-8 relative overflow-hidden">
      <!-- Decorative background glow -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-6">
          <Terminal class="w-5 h-5 text-accent" />
          <h2 class="text-2xl font-semibold">Playground Interativo</h2>
        </div>
        
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 class="text-red-400 font-medium mb-1">Aviso de Performance (Sem Limites)</h4>
            <p class="text-sm text-red-200/80">
              A trava de segurança da função Recursiva foi <strong>removida</strong> conforme solicitado. 
              Valores acima de 40 podem causar lentidão extrema e travar o navegador devido à complexidade O(2^n). 
              Prossiga com cautela!
            </p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="calculateCustom" class="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <div class="flex-1 w-full relative">
            <label class="block text-sm text-gray-400 mb-2">Valor de N</label>
            <input 
              v-model.number="customN" 
              type="number" 
              min="0"
              class="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Digite um valor ex: 35..."
              required
            />
          </div>

          <div class="flex-1 w-full relative">
            <label class="block text-sm text-gray-400 mb-2">Método de Cálculo</label>
            <select 
              v-model="calcMode"
              class="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Calcular os 3 Métodos</option>
              <option value="recursive">Somente Recursiva O(2^n)</option>
              <option value="memo">Somente Memoization O(n)</option>
              <option value="matrix">Somente Matrizes O(log n)</option>
            </select>
          </div>

          <button 
            type="submit" 
            :disabled="isCalculatingCustom"
            class="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 flex items-center justify-center min-w-[160px] h-[50px]"
          >
            <Loader2 v-if="isCalculatingCustom" class="w-5 h-5 animate-spin" />
            <span v-else>Calcular F(N)</span>
          </button>
        </form>

        <!-- Último Resultado Customizado -->
        <div v-if="customResults" class="space-y-6 mb-12">
          <div class="bg-surface/50 rounded-xl p-4 border border-white/5">
            <span class="text-sm text-gray-400 uppercase tracking-wider font-semibold block mb-2">Resultado Matemático (Último Cálculo: N={{ customResults.n }})</span>
            <div class="font-mono text-xl text-white break-all max-h-40 overflow-y-auto custom-scrollbar">
              {{ customResults.result }}
            </div>
          </div>
        </div>
        
        <!-- Histórico de Cálculos Gravados -->
        <div v-if="history.length > 0">
          <div class="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <HistoryIcon class="w-5 h-5 text-gray-400" />
            <h3 class="text-lg font-medium text-gray-200">Histórico de Cálculos Gravados</h3>
          </div>
          <div class="overflow-x-auto rounded-xl border border-white/5 bg-surface/30">
            <table class="w-full text-left text-sm">
              <thead class="bg-surface/50 text-gray-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Valor de N</th>
                  <th class="px-4 py-3 font-semibold text-red-400">Tempo Recursiva</th>
                  <th class="px-4 py-3 font-semibold text-emerald-400">Tempo Memoization</th>
                  <th class="px-4 py-3 font-semibold text-blue-400">Tempo Matrizes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="(item, idx) in history.slice().reverse()" :key="idx" class="hover:bg-surface/50 transition-colors">
                  <td class="px-4 py-3 font-mono font-medium text-white">F({{ item.n.toLocaleString() }})</td>
                  <td class="px-4 py-3 font-mono">{{ item.times.recursive !== null ? item.times.recursive.toFixed(3) + ' ms' : '-' }}</td>
                  <td class="px-4 py-3 font-mono">{{ item.times.memo !== null ? item.times.memo.toFixed(3) + ' ms' : '-' }}</td>
                  <td class="px-4 py-3 font-mono">{{ item.times.matrix !== null ? item.times.matrix.toFixed(3) + ' ms' : '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-gray-500 mt-2">* Estes dados alimentam dinamicamente o Gráfico de Performance abaixo.</p>
        </div>
      </div>
    </section>

    <!-- Dynamic Charts Section -->
    <PerformanceChart :history-data="history" />

    <!-- Analysis Report -->
    <section class="glass-panel p-6 md:p-10">
      <div class="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
        <BookOpen class="w-6 h-6 text-primary" />
        <h2 class="text-3xl font-semibold text-gray-100">Relatório de Análise</h2>
      </div>
      
      <article class="prose prose-invert max-w-none text-gray-300">
        <h3 class="text-2xl text-white mb-4">O que os gráficos nos dizem sobre a performance?</h3>
        <p class="mb-4 leading-relaxed">
          Através da análise da Notação Big-O, fica evidente o motivo da discrepância monstruosa nos tempos de execução à medida que `N` aumenta:
        </p>
        <ul class="space-y-4 mb-8 list-none pl-0">
          <li class="bg-surface/30 p-4 rounded-lg border border-white/5">
            <strong class="text-red-400 flex items-center gap-2 mb-1"><IterationCcw class="w-4 h-4"/> Abordagem Recursiva:</strong> 
            Possui crescimento exponencial <code class="text-secondary bg-surface px-1 rounded">O(2^n)</code>. Para cada N, a árvore de chamadas dobra. F(40) já realiza milhões de operações repetidas. É o pior cenário possível.
          </li>
          <li class="bg-surface/30 p-4 rounded-lg border border-white/5">
            <strong class="text-emerald-400 flex items-center gap-2 mb-1"><Database class="w-4 h-4"/> Abordagem com Memoization:</strong> 
            Apresenta crescimento linear <code class="text-secondary bg-surface px-1 rounded">O(n)</code>. Calculamos cada estado apenas uma vez, reutilizando os subproblemas. Gráficamente, é uma linha plana em zero milissegundos para valores pequenos.
          </li>
          <li class="bg-surface/30 p-4 rounded-lg border border-white/5">
            <strong class="text-blue-400 flex items-center gap-2 mb-1"><Grid class="w-4 h-4"/> Abordagem por Matrizes:</strong> 
            Demonstra crescimento logarítmico <code class="text-secondary bg-surface px-1 rounded">O(log n)</code>. Graças à propriedade da exponenciação rápida de matrizes, podemos calcular F(500.000) em frações de segundo.
          </li>
        </ul>

        <h3 class="text-2xl text-white mb-4 mt-12">Qual o maior número que conseguiríamos calcular em cada versão?</h3>
        <p class="mb-4 leading-relaxed">
          Testando os limites computacionais do navegador baseados nas abstrações implementadas:
        </p>
        <div class="grid md:grid-cols-3 gap-6 mb-4">
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-red-300">Recursiva</h4>
            <p class="text-sm">No navegador, falha geralmente entre <strong>N=40 e N=45</strong>. O tempo torna-se impraticável (horas/dias) e ocorre o estouro da pilha de chamadas (Call Stack Exceeded).</p>
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-emerald-300">Memoization (Iterativa)</h4>
            <p class="text-sm">Limitada estritamente pela alocação de array e iterações. Pode calcular facilmente <strong>milhares ou milhões</strong>, mas esbarrará em limites de Heap Memory da Engine V8 (JS).</p>
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-blue-300">Matrizes</h4>
            <p class="text-sm">Graças ao <code>BigInt</code> e complexidade logarítmica, o tempo de cálculo não é problema. O gargalo torna-se apenas a memória RAM necessária para <strong>alocar a String resultante gigante</strong>.</p>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  Sparkles, Zap, Terminal, Activity, 
  IterationCcw, Database, Grid, 
  AlertTriangle, Loader2, BookOpen, History as HistoryIcon 
} from 'lucide-vue-next';
import { fibRecursive, fibMemoization, fibMatrix, measurePerformance } from '../utils/fibonacci';
import PerformanceChart from './PerformanceChart.vue';

const isAppLoading = ref(true);

// Histórico de cálculos feitos no playground
const history = ref([]);

// Estado dos cartões estáticos superiores
const staticTests = ref([]);

// Estado do formulário
const customN = ref(null);
const calcMode = ref('all');
const isCalculatingCustom = ref(false);
const customResults = ref(null);

onMounted(() => {
  // Configurando exatamente como pedido:
  // F(40) executando todos
  // F(500000) executando apenas Memoization e Matrix, e omitindo Recursive
  
  // Como as operações na main thread bloqueiam o rendering do Loader inicial,
  // vamos deferir a carga estática via setTimeout
  setTimeout(() => {
    
    // 1. Caso F(40)
    const tMemo40 = measurePerformance(fibMemoization, 40);
    const tMatrix40 = measurePerformance(fibMatrix, 40);
    const tRecursive40 = measurePerformance(fibRecursive, 40);
    
    // 2. Caso F(500000)
    const tMemo500k = measurePerformance(fibMemoization, 500000);
    const tMatrix500k = measurePerformance(fibMatrix, 500000);
    // Recursiva nem tenta!
    
    staticTests.value = [
      {
        n: 40,
        result: tMatrix40.result,
        times: {
          recursive: tRecursive40.time,
          memo: tMemo40.time,
          matrix: tMatrix40.time
        }
      },
      {
        n: 500000,
        result: tMatrix500k.result,
        times: {
          recursive: null, // Proibido para N grandes
          memo: tMemo500k.time,
          matrix: tMatrix500k.time
        }
      }
    ];
    
    // Preenche a history pre-calculada para o gráfico também mostrar a diferença colossal do 40 pro 500k
    // Adicionamos valores menores também para o gráfico ter o desenho da curva inicial
    const baseCases = [5, 10, 20, 30];
    baseCases.forEach(n => {
      history.value.push({
        n,
        times: {
          recursive: measurePerformance(fibRecursive, n).time,
          memo: measurePerformance(fibMemoization, n).time,
          matrix: measurePerformance(fibMatrix, n).time,
        }
      });
    });
    
    // E joga na history as duas estrelas do show
    history.value.push({
      n: 40,
      times: {
        recursive: tRecursive40.time,
        memo: tMemo40.time,
        matrix: tMatrix40.time
      }
    });
    
    history.value.push({
      n: 500000,
      times: {
        recursive: null, // Gráfico saberá ignorar o ponto da recursiva
        memo: tMemo500k.time,
        matrix: tMatrix500k.time
      }
    });

    isAppLoading.value = false;
  }, 100);
});

const calculateCustom = async () => {
  if (customN.value === null || customN.value < 0) return;
  
  isCalculatingCustom.value = true;
  
  const n = customN.value;
  const mode = calcMode.value;
  
  setTimeout(() => {
    let tMemo = { time: null };
    let tMatrix = { time: null, result: "Não executado (Matrizes não selecionada)" };
    let tRecursive = { time: null };
    
    if (mode === 'all' || mode === 'matrix') {
      tMatrix = measurePerformance(fibMatrix, n);
    }
    
    if (mode === 'all' || mode === 'memo') {
      tMemo = measurePerformance(fibMemoization, n);
      if (mode === 'memo') tMatrix.result = tMemo.result; 
    }
    
    if (mode === 'all' || mode === 'recursive') {
      tRecursive = measurePerformance(fibRecursive, n);
      if (mode === 'recursive') tMatrix.result = tRecursive.result;
    }
    
    customResults.value = {
      n: n,
      result: tMatrix.result,
      times: {
        recursive: tRecursive.time,
        memo: tMemo.time,
        matrix: tMatrix.time
      }
    };
    
    const existingIndex = history.value.findIndex(h => h.n === n);
    if (existingIndex !== -1) {
      if (tRecursive.time !== null) history.value[existingIndex].times.recursive = tRecursive.time;
      if (tMemo.time !== null) history.value[existingIndex].times.memo = tMemo.time;
      if (tMatrix.time !== null) history.value[existingIndex].times.matrix = tMatrix.time;
    } else {
      history.value.push({
        n: n,
        times: {
          recursive: tRecursive.time,
          memo: tMemo.time,
          matrix: tMatrix.time
        }
      });
    }
    
    isCalculatingCustom.value = false;
  }, 100);
};
</script>
