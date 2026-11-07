import { runConversion, SERVER_SLUGS, ConversionFailure, type ConversionOutput } from '@/lib/server-conversion-runner';
import { growthTools } from '@/lib/growth-tools';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
let uploads=0;
const MAX_BODY=4*1024*1024+64*1024;
const headers={ 'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff' };
type Context={params:Promise<{slug:string}>};
function fail(error:unknown){const known=error instanceof ConversionFailure;return Response.json({error:known?error.message:'Unable to read the conversion request.'},{status:known?error.status:400,headers:{...headers,...(known&&error.status===429?{'Retry-After':'2'}:{})}});}
function output(result:ConversionOutput){if(result.bytes.length>4*1024*1024)throw new ConversionFailure("Converted output exceeds 4 MiB. Try a smaller input or lower output quality.",413);return new Response(result.bytes,{headers:{...headers,'Content-Type':result.type,'Content-Disposition':`attachment; filename="${result.name.replace(/[^a-zA-Z0-9._-]/g,'_')}"`,'Content-Length':String(result.bytes.length)}});}
async function readLimited(request:Request){
  const declared=request.headers.get('content-length');if(declared&&Number(declared)>MAX_BODY)throw new ConversionFailure('Request must not exceed 4 MiB plus 64 KiB including upload framing.',413);
  if(!request.body)throw new ConversionFailure('Missing request body.');
  const reader=request.body.getReader(),chunks:Uint8Array[]=[];let total=0,expired=false;
  const timer=setTimeout(()=>{expired=true;void reader.cancel();},10000);
  try{while(true){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>MAX_BODY){await reader.cancel();throw new ConversionFailure('Request body is too large.',413);}chunks.push(value);}if(expired)throw new ConversionFailure('Upload exceeded 10 seconds. Try a smaller input.',408);}finally{clearTimeout(timer);reader.releaseLock();}
  const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
}
export async function POST(request:Request,context:Context){
  if(uploads>=2)return fail(new ConversionFailure('Two uploads are already being handled. Please try again shortly.',429));
  uploads++;
  try{
    const {slug}=await context.params,tool=growthTools.find(t=>t.slug===slug&&t.server);
    if(!tool||!SERVER_SLUGS.includes(slug))throw new ConversionFailure('Unknown conversion.',404);
    const origin=request.headers.get('origin');
    if(origin){
      try{
        const source=new URL(origin);
        const host=(request.headers.get('x-forwarded-host')??request.headers.get('host')??new URL(request.url).host).split(',')[0].trim();
        const expected=new URL(source.protocol+'//'+host);
        if(!['http:','https:'].includes(source.protocol)||source.origin!==origin||source.host!==expected.host)throw new Error('Origin mismatch');
      }catch{throw new ConversionFailure('Cross-origin conversions are not accepted.',403);}
    }
    const contentType=request.headers.get('content-type')??'';if(!contentType.startsWith('multipart/form-data;'))throw new ConversionFailure('Use a multipart form upload.',415);
    const body=await readLimited(request),form=await new Response(body,{headers:{'Content-Type':contentType}}).formData();
    const rawValues=form.get('values');if(typeof rawValues!=='string'||rawValues.length>10000)throw new ConversionFailure('Invalid conversion options.');
    let values:unknown;try{values=JSON.parse(rawValues);}catch{throw new ConversionFailure('Options must be JSON.');}
    if(!values||typeof values!=='object'||Array.isArray(values)||Object.values(values).some(v=>typeof v!=='string'))throw new ConversionFailure('Option values must be strings.');
    const rawText=form.get('text')??'';if(typeof rawText!=='string'||rawText.length>2*1024*1024)throw new ConversionFailure('Use at most 2 MiB of input text.',413);
    const second=form.get('second')??'';if(typeof second!=='string'||rawText.length+second.length>2*1024*1024)throw new ConversionFailure('Use at most 2 MiB of combined input text.',413);
    const entries=form.getAll('files');if(entries.length>8||entries.some(f=>!(f instanceof File)))throw new ConversionFailure('Choose at most eight files.');
    const files=entries as File[];if(files.reduce((n,f)=>n+f.size,0)>4*1024*1024)throw new ConversionFailure('Files must not exceed 4 MiB combined.',413);
    if(tool.server!.input==='text'&&files.length)throw new ConversionFailure('This converter accepts text input.');
    return output(await runConversion({action:'convert',slug,text:rawText,second,values:values as Record<string,string>,files:await Promise.all(files.map(async f=>({name:f.name,bytes:new Uint8Array(await f.arrayBuffer())})))},request.signal));
  }catch(error){return fail(error);}finally{uploads--;}
}
export async function GET(request:Request,context:Context){try{const {slug}=await context.params;if(new URL(request.url).searchParams.get('example')!=='1')throw new ConversionFailure('Use POST for conversion or request the built-in example.',405);return output(await runConversion({action:'example',slug},request.signal));}catch(error){return fail(error);}}
