import { isIP } from 'node:net';

type Input=Record<string,unknown>;
type Json=Record<string,any>;
const cache=new Map<string,{expires:number;value:unknown}>();
const timeout=(ms=8000)=>AbortSignal.timeout(ms);

async function getJson(url:string,options:{ttl?:number;userAgent?:string}={}):Promise<any>{
 const cached=options.ttl?cache.get(url):undefined;if(cached&&cached.expires>Date.now())return cached.value;
 const response=await fetch(url,{headers:{Accept:'application/json',...(options.userAgent?{'User-Agent':options.userAgent}:{})},signal:timeout()});
 const body=await response.text();if(body.length>1_000_000)throw new Error('The data provider returned an unexpectedly large response.');
 let data:any;try{data=JSON.parse(body)}catch{throw new Error('The data provider returned an unreadable response.');}
 if(!response.ok)throw new Error(response.status===404?'No matching public record was found.':response.status===429?'The data provider is busy. Please try again later.':`The data provider returned HTTP ${response.status}.`);
 if(options.ttl){cache.set(url,{expires:Date.now()+options.ttl*1000,value:data});if(cache.size>250){for(const [key,item] of cache)if(item.expires<Date.now())cache.delete(key);if(cache.size>300)cache.delete(cache.keys().next().value!);}}
 return data;
}
function text(input:Input,key:string,max=150):string{const value=input[key];if(typeof value!=='string')throw new Error(`Enter ${key}.`);const clean=value.trim();if(!clean||clean.length>max||/[\u0000-\u001f\u007f]/.test(clean))throw new Error(`Enter a valid ${key} (up to ${max} characters).`);return clean;}
function number(input:Input,key:string,min:number,max:number):number{const raw=input[key];if(typeof raw!=='string'||!raw.trim())throw new Error(`Enter ${key}.`);const value=Number(raw);if(!Number.isFinite(value)||value<min||value>max)throw new Error(`${key} must be from ${min} to ${max}.`);return value;}
function coordinates(input:Input){return {latitude:number(input,'latitude',-90,90),longitude:number(input,'longitude',-180,180)};}
function query(base:string,params:Record<string,string|number>):string{const url=new URL(base);for(const [key,value] of Object.entries(params))url.searchParams.set(key,String(value));return url.href;}
function openMeteo(host:string,endpoint:string,params:Record<string,string|number>):string{const key=process.env.OPEN_METEO_API_KEY;let server=host;if(key){server=host==='api.open-meteo.com'?'customer-api.open-meteo.com':host.replace(/^geocoding-api\./,'customer-geocoding-api.').replace(/^air-quality-api\./,'customer-air-quality-api.');}const url=new URL(`https://${server}/v1/${endpoint}`);for(const [name,value] of Object.entries(params))url.searchParams.set(name,String(value));if(key)url.searchParams.set('apikey',key);return url.href;}
async function city(input:Input){const name=text(input,'city',120);const data=await getJson(openMeteo('geocoding-api.open-meteo.com','search',{name,count:5,language:'en',format:'json'}),{ttl:3600});if(!data.results?.length)throw new Error('No matching city found. Add a country or region to narrow the search.');return {query:name,results:data.results.map((r:any)=>({name:r.name,admin1:r.admin1,country:r.country,countryCode:r.country_code,latitude:r.latitude,longitude:r.longitude,timezone:r.timezone,population:r.population}))};}
async function firstCity(input:Input){const result=await city(input);return result.results[0];}
function isoDate(value:unknown):string|undefined{return typeof value==='string'?value:undefined;}
function validIsbn(value:string):string{const digits=value.replace(/[\s-]/g,'').toUpperCase();if(/^\d{13}$/.test(digits)){const sum=[...digits.slice(0,12)].reduce((n,c,i)=>n+Number(c)*(i%2?3:1),0);if((10-sum%10)%10!==Number(digits[12]))throw new Error('ISBN-13 check digit is invalid.');return digits;}if(/^\d{9}[\dX]$/.test(digits)){const sum=[...digits].reduce((n,c,i)=>n+(c==='X'?10:Number(c))*(10-i),0);if(sum%11)throw new Error('ISBN-10 check digit is invalid.');return digits;}throw new Error('Enter a 10- or 13-digit ISBN.');}
function domain(value:string):string{const clean=value.trim().replace(/\.$/,'');let parsed:URL;try{parsed=new URL(`https://${clean}`)}catch{throw new Error('Enter a valid domain name without a URL path.');}if(parsed.hostname!==clean.toLowerCase()||parsed.username||parsed.password||parsed.port||parsed.pathname!=='/'||!clean.includes('.')||clean.length>253||clean.split('.').some(label=>!label||label.length>63||! /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)))throw new Error('Enter a domain such as example.com, without a scheme or path.');return clean.toLowerCase();}

