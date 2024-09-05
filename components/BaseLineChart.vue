<template>
    <div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart } from 'chart.js/auto';
  
  export default {
     name: 'BaseLineChart',
     props: {
       data: {
         type: Object,
         required: true
       }
     },
     mounted() {
       this.renderChart();
     },
     methods: {
       renderChart() {
         new Chart(this.$refs.lineChart, {
           type: 'line',
           data: this.data,
           options: {
             responsive: true,
             maintainAspectRatio: false
           }
         });
       }
     }
  };
  </script>
  
  <style scoped>
  /* canvas {
    width: 100%;
    height: 400px;
  } */
  </style>
  