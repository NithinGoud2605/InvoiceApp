// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [
    // Enables React fast refresh and JSX transformation
    react({
      // Additional options can be added here if needed
      fastRefresh: true,
    }),
    // Tailwind CSS integration
    tailwindcss(),
    // Optional: Generates bundle analysis report after build
  ],
  server: {
    hmr: true,  // Hot Module Replacement enabled (default in Vite)
  },

    // Optionally adjust the chunk size warning limit if needed
    chunkSizeWarningLimit: 600,
  
});
