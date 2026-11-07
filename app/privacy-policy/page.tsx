import PrivacyPolicy from './PrivacyPolicy';
import { pageMetadata } from '@/component/ContentSeo';
export const dynamic='force-static';
export const metadata=pageMetadata('Privacy Policy','How browser tools, server file conversions, browser storage and site integrations handle data.','/privacy-policy');
export default function Page(){return <PrivacyPolicy/>;}
