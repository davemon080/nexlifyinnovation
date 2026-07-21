export type ViewType = 
  | "home" 
  | "services" 
  | "portfolio" 
  | "about" 
  | "training" 
  | "blog" 
  | "careers" 
  | "contact" 
  | "book-consultation"
  | "admin-dashboard";

export interface Service {
  id: string;
  title: string;
  icon: string; // lucide icon name
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  technologies: string[];
  timeline: string;
  faq: { q: string; a: string }[];
  image: string;
  variant: "primary" | "secondary" | "accent";
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
  problem: string;
  solution: string;
  tech: string[];
  timeline: string;
  outcome: string;
  url?: string;
  createdAt?: number;
  feedback: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Course {
  id: string;
  title: string;
  price: string;
  duration: string;
  variant: "primary" | "secondary" | "accent";
  features: string[];
  requirements: string[];
  mentors: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface AboutPageData {
  title?: string;
  story?: string;
  description?: string;
  vision?: string;
  mission?: string;
  futureTitle?: string;
  futureDesc?: string;
  futureMetricCount?: string;
  futureMetricTitle?: string;
  futureMetricSubtitle?: string;
}
