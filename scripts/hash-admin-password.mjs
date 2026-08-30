import { pbkdf2Sync, randomBytes } from 'node:crypto';
import process from 'node:process';

const ITERATIONS = 210_000;
const MINIMUM_LENGTH = 12;

function base64Url(value) {
  return value.toString('base64url');
}

function readHidden(prompt) {
  if (!process.stdin.isTTY || !process.stdout.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Dieser Befehl muss in einem interaktiven Terminal ausgeführt werden.');
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  return new Promise((resolve, reject) => {
    let value = '';

    const finish = () => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
    };

    const onData = (input) => {
      for (const character of input) {
        if (character === '\u0003') {
          finish();
          reject(new Error('Abgebrochen.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          finish();
          resolve(value);
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= ' ') value += character;
      }
    };

    process.stdin.on('data', onData);
  });
}

try {
  const password = await readHidden('Neues Pflege-Passwort: ');
  if (password.length < MINIMUM_LENGTH) throw new Error(`Das Passwort muss mindestens ${MINIMUM_LENGTH} Zeichen lang sein.`);

  const confirmation = await readHidden('Passwort wiederholen: ');
  if (password !== confirmation) throw new Error('Die Passwörter stimmen nicht überein.');

  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  process.stdout.write(`\nDiesen vollständigen Hash als ADMIN_PASSWORD_HASH speichern:\n\npbkdf2_sha256:${ITERATIONS}:${base64Url(salt)}:${base64Url(hash)}\n`);
} catch (error) {
  process.stderr.write(`\n${error instanceof Error ? error.message : 'Das Passwort konnte nicht verarbeitet werden.'}\n`);
  process.exitCode = 1;
}
