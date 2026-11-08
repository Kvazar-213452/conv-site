import Image from 'next/image';
import Link from 'next/link';
import {blogPosts} from '@/lib/blog-catalog';
export default function BlogArticleFrame({slug,children}:{slug:string;children:React.ReactNode}){
  const post=blogPosts.find(p=>p.slug===slug)!;
  return <article className="journal-legacy"><nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Journal</Link><span>/</span><span>{post.topic}</span></nav><figure className="journal-cover"><Image src={post.image} alt={post.alt} width={1440} height={900} sizes="(max-width: 800px) 100vw, 1100px" preload/><figcaption>{post.topic} · A practical developer reference</figcaption></figure><div className="journal-legacy-content">{children}</div><footer className="journal-article-footer"><Link href="/blog">← Explore all guides</Link><span>AI-generated editorial photo</span></footer></article>;
}