export async function lookupExternal(slug:string,input:Input):Promise<unknown>{
 switch(slug){
  case 'core-web-vitals-checker':{
   const raw=text(input,'url',2048);let target:URL;try{target=new URL(raw)}catch{throw new Error('Enter a full public HTTP or HTTPS page URL.');}if(!['http:','https:'].includes(target.protocol)||target.username||target.password||target.hostname==='localhost'||target.hostname.endsWith('.localhost')||target.hostname.endsWith('.local')||/^127\.|^10\.|^192\.168\.|^169\.254\./.test(target.hostname)||/^172\.(1[6-9]|2\d|3[01])\./.test(target.hostname))throw new Error('Enter a public HTTP or HTTPS URL without credentials or a private/local host.');
   const strategy=(typeof input.strategy==='string'?input.strategy:'mobile').toLowerCase();if(!['mobile','desktop'].includes(strategy))throw new Error('Choose mobile or desktop.');const params=new URLSearchParams({url:target.href,strategy,category:'PERFORMANCE',locale:'en'}),key=process.env.GOOGLE_PAGESPEED_API_KEY;if(key)params.set('key',key);const data=await getJson(`https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,{ttl:300});const lr=data.lighthouseResult??{},field=data.loadingExperience?.metrics??{};const metric=(name:string)=>field[name]?.percentile??null;return {provider:'Google PageSpeed Insights',requestedUrl:target.href,finalUrl:data.id,strategy,analysisTime:data.analysisUTCTimestamp,lighthouseVersion:lr.lighthouseVersion,performanceScore:lr.categories?.performance?.score==null?null:Math.round(lr.categories.performance.score*100),lab:{lcp:lr.audits?.['largest-contentful-paint']?.displayValue??null,inp:lr.audits?.['interaction-to-next-paint']?.displayValue??null,cls:lr.audits?.['cumulative-layout-shift']?.displayValue??null,ttfb:lr.audits?.['server-response-time']?.displayValue??null,totalBlockingTime:lr.audits?.['total-blocking-time']?.displayValue??null},fieldData:{lcpMs:metric('LARGEST_CONTENTFUL_PAINT_MS'),inpMs:metric('INTERACTION_TO_NEXT_PAINT'),cls:metric('CUMULATIVE_LAYOUT_SHIFT_SCORE'),firstInputDelayMs:metric('FIRST_INPUT_DELAY_MS'),category:data.loadingExperience?.overall_category??null},notice:'Lighthouse lab results and Chrome UX Report field data are different measurements. Field metrics may be unavailable for low-traffic URLs.'};
  }
  case 'weather-forecast':{
   const place=await firstCity(input);const data=await getJson(openMeteo('api.open-meteo.com','forecast',{latitude:place.latitude,longitude:place.longitude,current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',timezone:'auto',forecast_days:3}),{ttl:600});return {provider:'Open-Meteo',location:place,current:data.current,units:data.current_units,forecast:data.daily,forecastUnits:data.daily_units};
  }
  case 'air-quality-lookup':{
   const place=await firstCity(input);const data=await getJson(openMeteo('air-quality-api.open-meteo.com','air-quality',{latitude:place.latitude,longitude:place.longitude,current:'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone',timezone:'auto'}),{ttl:900});return {provider:'Open-Meteo / CAMS ENSEMBLE',location:place,current:data.current,units:data.current_units,notice:'Modelled grid estimate; not a regulatory monitoring station.'};
  }
  case 'uv-index-forecast':{
   const place=await firstCity(input);const data=await getJson(openMeteo('api.open-meteo.com','forecast',{latitude:place.latitude,longitude:place.longitude,current:'uv_index',daily:'uv_index_max',timezone:'auto',forecast_days:3}),{ttl:900});return {provider:'Open-Meteo',location:place,current:data.current,forecast:data.daily,units:data.daily_units};
  }
  case 'pollen-forecast':{
   const place=await firstCity(input);const data=await getJson(openMeteo('air-quality-api.open-meteo.com','air-quality',{latitude:place.latitude,longitude:place.longitude,hourly:'alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen',timezone:'auto',forecast_days:2}),{ttl:1800});return {provider:'Open-Meteo / CAMS ENSEMBLE',location:place,hourly:data.hourly,units:data.hourly_units,notice:'Pollen forecasts are only available in supported European areas and seasons; null or missing series mean no data is available.'};
  }
  case 'sunrise-sunset-times':{
   const place=await firstCity(input);const data=await getJson(openMeteo('api.open-meteo.com','forecast',{latitude:place.latitude,longitude:place.longitude,daily:'sunrise,sunset,daylight_duration',timezone:'auto',forecast_days:3}),{ttl:1800});return {provider:'Open-Meteo',location:place,timezone:data.timezone,daily:data.daily};
  }
  case 'city-time-lookup':{
   const place=await firstCity(input);const current=new Date();const time=new Intl.DateTimeFormat('en-GB',{timeZone:place.timezone,dateStyle:'full',timeStyle:'long'}).format(current);return {location:place.name,region:place.admin1,country:place.country,timeZone:place.timezone,localDateTime:time,utcOffset:current.toLocaleString('en-US',{timeZone:place.timezone,timeZoneName:'longOffset'}).split(' ').at(-1)};
  }
  case 'city-geocoder':return await city(input);
  case 'reverse-geocoder':{
   const point=coordinates(input);const data=await getJson(openMeteo('geocoding-api.open-meteo.com','reverse',{...point,language:'en',format:'json'}),{ttl:3600});if(!data.results?.length)throw new Error('No named place was found near these coordinates.');return {query:point,results:data.results.map((r:any)=>({name:r.name,admin1:r.admin1,admin2:r.admin2,country:r.country,countryCode:r.country_code,latitude:r.latitude,longitude:r.longitude,timezone:r.timezone}))};
  }
  case 'elevation-lookup':{
   const point=coordinates(input);const data=await getJson(openMeteo('api.open-meteo.com','elevation',point),{ttl:86400});return {provider:'Copernicus DEM via Open-Meteo',latitude:point.latitude,longitude:point.longitude,elevationMetres:data.elevation?.[0]??null,notice:'90 m digital elevation model estimate; not a survey measurement.'};
  }
  case 'public-holiday-lookup':{
   const country=text(input,'country',2).toUpperCase(),year=number(input,'year',1900,2100);if(!/^[A-Z]{2}$/.test(country)||!Number.isInteger(year))throw new Error('Use a two-letter ISO country code and a whole year.');const data=await getJson(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,{ttl:86400});return {provider:'Nager.Date',country,year,holidays:data};
  }
  case 'postal-code-lookup':{
   const country=text(input,'country',2).toLowerCase(),postal=text(input,'postalCode',20);if(!/^[a-z]{2}$/.test(country)||! /^[\p{L}\p{N} -]+$/u.test(postal))throw new Error('Use a two-letter country code and a postal code with letters, numbers, spaces or hyphens.');return {provider:'Zippopotam.us',...(await getJson(`https://api.zippopotam.us/${country}/${encodeURIComponent(postal)}`,{ttl:86400}))};
  }
  case 'dns-lookup':{
   const host=domain(text(input,'domain',253)),type=text(input,'recordType',8).toUpperCase(),types=['A','AAAA','MX','TXT','NS','CNAME','SOA','CAA','SRV'];if(!types.includes(type))throw new Error(`Choose a DNS type: ${types.join(', ')}.`);const data=await getJson(query('https://cloudflare-dns.com/dns-query',{name:host,type}),{ttl:300});return {provider:'Cloudflare DNS over HTTPS',domain:host,type,status:data.Status,answers:data.Answer??[],authoritative:data.AD??false};
  }
  case 'ip-geolocation':{
   const address=text(input,'ip',45);if(!isIP(address))throw new Error('Enter a valid IPv4 or IPv6 address.');const data=await getJson(`https://ipwho.is/${encodeURIComponent(address)}`);if(data.success===false)throw new Error(data.message||'The IP address could not be located.');return {provider:'ipwho.is',ip:data.ip,success:data.success,type:data.type,continent:data.continent,country:data.country,countryCode:data.country_code,region:data.region,city:data.city,postal:data.postal,latitude:data.latitude,longitude:data.longitude,timezone:data.timezone,connection:data.connection,notice:'IP location is approximate and does not identify an individual or exact address.'};
  }
  case 'github-repository-lookup':{
   const repo=text(input,'repository',200);if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))throw new Error('Enter repository as owner/name.');const data=await getJson(`https://api.github.com/repos/${repo.split('/').map(encodeURIComponent).join('/')}`,{ttl:900,userAgent:'Utilixio-Public-Lookups/1.0'});return {provider:'GitHub',name:data.full_name,description:data.description,url:data.html_url,stars:data.stargazers_count,forks:data.forks_count,openIssues:data.open_issues_count,watchers:data.subscribers_count,defaultBranch:data.default_branch,license:data.license?.spdx_id,language:data.language,createdAt:data.created_at,updatedAt:data.updated_at,pushedAt:data.pushed_at,archived:data.archived};
  }
  case 'github-user-lookup':{
   const username=text(input,'username',39);if(!/^[A-Za-z0-9-]+$/.test(username))throw new Error('Enter a valid GitHub username.');const data=await getJson(`https://api.github.com/users/${encodeURIComponent(username)}`,{ttl:900,userAgent:'Utilixio-Public-Lookups/1.0'});return {provider:'GitHub',username:data.login,name:data.name,bio:data.bio,url:data.html_url,company:data.company,location:data.location,publicRepositories:data.public_repos,followers:data.followers,following:data.following,createdAt:data.created_at};
  }
  case 'npm-package-lookup':{
   const name=text(input,'package',214);if(!/^(?:@[a-z0-9._~-]+\/)?[a-z0-9._~-]+$/i.test(name))throw new Error('Enter an npm package name, such as next or @types/node.');const encoded=encodeURIComponent(name);const [data,downloads]=await Promise.all([getJson(`https://registry.npmjs.org/${encoded}`,{ttl:1800}),getJson(`https://api.npmjs.org/downloads/point/last-week/${encoded}`,{ttl:1800})]);const latest=data['dist-tags']?.latest,version=data.versions?.[latest]??{};return {provider:'npm Registry',name:data.name,latestVersion:latest,description:version.description??data.description,license:version.license??data.license,weeklyDownloads:downloads.downloads,repository:version.repository??data.repository,homepage:version.homepage??data.homepage,modified:data.time?.modified};
  }
  case 'pypi-package-lookup':{
   const name=text(input,'package',200);if(!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name))throw new Error('Enter a valid PyPI project name.');const data=await getJson(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`,{ttl:1800,userAgent:'Utilixio-Public-Lookups/1.0 (https://utilixio.com)'});const info=data.info;return {provider:'PyPI',name:info.name,latestVersion:info.version,summary:info.summary,author:info.author,license:info.license,requiresPython:info.requires_python,projectUrls:info.project_urls,releaseDate:data.releases?.[info.version]?.[0]?.upload_time};
  }
  case 'docker-image-lookup':{
   let image=text(input,'image',255).toLowerCase();if(!image.includes('/'))image=`library/${image}`;if(!/^[a-z0-9][a-z0-9_.-]*\/[a-z0-9][a-z0-9_.-]*$/.test(image))throw new Error('Enter a public image as namespace/repository, for example library/nginx.');const data=await getJson(`https://hub.docker.com/v2/repositories/${image.split('/').map(encodeURIComponent).join('/')}`,{ttl:1800,userAgent:'Utilixio-Public-Lookups/1.0'});return {provider:'Docker Hub',name:`${data.namespace}/${data.name}`,description:data.description,pulls:data.pull_count,stars:data.star_count,lastUpdated:data.last_updated,status:data.status,repositoryUrl:`https://hub.docker.com/r/${data.namespace}/${data.name}`};
  }
  case 'isbn-book-lookup':{
   const isbn=validIsbn(text(input,'isbn',24));const data=await getJson(`https://openlibrary.org/api/books?bibkeys=${encodeURIComponent(`ISBN:${isbn}`)}&format=json&jscmd=data`,{ttl:86400});const book=data[`ISBN:${isbn}`];if(!book)throw new Error('No book record was found for that ISBN.');return {provider:'Open Library',isbn,title:book.title,subtitle:book.subtitle,authors:book.authors?.map((a:any)=>a.name),publishers:book.publishers?.map((p:any)=>p.name),publishDate:book.publish_date,numberOfPages:book.number_of_pages,edition:book.edition_name,subjects:book.subjects?.slice(0,12).map((s:any)=>s.name),url:book.url,cover:book.cover};
  }
  case 'barcode-product-lookup':{
   const code=text(input,'barcode',14);if(!/^\d{8,14}$/.test(code))throw new Error('Enter an 8–14 digit EAN or UPC barcode.');const data=await getJson(`https://world.openfoodfacts.org/api/v3/product/${code}.json?fields=code,product_name,brands,quantity,categories,ingredients_text,allergens,nutriscore_grade,nutriments,labels`,{ttl:3600,userAgent:'Utilixio/1.0 (https://utilixio.com; contact: alret213452@gmail.com)'});if(data.status!==1||!data.product)throw new Error('No product record was found for that barcode.');const p=data.product;return {provider:'Open Food Facts',barcode:p.code,name:p.product_name,brands:p.brands,quantity:p.quantity,categories:p.categories,ingredients:p.ingredients_text,allergens:p.allergens,nutriScore:p.nutriscore_grade,nutritionPer100g:p.nutriments,labels:p.labels,notice:'Product data is community-contributed; verify ingredients and allergens on the package.'};
  }
  default:throw new Error('Unknown lookup tool.');
 }
}
