import { Worker } from 'node:worker_threads';
import path from 'node:path';
import { SERVER_SLUGS } from '@/server/conversions.mjs';
export { SERVER_SLUGS };
export type ConversionJob = { action: 'convert' | 'example'; slug: string; files?: { name: string; bytes: Uint8Array }[]; text?: string; second?: string; values?: Record<string, string> };
export type ConversionOutput = { bytes: Uint8Array<ArrayBuffer>; name: string; type: string };
export class ConversionFailure extends Error { constructor(message: string, public status = 400) { super(message); } }
let active = 0;
export async function runConversion(job: ConversionJob, signal?: AbortSignal): Promise<ConversionOutput> {
  if (!SERVER_SLUGS.includes(job.slug)) throw new ConversionFailure('Unknown conversion.', 404);
  if (active >= 2) throw new ConversionFailure('Two conversions are already running. Please try again shortly.', 429);
  if (signal?.aborted) throw new ConversionFailure('Request cancelled.', 499);
  active++;
  try {
    return await new Promise((resolve, reject) => {
      const worker = new Worker(path.join(process.cwd(), 'server/conversion-worker.mjs'), {
        workerData: job,
        resourceLimits: { maxOldGenerationSizeMb: 256, maxYoungGenerationSizeMb: 32, stackSizeMb: 8 },
      });
      let settled = false;
      const finish = (result: ConversionOutput | null, error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener('abort', cancel);
        void worker.terminate().then(() => error ? reject(error) : resolve(result!), reject);
      };
      const cancel = () => finish(null, new ConversionFailure('Request cancelled.', 499));
      const timer = setTimeout(() => finish(null, new ConversionFailure('Conversion exceeded 25 seconds. Use a smaller input.', 504)), 25000);
      signal?.addEventListener('abort', cancel, { once: true });
      worker.on('message', message => {
        if (typeof message.ok !== 'boolean') return finish(null, new ConversionFailure('Invalid converter response.', 422));
        if (!message.ok) return finish(null, new ConversionFailure(message.error, message.status === 413 ? 413 : 400));
        if (message.result.bytes.length > 4 * 1024 * 1024) return finish(null, new ConversionFailure('Converted output exceeds 4 MiB. Try a smaller input or lower output quality.', 413));
        finish(message.result);
      });
      worker.once('error', () => finish(null, new ConversionFailure('Conversion exceeded its memory allowance or could not process this file.', 422)));
      worker.once('exit', code => { if (!settled) finish(null, new ConversionFailure('Conversion worker stopped unexpectedly (' + code + ').', 422)); });
      if (signal?.aborted) cancel();
    });
  } finally { active--; }
}
