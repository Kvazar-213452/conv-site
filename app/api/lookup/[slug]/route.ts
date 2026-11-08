import { growthTools } from '@/lib/growth-tools';
import { lookupExternal } from '@/lib/external-lookups';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=15;
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
type Context={params:Promise<{slug:string}>};

export async function POST(request:Request,context:Context){
 try{
  const {slug}=await context.params;const tool=growthTools.find(item=>item.slug===slug&&item.api);if(!tool) return Response.json({error:'Unknown lookup tool.'},{status:404,headers});
  const origin=request.headers.get('origin');if(origin){try{const source=new URL(origin);const host=(request.headers.get('x-forwarded-host')??request.headers.get('host')??new URL(request.url).host).split(',')[0].trim();const expected=new URL(source.protocol+'//'+host);if(!['http:','https:'].includes(source.protocol)||source.origin!==origin||source.host!==expected.host)throw new Error('Origin mismatch');}catch{return Response.json({error:'Cross-origin lookup requests are not accepted.'},{status:403,headers});}}
  const contentType=request.headers.get('content-type')??'';if(!contentType.toLowerCase().includes('application/json'))return Response.json({error:'Send lookup fields as JSON.'},{status:415,headers});
  const raw=await request.text();if(raw.length>8192)return Response.json({error:'Lookup input is too large.'},{status:413,headers});
  let input:unknown;try{input=JSON.parse(raw)}catch{return Response.json({error:'Lookup input must be valid JSON.'},{status:400,headers});}
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.values(input).some(value=>typeof value!=='string'))return Response.json({error:'Lookup fields must be a JSON object containing text values.'},{status:400,headers});
  const values=input as Record<string,string>,allowed=new Set((tool.apiFields??[]).map(field=>field.key));if(Object.keys(values).some(key=>!allowed.has(key)))return Response.json({error:'Unexpected lookup field.'},{status:400,headers});
  const data=await lookupExternal(slug,values);return Response.json(data,{headers});
 }catch(error){const message=error instanceof Error?error.message:'The public lookup failed.';return Response.json({error:message},{status:502,headers});}
}
