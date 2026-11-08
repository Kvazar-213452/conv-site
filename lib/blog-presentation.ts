export const blogTopics = ['All topics','Data & APIs','Web & performance','Security','CSS & design','Developer workflow','Math & time','Files & media','Money & finance','SEO & marketing','Health & fitness','Home & cooking','Career & jobs','Writing & content','Generators'] as const;
export type BlogTopic = typeof blogTopics[number];
export function blogDate(date:string){return new Intl.DateTimeFormat('en',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'));}
