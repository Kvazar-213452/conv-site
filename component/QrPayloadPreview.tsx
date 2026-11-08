"use client";
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
export default function QrPayloadPreview({value}:{value:string}){
 const [src,setSrc]=useState(''),[error,setError]=useState('');
 useEffect(()=>{let active=true;QRCode.toDataURL(value,{errorCorrectionLevel:'M',margin:2,width:320}).then(url=>{if(active)setSrc(url);}).catch(()=>{if(active)setError('Unable to create the QR image.');});return()=>{active=false;};},[value]);
 return <div className="growth-preview-stage" aria-label="Generated vCard QR code">{src?<><img src={src} alt="QR code containing the vCard contact" width="320" height="320"/><p><a className="btn-secondary" href={src} download="contact-vcard-qr.png">Download QR code</a></p></>:<p role={error?'alert':'status'}>{error||'Creating QR code…'}</p>}</div>;
}
