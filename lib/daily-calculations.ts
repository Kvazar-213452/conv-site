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

export function calculateDaily(slug: string, values: DailyValues): string {
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
    default: throw new Error('Unknown everyday calculator.');
  }
}
