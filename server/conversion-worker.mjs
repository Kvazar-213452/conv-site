import { parentPort, workerData } from 'node:worker_threads';
import { convert, example, InputError } from './conversions.mjs';
try {
  const result = workerData.action === 'example'
    ? await example(workerData.slug)
    : await convert(workerData.slug, workerData.files, workerData.text, workerData.values, workerData.second ?? '');
  const bytes = new Uint8Array(result.bytes);
  parentPort.postMessage({ ok: true, result: { ...result, bytes } }, [bytes.buffer]);
} catch (error) {
  parentPort.postMessage({ ok: false, status: error instanceof InputError ? error.status : 400, error: error instanceof InputError ? error.message : 'Unable to convert this input. Check its format and selected options.' });
}
