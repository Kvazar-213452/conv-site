export type DailyValues = Record<string, string>;

function value(values: DailyValues, key: string, min = 0, max = 1e12): number {
  const raw = values[key];
  const parsed = Number(raw);
  if (!raw?.trim() || !Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`Enter a value from ${min} to ${max} for ${key}.`);
  }
  return parsed;
}

const decimal = (n: number, digits = 2) => Number(n.toFixed(digits)).toLocaleString('en-US', { maximumFractionDigits: digits });
const ceilTo = (n: number, places = 2) => Math.ceil((n - Number.EPSILON) * 10 ** places) / 10 ** places;

export function calculateDaily(slug: string, values: DailyValues, text = ''): string {
  switch (slug) {
    case 'paint-calculator': {
      const area=value(values,'area',.01), coats=value(values,'coats',1,10), coverage=value(values,'coverage',.01), waste=value(values,'waste',0,100)/100;
      const litres=ceilTo(area*coats*(1+waste)/coverage,1);
      return `Estimated paint: ${decimal(litres,1)} L\nPaintable area: ${decimal(area)} m²\nCoats: ${coats}\nIncludes allowance: ${decimal(waste*100)}%\n\nFormula: area × coats × (1 + allowance) ÷ coverage per litre. Rounded up to 0.1 L.`;
    }
    case 'flooring-calculator': {
      const area=value(values,'length',.01)*value(values,'width',.01), pack=value(values,'packArea',.01), waste=value(values,'waste',0,100)/100;
      const packs=Math.ceil(area*(1+waste)/pack);
      return `Floor area: ${decimal(area)} m²\nWith ${decimal(waste*100)}% cutting allowance: ${decimal(area*(1+waste))} m²\nCoverage per pack: ${decimal(pack)} m²\nEstimated packs to buy: ${packs}`;
    }
    case 'tile-calculator': {
      const area=value(values,'length',.01)*value(values,'width',.01), tile=(value(values,'tileLength',1)*value(values,'tileWidth',1))/10000, waste=value(values,'waste',0,100)/100;
      const count=Math.ceil(area/tile*(1+waste));
      return `Area: ${decimal(area)} m²\nTile face area: ${decimal(tile,4)} m²\nTiles before allowance: ${Math.ceil(area/tile)}\nExtra allowance: ${decimal(waste*100)}%\nEstimated tiles to buy: ${count}`;
    }
    case 'concrete-calculator': {
      const volume=value(values,'length',.01)*value(values,'width',.01)*value(values,'depth',.1,1000)/100, litres=volume*1000, yieldPerBag=value(values,'yield',.1);
      return `Concrete volume: ${decimal(volume,3)} m³\nEquivalent volume: ${decimal(litres,1)} L\nBag yield: ${decimal(yieldPerBag,1)} L\nEstimated bags: ${Math.ceil(litres/yieldPerBag)}\n\nRounded up to full bags. Add a site-specific allowance for uneven ground and spillage.`;
    }
    case 'mulch-calculator':
    case 'garden-soil-calculator': {
      const isSoil=slug==='garden-soil-calculator';
      const area=isSoil?value(values,'length',.01)*value(values,'width',.01):value(values,'area',.01);
      const litres=area*value(values,isSoil?'depth':'depth',.1,1000)*10, bag=value(values,'bag',1);
      return `${isSoil?'Bed':'Garden area'}: ${decimal(area)} m²\nEstimated volume: ${decimal(litres/1000,3)} m³ (${decimal(litres)} L)\nBag size: ${decimal(bag,1)} L\nEstimated bags: ${Math.ceil(litres/bag)}\n\nVolume assumes a level rectangular area and the entered fill depth.`;
    }
    case 'wallpaper-calculator': {
      const width=value(values,'wallWidth',.01), height=value(values,'wallHeight',.01), rollWidth=value(values,'rollWidth',1)/100, rollLength=value(values,'rollLength',.1), repeat=value(values,'repeat',0,500)/100;
      const drops=Math.ceil(width/rollWidth), dropLength=height+repeat, dropsPerRoll=Math.floor(rollLength/dropLength);
      if(!dropsPerRoll) throw new Error('The roll is shorter than one wall drop plus the pattern repeat. Check your dimensions.');
      return `Wall width: ${decimal(width)} m\nFull-height drops needed: ${drops}\nLength per planned drop: ${decimal(dropLength,2)} m\nUsable drops per roll: ${dropsPerRoll}\nEstimated rolls: ${Math.ceil(drops/dropsPerRoll)}\n\nThis estimate does not subtract doors or windows.`;
    }
    case 'fence-post-calculator': {
      const length=value(values,'length',.1), spacing=value(values,'spacing',.1,20), posts=Math.ceil(length/spacing)+1;
      return `Fence length: ${decimal(length)} m\nMaximum spacing: ${decimal(spacing)} m\nEstimated posts, including both ends: ${posts}\nActual even spacing: ${decimal(length/(posts-1),3)} m\n\nAdd posts for gates, corners and changes in direction.`;
    }
    case 'gravel-calculator': {
      const volume=value(values,'area',.01)*value(values,'depth',.1,1000)/100, density=value(values,'density',1,10000), tonnes=volume*density/1000;
      return `Area: ${decimal(value(values,'area',.01))} m²\nDepth: ${decimal(value(values,'depth',.1,1000))} cm\nVolume: ${decimal(volume,3)} m³\nEstimated mass at ${decimal(density,0)} kg/m³: ${decimal(tonnes,3)} tonnes\n\nConfirm bulk density and order units with your supplier.`;
    }
    case 'deck-board-calculator': {
      const length=value(values,'length',.1), width=value(values,'width',.1), board=value(values,'boardWidth',1)/100, gap=value(values,'gap',0,50)/1000, stock=value(values,'boardLength',.1), waste=value(values,'waste',0,100)/100;
      const rows=Math.ceil(width/(board+gap)), linear=rows*length, boards=Math.ceil(linear*(1+waste)/stock);
      return `Deck area: ${decimal(length*width)} m²\nBoard rows across width: ${rows}\nTotal board length: ${decimal(linear,2)} m\nWith cutting allowance: ${decimal(linear*(1+waste),2)} m\nEstimated ${decimal(stock,2)} m boards: ${boards}\n\nEstimate excludes framing, stairs, edging and fasteners.`;
    }
    case 'fuel-cost-calculator': {
      const distance=value(values,'distance',.1), consumption=value(values,'consumption',.01,1000), price=value(values,'price',0,1e6), litres=distance*consumption/100;
      return `Distance: ${decimal(distance)} km\nEstimated fuel: ${decimal(litres,2)} L\nFuel price: ${decimal(price,3)} per litre\nEstimated trip fuel cost: ${decimal(litres*price,2)}\n\nFormula: distance × L/100 km ÷ 100 × price per litre.`;
    }
    case 'electricity-cost-calculator': {
      const watts=value(values,'watts',.1), hours=value(values,'hours',0,24), days=value(values,'days',0,31), price=value(values,'price',0,1e6), kwh=watts/1000*hours*days;
      return `Energy use: ${decimal(kwh,3)} kWh per entered period\nEstimated cost: ${decimal(kwh*price,2)}\nDaily run time: ${decimal(hours,2)} hours\nDays: ${decimal(days,0)}\n\nUses the stated wattage as a constant average load; fixed utility fees are excluded.`;
    }
    case 'sales-tax-calculator': {
      const amount=value(values,'amount',0,1e12), rate=value(values,'rate',0,100)/100;
      if (values.mode === 'included') {
        const before=amount/(1+rate);
        return `Price before tax: ${decimal(before)}\nSales tax included (${decimal(rate*100,3)}%): ${decimal(amount-before)}\nTotal including tax: ${decimal(amount)}\n\nTax is extracted from the total using one flat rate.`;
      }
      return `Price before tax: ${decimal(amount)}\nSales tax (${decimal(rate*100,3)}%): ${decimal(amount*rate)}\nTotal including tax: ${decimal(amount*(1+rate))}\n\nTax is calculated using one flat rate.`;
    }
    case 'bill-split-calculator': {
      const bill=value(values,'bill',0,1e12), people=value(values,'people',1,10000), tip=value(values,'tip',0,100)/100, total=bill*(1+tip), cents=Math.round(total*100), each=Math.floor(cents/people), remainder=cents%people;
      return `Bill: ${decimal(bill)}\nTip (${decimal(tip*100,2)}%): ${decimal(bill*tip)}\nTotal: ${decimal(total)}\nPeople: ${people}\nShare per person: ${decimal(each/100)}${remainder?`\n${remainder} person(s) pay ${decimal((each+1)/100)} to distribute rounding cents.`:''}`;
    }
    case 'salary-to-hourly-calculator': {
      const salary=value(values,'salary',0,1e12), hours=value(values,'hours',.1,168), weeks=value(values,'weeks',.1,53);
      return `Annual salary: ${decimal(salary,2)}\nHourly equivalent: ${decimal(salary/(hours*weeks),2)}\nWeekly equivalent: ${decimal(salary/weeks,2)}\nMonthly equivalent: ${decimal(salary/12,2)}\n\nGross-pay estimate before taxes, benefits, overtime and unpaid leave.`;
    }
    case 'overtime-pay-calculator': {
      const hours=value(values,'hours',0,168), rate=value(values,'rate',0,1e6), threshold=value(values,'threshold',0,168), multiplier=value(values,'multiplier',0,10), regular=Math.min(hours,threshold), overtime=Math.max(0,hours-threshold);
      return `Regular hours: ${decimal(regular,2)}\nOvertime hours: ${decimal(overtime,2)}\nRegular pay: ${decimal(regular*rate,2)}\nOvertime pay: ${decimal(overtime*rate*multiplier,2)}\nEstimated gross pay: ${decimal(regular*rate+overtime*rate*multiplier,2)}\n\nThis estimate does not determine legal overtime eligibility.`;
    }
    case 'pay-raise-calculator': {
      const salary=value(values,'salary',0,1e12), raise=value(values,'raise',-100,10000), increase=salary*raise/100, next=salary+increase;
      return `Current annual pay: ${decimal(salary,2)}\nChange: ${decimal(raise,2)}% (${decimal(increase,2)})\nNew annual pay: ${decimal(next,2)}\nNew monthly equivalent: ${decimal(next/12,2)}\nNew weekly equivalent: ${decimal(next/52,2)}\n\nGross-pay comparison; taxes and inflation are not included.`;
    }
    case 'savings-goal-calculator': {
      const target=value(values,'target',.01,1e12), current=value(values,'current',0,1e12), monthly=value(values,'monthly',.01,1e12), remaining=Math.max(0,target-current), months=Math.ceil(remaining/monthly);
      return remaining===0?`Goal reached.\nCurrent savings: ${decimal(current,2)}\nTarget: ${decimal(target,2)}\nAmount above target: ${decimal(current-target,2)}`:`Amount still needed: ${decimal(remaining,2)}\nMonthly contribution: ${decimal(monthly,2)}\nEstimated time: ${months} months (${decimal(months/12,1)} years)\nEstimated balance after final deposit: ${decimal(current+months*monthly,2)}\n\nAssumes fixed monthly deposits and no interest, fees or withdrawals.`;
    }
    case 'grade-needed-calculator': {
      const current=value(values,'current',0,100), target=value(values,'target',0,100), weight=value(values,'weight',.01,100)/100, required=(target-current*(1-weight))/weight;
      return `Current grade: ${decimal(current,2)}%\nTarget course grade: ${decimal(target,2)}%\nFinal exam weight: ${decimal(weight*100,2)}%\nRequired exam score: ${decimal(Math.max(0,required),2)}%\nStatus: ${required>100?'Target requires more than 100% on the exam.':required<=0?'Target is already secured before the exam.':'Target is mathematically achievable.'}\n\nAssumes the current grade covers all coursework outside the final.`;
    }
    case 'bmi-calculator': {
      const weight=value(values,'weight',1,1000), metres=value(values,'height',50,300)/100, bmi=weight/(metres*metres), category=bmi<18.5?'underweight':bmi<25?'healthy weight':bmi<30?'overweight':'obesity range';
      return `BMI: ${decimal(bmi,1)} kg/m²\nAdult screening category: ${category}\nWeight: ${decimal(weight,1)} kg\nHeight: ${decimal(metres*100,1)} cm\n\nBMI is a screening measure, not a diagnosis. It is not intended for children or pregnancy and does not distinguish muscle from fat.`;
    }
    case 'cooking-measurement-converter': {
      const amount=value(values,'amount',0),from=values.from,to=values.to,ingredient=values.ingredient;
      const density:Record<string,number>={flour:.507,sugar:.845,'brown-sugar':.93,butter:.958,water:1,milk:1.03,oil:.92,honey:1.42,rice:.82,oats:.42};
      const ml:Record<string,number>={cup:236.588236,tbsp:14.7867648,tsp:4.92892159,ml:1};const d=density[ingredient];if(!d)throw new Error('Choose a listed ingredient.');
      const grams=from==='g'?amount:from==='oz'?amount*28.349523125:amount*(ml[from]??0)*d;
      const result=to==='g'?grams:to==='oz'?grams/28.349523125:to==='ml'?grams/d:grams/d/(ml[to]??1);
      return `${decimal(amount,3)} ${from} ${ingredient.replaceAll('-',' ')} ≈ ${decimal(result,3)} ${to}\n\nVolume-to-weight values use approximate ingredient densities. Weigh ingredients for precise baking.`;
    }
    case 'oven-temperature-converter': {
      const n=value(values,'temperature',-500,2000),unit=values.from;const gas=[121,135,149,163,177,191,204,218,232,246];const c=unit==='f'?(n-32)*5/9:unit==='gas'?gas[Math.round(n)]??(n<0?gas[0]:gas.at(-1)!):n;if(unit==='gas'&&(!Number.isInteger(n)||n<0||n>9))throw new Error('Enter a whole gas mark from 0 to 9.');
      const closest=gas.reduce((best,temp,i)=>Math.abs(temp-c)<Math.abs(gas[best]-c)?i:best,0);return `${decimal(c,0)} °C\n${decimal(c*9/5+32,0)} °F\nGas mark ${closest}${Math.abs(gas[closest]-c)>8?` (nearest; reference ${gas[closest]} °C)`:''}`;
    }
    case 'fuel-economy-converter': {
      const n=value(values,'value',.000001),factor:Record<string,number>={l100:1,usmpg:235.214583,ukmpg:282.480936,kml:100};const base=values.from==='l100'?n:factor[values.from]/n;if(!Number.isFinite(base)||base<=0)throw new Error('Choose a valid fuel-economy unit and positive value.');return `L/100 km: ${decimal(base,3)}\nUS MPG: ${decimal(235.214583/base,2)}\nUK MPG: ${decimal(282.480936/base,2)}\nkm/L: ${decimal(100/base,3)}\n\nUS and UK gallons use different conversion factors.`;
    }
    case 'running-pace-calculator': {
      const distance=value(values,'distance',.0001),hours=value(values,'hours',0,10000),minutes=value(values,'minutes',0,59),seconds=value(values,'seconds',0,59),total=hours*3600+minutes*60+seconds;if(total<=0)throw new Error('Enter a duration greater than zero.');const pace=total/distance,mile=pace*1.609344;const clock=(s:number)=>`${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,'0')}`;return `Pace: ${clock(pace)} min/km\nPace: ${clock(mile)} min/mile\nSpeed: ${decimal(distance/(total/3600),2)} km/h (${decimal(distance/(total/3600)/1.609344,2)} mph)\nEstimated 5K: ${clock(pace*5)}\nEstimated 10K: ${clock(pace*10)}\n\nFinish estimates assume a constant pace.`;
    }
    case 'work-hours-calculator': {
      const parse=(s:string,key:string)=>{const m=/^(\d{1,2}):(\d{2})$/.exec(s??'');if(!m||+m[1]>23||+m[2]>59)throw new Error(`Enter ${key} as 24-hour HH:MM.`);return +m[1]*60 + +m[2]};const start=parse(values.start,'clock-in time'),end=parse(values.end,'clock-out time');let elapsed=end-start;if(elapsed<=0)elapsed+=1440;const pause=value(values,'break',0,1440);if(pause>=elapsed)throw new Error('Unpaid break must be shorter than the shift.');const paid=elapsed-pause;return `Shift duration: ${Math.floor(elapsed/60)} h ${elapsed%60} min\nUnpaid break: ${Math.floor(pause/60)} h ${pause%60} min\nPaid work time: ${decimal(paid/60,2)} hours (${Math.floor(paid/60)} h ${paid%60} min)\nDecimal time for timesheets: ${decimal(paid/60,2)} hours`;
    }
    case 'date-add-subtract-calculator': {
      const date=values.date??'';if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error('Choose a valid calendar date.');const [y,m,d]=date.split('-').map(Number),base=new Date(Date.UTC(y,m-1,d));if(base.toISOString().slice(0,10)!==date)throw new Error('Choose a valid calendar date.');const amount=value(values,'amount',0,1000000)*(values.direction==='subtract'?-1:1);if(values.unit==='days')base.setUTCDate(base.getUTCDate()+amount);else if(values.unit==='weeks')base.setUTCDate(base.getUTCDate()+amount*7);else{const day=base.getUTCDate();base.setUTCDate(1);if(values.unit==='months')base.setUTCMonth(base.getUTCMonth()+amount);else base.setUTCFullYear(base.getUTCFullYear()+amount);const last=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()+1,0)).getUTCDate();base.setUTCDate(Math.min(day,last));}return `${date} ${values.direction==='subtract'?'−':'+'} ${Math.abs(amount)} ${values.unit} = ${base.toISOString().slice(0,10)}`;
    }
    case 'hourly-to-salary-calculator': {
      const rate=value(values,'rate',0),hours=value(values,'hours',.1,168),weeks=value(values,'weeks',.1,53),annual=rate*hours*weeks;return `Annual gross pay: ${decimal(annual,2)}\nMonthly equivalent: ${decimal(annual/12,2)}\nBiweekly equivalent: ${decimal(annual/26,2)}\nWeekly equivalent: ${decimal(annual/weeks,2)}\nHourly rate: ${decimal(rate,2)}\n\nBefore taxes, benefits or unpaid leave.`;
    }
    case 'profit-margin-calculator': {
      const cost=value(values,'cost',0),price=value(values,'price',.000001);if(cost===0)throw new Error('Cost must be greater than zero to calculate markup.');const profit=price-cost;return `Gross profit per item: ${decimal(profit,2)}\nGross margin: ${decimal(profit/price*100,2)}%\nMarkup on cost: ${decimal(profit/cost*100,2)}%\nCost: ${decimal(cost,2)}\nSelling price: ${decimal(price,2)}\n\nExcludes overhead, fees and taxes.`;
    }
    case 'break-even-calculator': {
      const fixed=value(values,'fixed',0),price=value(values,'price',.000001),variable=value(values,'variable',0);if(price<=variable)throw new Error('Selling price must be greater than variable cost per unit.');const units=Math.ceil(fixed/(price-variable));return `Contribution per unit: ${decimal(price-variable,2)}\nBreak-even sales volume: ${units} units\nBreak-even revenue: ${decimal(units*price,2)}\nContribution margin: ${decimal((price-variable)/price*100,2)}%\n\nUses constant prices and per-unit costs.`;
    }
    case 'commission-calculator': {
      const sales=value(values,'sales',0),rate=value(values,'rate',0,100)/100,base=value(values,'base',0);return `Sales: ${decimal(sales,2)}\nCommission rate: ${decimal(rate*100,2)}%\nCommission earned: ${decimal(sales*rate,2)}\nBase pay: ${decimal(base,2)}\nEstimated gross pay: ${decimal(base+sales*rate,2)}\n\nFlat-rate estimate before deductions.`;
    }
    case 'vat-calculator': {
      const amount=value(values,'amount',0),rate=value(values,'rate',0,100)/100;if(values.mode==='gross'){const net=amount/(1+rate);return `Net price: ${decimal(net,2)}\nVAT included (${decimal(rate*100,2)}%): ${decimal(amount-net,2)}\nGross price: ${decimal(amount,2)}`}return `Net price: ${decimal(amount,2)}\nVAT (${decimal(rate*100,2)}%): ${decimal(amount*rate,2)}\nGross price: ${decimal(amount*(1+rate),2)}`;
    }
    case 'unit-price-calculator': {
      const pa=value(values,'priceA',0),qa=value(values,'quantityA',.000001),pb=value(values,'priceB',0),qb=value(values,'quantityB',.000001),a=pa/qa,b=pb/qb;return `Product A: ${decimal(a,4)} per ${values.unit||'unit'}\nProduct B: ${decimal(b,4)} per ${values.unit||'unit'}\nBetter unit price: ${a===b?'Same price':a<b?'Product A':'Product B'}\nDifference per ${values.unit||'unit'}: ${decimal(Math.abs(a-b),4)}\n\nCompare products using the same quantity unit.`;
    }
    case 'recipe-cost-calculator': {
      const ingredients=value(values,'ingredients',0),servings=value(values,'servings',1,1000000),extras=value(values,'extras',0,100)/100,total=ingredients*(1+extras);return `Ingredient cost: ${decimal(ingredients,2)}\nExtra-cost allowance: ${decimal(ingredients*extras,2)}\nEstimated recipe cost: ${decimal(total,2)}\nServings: ${servings}\nCost per serving: ${decimal(total/servings,2)}`;
    }
    case 'average-statistics-calculator':
    case 'standard-deviation-calculator': {
      const nums=text.split(/[\s,;]+/).filter(Boolean).map(Number);if(!nums.length||nums.some(n=>!Number.isFinite(n)))throw new Error('Enter one or more finite numbers separated by spaces, commas or new lines.');const sorted=[...nums].sort((a,b)=>a-b),sum=nums.reduce((a,b)=>a+b,0),mean=sum/nums.length;if(slug==='average-statistics-calculator'){const freq=new Map<number,number>();nums.forEach(n=>freq.set(n,(freq.get(n)??0)+1));const max=Math.max(...freq.values()),modes=max===1?[]:[...freq].filter(([,n])=>n===max).map(([n])=>n);return `Count: ${nums.length}\nMean: ${decimal(mean,4)}\nMedian: ${decimal(sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2,4)}\nMode: ${modes.length?modes.map(n=>decimal(n,4)).join(', '):'No repeated value'}\nMinimum: ${decimal(sorted[0],4)}\nMaximum: ${decimal(sorted.at(-1)!,4)}\nRange: ${decimal(sorted.at(-1)!-sorted[0],4)}`;}const sample=values.mode==='sample';if(sample&&nums.length<2)throw new Error('Sample standard deviation requires at least two values.');const variance=nums.reduce((acc,n)=>acc+(n-mean)**2,0)/(nums.length-(sample?1:0));return `Count: ${nums.length}\nMean: ${decimal(mean,4)}\n${sample?'Sample':'Population'} variance: ${decimal(variance,6)}\n${sample?'Sample':'Population'} standard deviation: ${decimal(Math.sqrt(variance),6)}`;
    }
    case 'percentage-point-calculator': {
      const start=value(values,'start',-100000,100000),end=value(values,'end',-100000,100000),diff=end-start,relative=start===0?'undefined (starting rate is zero)':`${decimal(diff/Math.abs(start)*100,2)}%`;return `Starting rate: ${decimal(start,3)}%\nEnding rate: ${decimal(end,3)}%\nChange: ${decimal(diff,3)} percentage points\nRelative change: ${relative}`;
    }
    case 'paper-size-converter': {
      const mm:Record<string,[number,number]>={a0:[841,1189],a1:[594,841],a2:[420,594],a3:[297,420],a4:[210,297],a5:[148,210],letter:[215.9,279.4],legal:[215.9,355.6]};let [w,h]=mm[values.size]??[];if(!w)throw new Error('Choose a supported paper size.');if(values.orientation==='landscape')[w,h]=[h,w];const dpi=value(values,'dpi',1,2400);return `${values.size.toUpperCase()} ${values.orientation}\n${decimal(w,1)} × ${decimal(h,1)} mm\n${decimal(w/25.4,3)} × ${decimal(h/25.4,3)} in\n${Math.round(w/25.4*dpi)} × ${Math.round(h/25.4*dpi)} px at ${dpi} DPI`;
    }
    case 'payday-calendar-generator': {
      const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(values.start??'');if(!match)throw new Error('Choose a valid starting payday.');let date=new Date(Date.UTC(+match[1],+match[2]-1,+match[3]));if(date.toISOString().slice(0,10)!==values.start)throw new Error('Choose a valid starting payday.');const count=value(values,'count',1,52);const dates:string[]=[];for(let i=0;i<count;i++){dates.push(date.toISOString().slice(0,10));if(values.frequency==='weekly')date.setUTCDate(date.getUTCDate()+7);else if(values.frequency==='biweekly')date.setUTCDate(date.getUTCDate()+14);else{const day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+1);date.setUTCDate(Math.min(day,new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate()));}}return `Upcoming paydays (${values.frequency}):\n${dates.map((d,i)=>`${i+1}. ${d}`).join('\n')}\n\nBank holidays and employer schedule changes are not applied.`;
    }
    case 'sleep-cycle-calculator': {
      const m=/^(\d{1,2}):(\d{2})$/.exec(values.time??'');if(!m||+m[1]>23||+m[2]>59)throw new Error('Enter a wake-up time in HH:MM.');const wake=+m[1]*60 + +m[2],cycles=Number(values.cycles),latency=value(values,'latency',0,180);if(![4,5,6].includes(cycles))throw new Error('Choose 4, 5 or 6 estimated cycles.');const format=(n:number)=>{n=(n%1440+1440)%1440;return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};const opts=[4,5,6].map(c=>`${c} cycles (~${(c*1.5).toFixed(1)} h): ${format(wake-c*90-latency)}`);return `Suggested bedtime for ${cycles} cycles: ${format(wake-cycles*90-latency)}\n\nOther estimates:\n${opts.join('\n')}\n\nSleep cycles vary; this is only a scheduling estimate.`;
    }
    case 'calorie-needs-calculator': {
      const age=value(values,'age',19,78),weight=value(values,'weight',25,300),height=value(values,'height',100,230),sex=values.sex,activity=value(values,'activity',1,2);if(!['female','male'].includes(sex))throw new Error('Choose an equation option.');const resting=10*weight+6.25*height-5*age+(sex==='male'?5:-161),maintenance=resting*activity;return `Estimated resting energy: ${decimal(resting,0)} kcal/day\nEstimated maintenance energy: ${decimal(maintenance,0)} kcal/day\nActivity factor: ${activity}\n\nApproximate population estimate only; not a prescribed intake or medical advice. The equation was developed from healthy adults aged 19–78: https://pubmed.ncbi.nlm.nih.gov/2305711/`;
    }
    case 'mortgage-payment-calculator': {
      const price=value(values,'price',.01),down=value(values,'down',0),annual=value(values,'rate',0,100)/100,months=value(values,'years',1,50)*12,tax=value(values,'tax',0),insurance=value(values,'insurance',0),hoa=value(values,'hoa',0),principal=price-down;if(principal<0)throw new Error('Down payment cannot exceed the home price.');const r=annual/12,pi=r?principal*r/(1-(1+r)**-months):principal/months;return `Loan principal: ${decimal(principal,2)}\nPrincipal and interest: ${decimal(pi,2)} / month\nEntered tax, insurance and HOA: ${decimal(tax+insurance+hoa,2)} / month\nEstimated monthly total: ${decimal(pi+tax+insurance+hoa,2)}\n\nPMI, closing costs and changing escrow costs are excluded.`;
    }
    case 'mortgage-affordability-calculator': {
      const income=value(values,'income',.01),debts=value(values,'debts',0),housing=value(values,'housingRatio',1,100)/100,total=value(values,'debtRatio',1,100)/100,down=value(values,'down',0),rate=value(values,'rate',0,100)/1200,months=value(values,'years',1,50)*12,payment=Math.max(0,Math.min(income*housing,income*total-debts)),factor=rate?(1-(1+rate)**-months)/rate:months,principal=payment*factor;return `Estimated principal-and-interest budget: ${decimal(payment,2)} / month\nEstimated loan principal: ${decimal(principal,2)}\nAvailable down payment: ${decimal(down,2)}\nIndicative home price: ${decimal(principal+down,2)}\n\nExcludes property tax, insurance, HOA, PMI and lender approval.`;
    }
    case 'car-loan-payment-calculator': {
      const price=value(values,'price',0),down=value(values,'down',0),trade=value(values,'trade',0),tax=value(values,'tax',0,100)/100,apr=value(values,'rate',0,1000)/1200,months=value(values,'months',1,120);const principal=price*(1+tax)-down-trade;if(principal<0)throw new Error('Down payment and trade-in cannot exceed the price plus entered tax.');const payment=apr?principal*apr/(1-(1+apr)**-months):principal/months;return `Estimated amount financed: ${decimal(principal,2)}\nMonthly payment: ${decimal(payment,2)}\nTotal of payments: ${decimal(payment*months,2)}\nEstimated interest: ${decimal(payment*months-principal,2)}\n\nFees, add-ons and registration are excluded.`;
    }
    case 'credit-card-payoff-calculator': {
      let balance=value(values,'balance',.01),payment=value(values,'payment',.01),rate=value(values,'apr',0,1000)/1200,interestTotal=0,months=0;while(balance>.005&&months<1200){const interest=balance*rate;if(payment<=interest)throw new Error('Monthly payment must be greater than the estimated monthly interest.');const amount=Math.min(balance+interest,payment);interestTotal+=Math.max(0,amount-balance);balance=Math.max(0,balance+interest-amount);months++;}if(balance>.005)throw new Error('This payment does not clear the balance within 100 years.');return `Estimated payoff time: ${months} month${months===1?'':'s'}\nEstimated interest: ${decimal(interestTotal,2)}\nEstimated total paid: ${decimal(value(values,'balance',.01)+interestTotal,2)}\n\nAssumes no new purchases, fees or rate changes.`;
    }
    case 'debt-to-income-calculator': {
      const income=value(values,'income',.01),debt=value(values,'debt',0);return `Monthly debt payments: ${decimal(debt,2)}\nGross monthly income: ${decimal(income,2)}\nDebt-to-income ratio: ${decimal(debt/income*100,2)}%\n\nLenders may count income and obligations differently.`;
    }
    case 'rent-affordability-calculator': {
      const income=value(values,'income',.01),debt=value(values,'debt',0),ratio=value(values,'ratio',1,100)/100;return `Selected housing budget (${decimal(ratio*100)}% of gross income): ${decimal(income*ratio,2)} / month\nAfter entered monthly debt payments: ${decimal(Math.max(0,income*ratio-debt),2)} / month\n\nUtilities and other living costs are not included.`;
    }
    case 'emergency-fund-calculator': {
      const expenses=value(values,'expenses',0),months=value(values,'months',1,36),current=value(values,'current',0),target=expenses*months;return `Selected target: ${decimal(target,2)}\nCurrent reserve: ${decimal(current,2)}\nAmount remaining: ${decimal(Math.max(0,target-current),2)}\nMonths of expenses currently covered: ${expenses?decimal(current/expenses,1):'not applicable'}\n\nThis is a planning target; choose a reserve suited to your situation.`;
    }
    case 'savings-with-contributions-calculator': {
      const initial=value(values,'initial',0),deposit=value(values,'deposit',0),monthlyRate=value(values,'rate',0,100)/1200,months=Math.round(value(values,'years',.1,100)*12);if(monthlyRate<=-1)throw new Error('Monthly interest rate must be greater than -100%.');const factor=(1+monthlyRate)**months,total=initial*factor+(monthlyRate?deposit*(factor-1)/monthlyRate:deposit*months),contributions=initial+deposit*months;return `Estimated future balance: ${decimal(total,2)}\nStarting balance plus deposits: ${decimal(contributions,2)}\nEstimated interest: ${decimal(total-contributions,2)}\nMonths: ${months}\n\nAssumes end-of-month deposits and a constant rate.`;
    }
    case 'simple-interest-calculator': {
      const principal=value(values,'principal',0),rate=value(values,'rate',0,1000)/100,years=value(values,'years',0,1000),interest=principal*rate*years;return `Principal: ${decimal(principal,2)}\nSimple interest: ${decimal(interest,2)}\nTotal: ${decimal(principal+interest,2)}\n\nCompounding is not included.`;
    }
    case 'apr-to-apy-calculator': {
      const apr=value(values,'apr',-99.999999,1000)/100,periods=value(values,'periods',1,365);if(!Number.isInteger(periods))throw new Error('Compounding periods must be a whole number.');const apy=((1+apr/periods)**periods-1)*100;return `Nominal APR: ${decimal(apr*100,4)}%\nEffective annual yield (APY): ${decimal(apy,4)}%\nCompounding periods per year: ${periods}\n\nFees and product-specific APR conventions are not included.`;
    }
    case 'average-speed-calculator': {
      const distance=value(values,'distance',.001),hours=value(values,'hours',0),minutes=value(values,'minutes',0,59),time=hours+minutes/60;if(time<=0)throw new Error('Enter a travel time greater than zero.');const speed=distance/time;return `Average speed: ${decimal(speed,2)} km/h\nAverage speed: ${decimal(speed/1.609344,2)} mph\nDistance: ${decimal(distance,2)} km\nElapsed time: ${decimal(hours)} h ${decimal(minutes)} min`;
    }
    case 'fuel-range-calculator': {
      const fuel=value(values,'fuel',.01),consumption=value(values,'consumption',.01);return `Estimated driving range: ${decimal(fuel/consumption*100,1)} km\nUsable fuel: ${decimal(fuel,2)} L\nEntered consumption: ${decimal(consumption,2)} L/100 km\n\nKeep a reserve; real-world range varies.`;
    }
    case 'trip-fuel-cost-calculator': {
      const distance=value(values,'distance',0),consumption=value(values,'consumption',0),price=value(values,'price',0),people=value(values,'people',1,1000);if(!Number.isInteger(people))throw new Error('People splitting the cost must be a whole number.');const litres=distance*consumption/100,cost=litres*price;return `Estimated fuel: ${decimal(litres,2)} L\nEstimated total cost: ${decimal(cost,2)}\nPer person (${people}): ${decimal(cost/people,2)}\n\nUses your entered distance, consumption and fuel price.`;
    }
    case 'freelance-hourly-rate-calculator': {
      const income=value(values,'income',0),expenses=value(values,'expenses',0),hours=value(values,'hours',.1,168),weeks=value(values,'weeks',1,53),billable=hours*weeks;if(!billable)throw new Error('Enter billable hours greater than zero.');const rate=(income+expenses)/billable;return `Estimated minimum hourly rate: ${decimal(rate,2)}\nAnnual income goal: ${decimal(income,2)}\nAnnual business expenses: ${decimal(expenses,2)}\nBillable hours per year: ${decimal(billable,1)}\n\nPersonal taxes, benefits and unpaid leave are not included.`;
    }
    case 'prorated-rent-calculator': {
      const rent=value(values,'rent',0),days=value(values,'daysInMonth',28,31),charged=value(values,'daysCharged',0,31);if(!Number.isInteger(days)||!Number.isInteger(charged)||charged>days)throw new Error('Days charged must be a whole number no greater than days in the month.');return `Daily rent: ${decimal(rent/days,2)}\nDays charged: ${charged} of ${days}\nProrated rent: ${decimal(rent/days*charged,2)}\n\nConfirm your lease’s proration method and move-in day rules.`;
    }
    case 'test-score-calculator': {
      const earned=value(values,'earned',0),possible=value(values,'possible',.01),target=value(values,'target',0,100);if(earned>possible)throw new Error('Points earned cannot exceed total possible points.');const score=earned/possible*100,needed=Math.max(0,Math.ceil(possible*target/100-earned));return `Score: ${decimal(score,2)}%\nPoints earned: ${decimal(earned,2)} of ${decimal(possible,2)}\nPoints missed: ${decimal(possible-earned,2)}\nAdditional points needed for ${decimal(target)}%: ${decimal(needed,0)}\n\nLetter-grade scales vary by course.`;
    }
    case 'attendance-percentage-calculator': {
      const attended=value(values,'attended',0),held=value(values,'held',1),future=value(values,'future',0),target=value(values,'target',0,100);if(![attended,held,future].every(Number.isInteger)||attended>held)throw new Error('Enter whole session counts, with attended sessions no greater than sessions held.');const total=held+future,required=Math.ceil(total*target/100),missed=held-attended,allowed=Math.max(0,total-required-missed);return `Current attendance: ${decimal(attended/held*100,2)}% (${attended}/${held})\nTotal sessions planned: ${total}\nMinimum sessions to attend: ${required}\nFuture sessions you can miss and still meet target: ${allowed}\n\nConfirm how your institution rounds attendance.`;
    }
    case 'percentage-error-calculator': {
      const reference=value(values,'reference',-1e12,1e12),observed=value(values,'observed',-1e12,1e12),absolute=Math.abs(observed-reference),relative=reference===0?'undefined (reference is zero)':`${decimal(absolute/Math.abs(reference)*100,4)}%`;return `Reference value: ${decimal(reference,6)}\nObserved value: ${decimal(observed,6)}\nAbsolute error: ${decimal(absolute,6)}\nRelative percentage error: ${relative}`;
    }
    case 'inflation-adjusted-value-calculator': {
      const amount=value(values,'amount',0),rate=value(values,'rate',-99,1000)/100,years=value(values,'years',0,1000);if(1+rate<=0)throw new Error('Annual inflation rate must be greater than -100%.');const factor=(1+rate)**years;return `Amount today: ${decimal(amount,2)}\nEquivalent future amount: ${decimal(amount*factor,2)}\nFuture amount’s value in today’s money: ${decimal(amount/factor,2)}\nAssumed annual inflation: ${decimal(rate*100,3)}% for ${decimal(years,2)} years\n\nIllustration only; actual inflation varies.`;
    }
    case 'loan-amortization-calculator': {
      let balance=value(values,'principal',.01),apr=value(values,'rate',0,1000)/1200;const years=value(values,'years',.1,100),extra=value(values,'extra',0),monthsPlanned=Math.ceil(years*12),base=apr?balance*apr/(1-(1+apr)**-monthsPlanned):balance/monthsPlanned;let totalInterest=0,totalPaid=0,months=0;while(balance>.005&&months<1200){const interest=balance*apr,payment=Math.min(balance+interest,base+extra);if(payment<=interest)throw new Error('Payment must exceed monthly interest.');balance=Math.max(0,balance+interest-payment);totalInterest+=interest;totalPaid+=payment;months++;}if(balance>.005)throw new Error('Could not pay off the balance within 100 years.');return `Base scheduled payment: ${decimal(base,2)} / month\nExtra payment: ${decimal(extra,2)} / month\nEstimated payoff time: ${months} months\nEstimated total interest: ${decimal(totalInterest,2)}\nEstimated total paid: ${decimal(totalPaid,2)}\n\nFixed rate, monthly payments; fees and lender rules excluded.`;
    }
    case 'conversion-rate-calculator': {
      const visitors=value(values,'visitors',0),conversions=value(values,'conversions',0);if(!visitors)throw new Error('Visitors or sessions must be greater than zero.');if(conversions>visitors)throw new Error('Conversions cannot exceed visitors or sessions for this rate.');return `Conversion rate: ${decimal(conversions/visitors*100,3)}%\nConversions: ${decimal(conversions,0)}\nVisitors or sessions: ${decimal(visitors,0)}\nNon-converting visits: ${decimal(visitors-conversions,0)}`;
    }
    case 'cost-per-acquisition-calculator': {
      const spend=value(values,'spend',0),acquisitions=value(values,'acquisitions',0);if(!acquisitions)throw new Error('Enter at least one attributed acquisition.');return `Average cost per acquisition: ${decimal(spend/acquisitions,2)}\nCampaign spend: ${decimal(spend,2)}\nAttributed acquisitions: ${decimal(acquisitions,0)}\n\nOther marketing and product costs are not included.`;
    }
    case 'return-on-ad-spend-calculator': {
      const revenue=value(values,'revenue',0),spend=value(values,'spend',0);if(!spend)throw new Error('Advertising spend must be greater than zero.');const ratio=revenue/spend;return `ROAS: ${decimal(ratio,2)}×\nRevenue per 1 spent: ${decimal(ratio,2)}\nRevenue-to-spend percentage: ${decimal(ratio*100,2)}%\nAttributed revenue: ${decimal(revenue,2)}\nAd spend: ${decimal(spend,2)}\n\nROAS is revenue, not profit.`;
    }
    case 'click-through-rate-calculator': {
      const clicks=value(values,'clicks',0),impressions=value(values,'impressions',.01);if(clicks>impressions)throw new Error('Clicks cannot exceed impressions.');return `Click-through rate: ${decimal(clicks/impressions*100,3)}%\nClicks: ${decimal(clicks,0)}\nImpressions: ${decimal(impressions,0)}`;
    }
    case 'email-campaign-metrics-calculator': {
      const delivered=value(values,'delivered',.01),opens=value(values,'opens',0),clicks=value(values,'clicks',0),unsub=value(values,'unsubscribes',0);if(opens>delivered||clicks>delivered||unsub>delivered)throw new Error('Event counts cannot exceed delivered emails.');return `Unique open rate: ${decimal(opens/delivered*100,3)}%\nClick-through rate: ${decimal(clicks/delivered*100,3)}%\nClick-to-open rate: ${opens?decimal(clicks/opens*100,3)+'%':'undefined (no opens entered)'}\nUnsubscribe rate: ${decimal(unsub/delivered*100,3)}%\nDelivered emails: ${decimal(delivered,0)}\n\nProvider definitions, privacy features and bot filtering affect these metrics.`;
    }
    case 'net-worth-calculator': {
      const assetKeys=['cash','investments','property','otherAssets'],debtKeys=['mortgage','loans','cards','otherDebts'],assets=assetKeys.reduce((sum,key)=>sum+value(values,key,0),0),debts=debtKeys.reduce((sum,key)=>sum+value(values,key,0),0);return `Total assets: ${decimal(assets,2)}\nTotal liabilities: ${decimal(debts,2)}\nEstimated net worth: ${decimal(assets-debts,2)}\n\nThis is a snapshot using your entered estimates.`;
    }
    case 'monthly-budget-calculator': {
      const income=value(values,'income',0),keys=['housing','bills','food','transport','debt'],expenses=keys.reduce((sum,key)=>sum+value(values,key,0),0),savings=value(values,'savings',0);return `Take-home income: ${decimal(income,2)}\nEntered monthly expenses: ${decimal(expenses,2)}\nPlanned savings: ${decimal(savings,2)}\nUnassigned amount: ${decimal(income-expenses-savings,2)}\nSavings share of income: ${income?decimal(savings/income*100,2)+'%':'undefined (income is zero)'}`;
    }
    case 'wedding-budget-calculator': {
      const budget=value(values,'budget',0),guests=value(values,'guests',0,10000),costs=['venue','attire','photo','decor','music','other'].reduce((sum,key)=>sum+value(values,key,0),0)+guests*value(values,'catering',0);if(!Number.isInteger(guests))throw new Error('Guest count must be a whole number.');return `Estimated total: ${decimal(costs,2)}\nBudget: ${decimal(budget,2)}\nBudget remaining: ${decimal(budget-costs,2)}\nGuests: ${decimal(guests,0)}\nEstimated total per guest: ${guests?decimal(costs/guests,2):'not applicable'}\n\nTaxes, service fees and gratuities may be additional.`;
    }
    case 'moving-cost-calculator': {
      const subtotal=['truck','movers','packing','travel','storage','cleaning','other'].reduce((sum,key)=>sum+value(values,key,0),0),rate=value(values,'contingency',0,100)/100,extra=subtotal*rate;return `Entered costs: ${decimal(subtotal,2)}\nContingency (${decimal(rate*100)}%): ${decimal(extra,2)}\nEstimated total: ${decimal(subtotal+extra,2)}\n\nReplace estimates with confirmed provider quotes.`;
    }
    case 'trip-budget-calculator': {
      const days=value(values,'days',1,365),people=value(values,'people',1,100),transport=value(values,'transport',0),lodging=value(values,'lodging',0),food=value(values,'food',0),activities=value(values,'activities',0),local=value(values,'local',0),contingency=value(values,'contingency',0,100)/100;if(!Number.isInteger(days)||!Number.isInteger(people))throw new Error('Trip days and traveler count must be whole numbers.');const nights=Math.max(0,days-1),base=transport+lodging*nights+(food+activities)*people*days+local*days,extra=base*contingency;return `Estimated base costs: ${decimal(base,2)}\nContingency (${decimal(contingency*100)}%): ${decimal(extra,2)}\nEstimated trip total: ${decimal(base+extra,2)}\nPer traveler: ${decimal((base+extra)/people,2)}\n\nLodging uses nights = trip days − 1.`;
    }
    default: throw new Error('Unknown everyday calculator.');
  }
}
