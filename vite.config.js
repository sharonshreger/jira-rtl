import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const contentConfig = {
	build: {
		outDir: 'dist',
		emptyOutDir: true, // only the first build empties the output folder
		target: 'es2022',
		rollupOptions: {
			input: resolve(__dirname, 'src/content/main.js'),
			output: {
				inlineDynamicImports: true,
				entryFileNames: 'assets/jira-rtl.js',
				assetFileNames: assetInfo => {
					if (assetInfo.name && assetInfo.name.endsWith('.css')) {
						return 'assets/jira-rtl.css';
					}
					return 'assets/[name].[hash][extname]';
				},
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: 'manifest.json', dest: '.' },
				{ src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'assets' },
				{ src: 'icons', dest: '.' },
			],
		}),
	],
};

const popupConfig = {
	build: {
		outDir: 'dist',
		emptyOutDir: false, // The output folder is already emptied in the first config
		target: 'es2022',
		rollupOptions: {
			input: resolve(__dirname, 'popup.html'),
			output: {
				entryFileNames: 'assets/[name].js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name][extname]',
			},
		},
	},
};

// Apply mode with: "vite build --mode {parameter}"
export default defineConfig(({ mode }) => {
	if (mode === 'content') return contentConfig;
	if (mode === 'popup') return popupConfig;

	return contentConfig;
});
