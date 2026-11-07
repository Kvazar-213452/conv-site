"use client";
import {parseDelimited} from '@/lib/growth-transforms';
export default function TableInputEditor({headers,value,onChange}:{headers:string[];value:string;onChange:(value:string)=>void}){
  const rows=value.trim()?parseDelimited(value).slice(1):[];
  function update(next:string[][]){const cell=(text:string)=>/[",\r\n]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;onChange([headers,...next].map(row=>row.map(cell).join(',')).join('\n'));}
  return <div className="public-input-table"><div className="public-table-scroll"><table><thead><tr>{headers.map(h=><th scope="col" key={h}>{h}</th>)}<th scope="col"><span className="visually-hidden">Remove row</span></th></tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{headers.map((header,col)=><td key={header}><input aria-label={header+', row '+(index+1)} value={row[col]??''} onChange={e=>update(rows.map((r,i)=>i===index?headers.map((_,j)=>j===col?e.target.value:r[j]??''):r))}/></td>)}<td><button className="btn-secondary" type="button" aria-label={'Remove row '+(index+1)} onClick={()=>update(rows.filter((_,i)=>i!==index))}>×</button></td></tr>)}</tbody></table></div><button type="button" className="btn-secondary" disabled={rows.length>=100} onClick={()=>update([...rows,headers.map(()=> '')])}>+ Add row</button></div>;
}
