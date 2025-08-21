import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        outDir: 'public', // O Vite irá gerar os arquivos diretamente na pasta 'public'
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            publicDirectory: 'public', // Garante que o Laravel saiba a pasta de build
        }),
        react(),
    ],
});