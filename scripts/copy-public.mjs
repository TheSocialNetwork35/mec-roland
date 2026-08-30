import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('public');
const target = resolve('dist/client');

if (!existsSync(source)) process.exit(0);
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true, force: true });
