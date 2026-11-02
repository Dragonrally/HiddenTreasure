import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Explicitly configure React 19 JSX transform
      jsxRuntime: 'automatic',
    }),
  ],
});