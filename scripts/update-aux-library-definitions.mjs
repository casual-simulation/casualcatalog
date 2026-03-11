/**
 * Downloads the latest AuxLibraryDefinitions type definitions from a
 * CDN and writes them to types/AuxLibraryDefinitions.d.ts.
 *
 * Source:
 *   https://cdn.jsdelivr.net/gh/casual-simulation/casualos@master/src/aux-runtime/runtime/AuxLibraryDefinitions.def
 *
 * Destination:
 *   types/AuxLibraryDefinitions.d.ts
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_URL = 'https://cdn.jsdelivr.net/gh/casual-simulation/casualos@master/src/aux-runtime/runtime/AuxLibraryDefinitions.def';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'types', 'AuxLibraryDefinitions.d.ts');

async function main() {
    console.log(`Fetching: ${SOURCE_URL}`);

    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
        throw new Error(
            `Failed to download definitions: ${response.status} ${response.statusText}`
        );
    }

    const content = await response.text();

    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, content, 'utf-8');

    const lines = content.split('\n').length;
    console.log(`Written ${lines} lines → ${OUTPUT_PATH}`);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
