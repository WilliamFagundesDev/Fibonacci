<template>
  <div class="glass-panel p-6 md:p-8 mt-12 relative overflow-hidden">
    <!-- Decorative background glow -->
    <div class="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"></div>
    
    <div class="relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent/10 rounded-lg">
            <LineChartIcon class="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-gray-100">
              Análise Específica: F(5), F(15) e F(30)
            </h2>
            <p class="text-gray-400 text-sm mt-1">Comparação direta dos tempos de execução entre as três abordagens</p>
          </div>
        </div>
        <button 
          @click="runCalculations" 
          :disabled="loading"
          class="bg-surface/50 hover:bg-surface border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <RefreshCw :class="{ 'animate-spin': loading }" class="w-4 h-4 text-gray-300" />
          Refazer Teste
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-white/10 rounded-xl bg-surface/30">
        <Loader2 class="w-10 h-10 text-accent animate-spin mb-4" />
        <p class="text-gray-300 font-medium">Medindo tempos de execução...</p>
        <p class="text-sm text-gray-500 mt-2">Calculando F(5), F(15) e F(30)</p>
      </div>
      
      <div v-else class="h-[400px] w-full bg-surface/20 rounded-xl border border-white/5 p-4">
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <!-- Tabela de Resultados do Teste Específico -->
      <div v-if="!loading" class="mt-8">
        <h3 class="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
          <TableIcon class="w-5 h-5 text-gray-400" />
          Tabela de Resultados (ms)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="data in results" :key="data.n" class="bg-surface/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <h4 class="text-xl font-bold text-white">F({{ data.n }})</h4>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-400 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-red-400"></div> Recursiva</span>
                <span class="font-mono text-gray-200 font-medium">{{ data.times.recursive.toFixed(4) }} ms</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-emerald-400"></div> Memoization</span>
                <span class="font-mono text-gray-200 font-medium">{{ data.times.memo.toFixed(4) }} ms</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-400"></div> Matrizes</span>
                <span class="font-mono text-gray-200 font-medium">{{ data.times.matrix.toFixed(4) }} ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { LineChart as LineChartIcon, Loader2, RefreshCw, Table as TableIcon } from 'lucide-vue-next';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
} from 'chart.js';
import { fibRecursive, fibMemoization, fibMatrix, measurePerformance } from '../utils/fibonacci';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

const loading = ref(true);
const results = ref([]);

const runCalculations = () => {
  loading.value = true;
  
  // Pequeno timeout para dar tempo da UI mostrar o loading
  setTimeout(() => {
    const cases = [5, 15, 30];
    const data = cases.map(n => ({
      n,
      times: {
        recursive: measurePerformance(fibRecursive, n).time,
        memo: measurePerformance(fibMemoization, n).time,
        matrix: measurePerformance(fibMatrix, n).time
      }
    }));
    results.value = data;
    loading.value = false;
  }, 100);
};

onMounted(() => {
  runCalculations();
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#E2E8F0',
        font: { family: "'Inter', sans-serif", size: 13 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#F8FAFC',
      bodyColor: '#CBD5E1',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            // Se for log, valores mto pequenos foram convertidos p 0.0001
            const val = context.raw <= 0.0001 ? 0 : context.raw;
            label += val.toFixed(4) + ' ms';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#94A3B8', font: { size: 14, weight: 'bold' } }
    },
    y: {
      type: 'logarithmic', // Escala logarítmica é essencial aqui, pois Recursiva F(30) é gigantesca perto de matrizes F(5)
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { 
        color: '#94A3B8',
        callback: function(value) {
          if (value === 0.001 || value === 0.01 || value === 0.1 || value === 1 || value === 10 || value === 100) {
            return value + ' ms';
          }
          return '';
        }
      },
      title: { display: true, text: 'Tempo (ms) - Escala Logarítmica', color: '#94A3B8' },
    }
  }
};

const chartData = computed(() => {
  return {
    labels: results.value.map(r => `F(${r.n})`),
    datasets: [
      {
        label: 'Recursiva O(2^n)',
        backgroundColor: '#EF4444',
        borderColor: '#B91C1C',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: results.value.map(r => Math.max(r.times.recursive, 0.001)),
      },
      {
        label: 'Memoization O(n)',
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: results.value.map(r => Math.max(r.times.memo, 0.001)),
      },
      {
        label: 'Matrizes O(log n)',
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: results.value.map(r => Math.max(r.times.matrix, 0.001)),
      }
    ]
  };
});
</script>
