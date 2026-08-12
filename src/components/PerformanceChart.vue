<template>
  <div class="glass-panel p-6 mt-8 relative">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-semibold text-gray-100 flex items-center gap-2">
        <Activity class="w-6 h-6 text-primary" />
        Gráfico de Performance (Dinâmico)
      </h3>
      <span class="text-xs font-mono bg-surface/50 text-gray-400 px-3 py-1 rounded-full border border-white/5">
        Escala Logarítmica (Eixo X)
      </span>
    </div>
    
    <div class="h-[400px] w-full" v-if="historyData.length > 0">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    
    <div v-else class="h-[400px] w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-surface/30">
      <LineChartIcon class="w-12 h-12 text-gray-500 mb-3" />
      <p class="text-gray-400 font-medium">Nenhum dado no histórico.</p>
      <p class="text-sm text-gray-500">Faça cálculos no Playground para gerar o gráfico.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Activity, LineChart as LineChartIcon } from 'lucide-vue-next';
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

const { historyData } = defineProps({
  historyData: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Configurações visuais do gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
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
        title: function(context) {
          return `Cálculo para N = ${context[0].parsed.x.toLocaleString()}`;
        },
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(3) + ' ms';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      type: 'logarithmic', // Escala logarítmica expõe a diferença abismal do N de forma visível
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { 
        color: '#94A3B8',
        callback: function(value) {
          // Formatando os ticks do eixo X para ficarem bonitos (ex: N=10, N=100, N=1000)
          if (value === 1 || value === 10 || value === 100 || value === 1000 || value === 10000 || value === 100000 || value === 1000000) {
            return 'N=' + value.toLocaleString();
          }
          return ''; // Esconde os ticks intermediários bagunçados da escala log
        }
      },
      title: { display: true, text: 'Valor de N Calculado (Escala Logarítmica)', color: '#94A3B8' }
    },
    y: {
      type: 'linear',
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#94A3B8' },
      title: { display: true, text: 'Tempo (ms)', color: '#94A3B8' },
      beginAtZero: true
    }
  }
};

const chartData = computed(() => {
  // Ordena os dados pelo N 
  const sortedHistory = [...historyData].sort((a, b) => a.n - b.n);
  
  // Transforma os dados no formato {x, y} que é necessário para escalas numéricas/logarítmicas no eixo X
  const recursiveData = sortedHistory
    .filter(item => item.times.recursive !== null)
    .map(item => ({ x: item.n, y: item.times.recursive }));
    
  const memoData = sortedHistory
    .filter(item => item.times.memo !== null)
    .map(item => ({ x: item.n, y: item.times.memo }));
    
  const matrixData = sortedHistory
    .filter(item => item.times.matrix !== null)
    .map(item => ({ x: item.n, y: item.times.matrix }));

  return {
    datasets: [
      {
        label: 'Recursiva O(2^n)',
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        data: recursiveData,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Memoization O(n)',
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        data: memoData,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Matrizes O(log n)',
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        data: matrixData,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };
});
</script>
