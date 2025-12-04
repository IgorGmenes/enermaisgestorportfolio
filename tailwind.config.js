/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ener: {
          navy: '#1B2B56',  // Azul Marinho EnerMais
          orange: '#F4A900', // Laranja EnerMais
          green: '#22c55e',  // Aprovado
          blue: '#3b82f6',   // Em revisão
          yellow: '#eab308', // Em rascunho
          gray: '#9ca3af',   // Em análise
        }
      }
    },
  },
  plugins: [],
}
