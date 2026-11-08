"use client";
import { useEffect, useRef, useState } from 'react';
const clock=(n:number)=>{const s=Math.max(0,Math.ceil(n));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;};
export default function PomodoroPreview({focus,breakTime}:{focus:number;breakTime:number}){
 const [phase,setPhase]=useState<'focus'|'break'>('focus'),[left,setLeft]=useState(focus),[running,setRunning]=useState(false),[sessions,setSessions]=useState(0);const end=useRef(0);
 useEffect(()=>{if(!running)return;const id=window.setInterval(()=>{const remain=Math.max(0,(end.current-performance.now())/1000);setLeft(remain);if(remain<=0){if(phase==='focus'){setSessions(x=>x+1);setPhase('break');setLeft(breakTime);end.current=performance.now()+breakTime*1000;}else{setPhase('focus');setLeft(focus);end.current=performance.now()+focus*1000;}}},200);return()=>clearInterval(id);},[running,phase,focus,breakTime]);
 function toggle(){if(running){setLeft(Math.max(0,(end.current-performance.now())/1000));setRunning(false);}else{end.current=performance.now()+left*1000;setRunning(true);}}
 function reset(){setRunning(false);setPhase('focus');setLeft(focus);}
 return <section className="live-timer" aria-label="Pomodoro focus timer"><h2>{phase==='focus'?'Focus session':'Break'}</h2><output className="live-timer-clock" aria-live="off">{clock(left)}</output><p>{sessions} focus session{sessions===1?'':'s'} completed</p><div className="actions"><button type="button" className="btn-convert timer-toggle" onClick={toggle}>{running?'Pause':'Start'}</button><button type="button" className="btn-secondary" onClick={reset}>Reset cycle</button></div><p className="timer-finished">Timer runs in this tab. Browser sleep can pause updates.</p></section>;
}
