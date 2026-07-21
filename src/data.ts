import { Service, Project, Course, TeamMember, BlogPost, JobOpening } from "./types";

export const SERVICES: Service[] = [
  {
    id: "web-dev",
    title: "Web Development",
    icon: "Code",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    description: "High-performance architectures built with next-gen web technologies.",
    longDescription: "We craft robust, lighting-fast websites and custom web applications that scale effortlessly. We utilize cutting-edge technology stacks such as React, Next.js, and Node.js to provide secure, ultra-fast experiences optimized for conversion and usability.",
    features: [
      "Custom React & Next.js Development",
      "Dynamic Headless CMS Implementations",
      "API Integrations & Custom Web APIs",
      "SEO & Page Speed Optimization",
      "E-commerce Architectures (Shopify, Custom)"
    ],
    benefits: [
      "Increase load speed by up to 150% for lower bounce rates.",
      "Bulletproof security with isolated database endpoints.",
      "Responsive design layouts engineered for all viewport scales.",
      "Clean modular code structure enabling infinite future scalability."
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL"],
    timeline: "2-4 Weeks",
    faq: [
      { q: "Do you build custom ecommerce platforms?", a: "Yes, we specialize in high-converting custom Shopify stores as well as complete headless commerce integrations with custom checkouts." },
      { q: "Will my website look great on both mobile and large screens?", a: "Absolutely. Every pixel is tested on modern Android, iOS, tablet, and ultra-wide monitor displays to guarantee seamless layout responsiveness." }
    ],
    variant: "primary"
  },
  {
    id: "graphic-design",
    title: "Graphic Designing",
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    description: "Stunning brand identities, marketing assets, and vector materials.",
    longDescription: "Formulate a visual identity that instantly commands trust and attention. From bespoke logomarks and cohesive brand playbooks to striking digital marketing collateral, we blend modern color theory and elegant typography to express your brand's unique character.",
    features: [
      "Custom Corporate Logo Marks",
      "Comprehensive Brand Style Guides",
      "Marketing Collateral & Presentation Decks",
      "Social Media & Advertising Graphics",
      "High-Quality Vector Illustration Assets"
    ],
    benefits: [
      "Establish deep trust with clients instantly via premium branding consistency.",
      "Stand out distinctively from competitors relying on templated aesthetics.",
      "Clear guidelines making it effortless for your internal team to publish content.",
      "Get raw, high-resolution source vectors ready for print or web deployment."
    ],
    technologies: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Vector Art", "Brand Design", "Color Systems"],
    timeline: "1-2 Weeks",
    faq: [
      { q: "What design formats will we receive?", a: "You'll receive fully scaleable SVGs, vector EPS, high-res PNGs, PDFs, and editable master design files." },
      { q: "Do you offer branding revision rounds?", a: "Yes, we collaborate closely with you through iterative mood boards and offer multiple revision steps to align perfectly with your vision." }
    ],
    variant: "secondary"
  },
  {
    id: "content-writing",
    title: "Content Writing",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    description: "High-impact copy, SEO-optimized articles, and compelling brand stories.",
    longDescription: "Connect deeply with your audience through words that drive action. We craft search-optimized articles, engaging website copy, thought-leadership pieces, and marketing material designed to tell your brand story and boost search engine visibility.",
    features: [
      "SEO Keyword-Optimized Article Writing",
      "High-Converting Sales & Landing Page Copy",
      "Brand Storytelling & Narrative Architectures",
      "Corporate Press Releases & Whitepapers",
      "Consistent Social Media Narrative Kits"
    ],
    benefits: [
      "Drive passive organic traffic to your platform through strategic SEO keyword placement.",
      "Build authority in your field with professional and informative articles.",
      "Improve website conversions using persuasive copy that directs user attention.",
      "Maintain a clear, polished tone across all your communication channels."
    ],
    technologies: ["SEO Keywords", "Copywriting", "Content Strategy", "Brand Storytelling", "Grammarly Pro", "Market Research"],
    timeline: "1-2 Weeks",
    faq: [
      { q: "Is the written content thoroughly researched?", a: "Yes, every piece of copy undergoes deep competitive research and outline verification before writing begins." },
      { q: "Do you handle SEO keyword optimization?", a: "Absolutely. We weave relevant organic search keywords into headings and body text naturally to maximize indexing potential." }
    ],
    variant: "accent"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "nexcom",
    title: "NexCommerce Platform",
    client: "Nexcom Retail Global",
    category: "Websites",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    problem: "Nexcom was losing 45% of potential checkouts due to slow loading speeds on their monolithic legacy platform, which failed completely during regional sales events.",
    solution: "We rebuilt their entire infrastructure into a decoupled, serverless Next.js storefront utilizing GraphQL and distributed Redis caching at the edge, coupled with an optimized single-page custom checkout.",
    tech: ["Next.js", "React", "GraphQL", "Tailwind CSS", "Node.js", "Redis"],
    timeline: "5 Weeks",
    outcome: "Page loading speed dropped from 4.8s to 0.9s. Check out conversion rate increased by 62%, and server costs fell by 40% due to serverless autoscaling.",
    url: "https://nexcom.nexlify.io",
    feedback: {
      quote: "Nexlify transformed our business. Our platform is faster than we ever imagined, and it handles our massive black friday traffic without a single hiccup.",
      author: "Adewale Bakare",
      role: "VP of Operations, Nexcom Retail"
    }
  },
  {
    id: "smartedu",
    title: "SmartEdu Online Hub",
    client: "SmartEdu Academy",
    category: "Websites",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    problem: "SmartEdu's students in remote areas faced frequent connection loss, rendering virtual study rooms unusable due to unstable web syncs.",
    solution: "We designed and deployed a robust, responsive web portal in React & Node.js utilizing localized service workers that auto-synchronize back-and-forth seamlessly via delta change updates.",
    tech: ["React", "TypeScript", "Service Workers", "Node.js", "WebSockets"],
    timeline: "6 Weeks",
    outcome: "Students could study continuously without active signals. Active user retention spiked by 85% in rural communities, with zero data-loss events reported.",
    url: "https://smartedu.nexlify.io",
    feedback: {
      quote: "The team's focus on user experience and offline syncing made this product a huge success. Our students love using the app daily.",
      author: "Chima Okereke",
      role: "Director, SmartEdu Academy"
    }
  },
  {
    id: "vividbrand",
    title: "Vivid Brand Identity",
    client: "Vivid Creative Studios",
    category: "Graphic Designs",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    problem: "Vivid Creative was perceived as a low-cost designer instead of a high-end agency, due to outdated, mismatched typography and lack of brand guides.",
    solution: "We designed a full premium brand architecture. We crafted a custom geometric vector logo, curated a sophisticated display font layout, and created a beautifully polished corporate brand style guide.",
    tech: ["Figma", "Adobe Illustrator", "InDesign", "Color Psychology"],
    timeline: "3 Weeks",
    outcome: "The new identity immediately repositioned them. Within three months, they successfully closed corporate clients at a 3x higher average deal value.",
    feedback: {
      quote: "This is pure craftsmanship. The guidelines are detailed, beautiful, and gave our agency the confidence to pitch the country's largest brands.",
      author: "Fatima Yusuf",
      role: "Co-Founder, Vivid Studios"
    }
  }
];

export const COURSES: Course[] = [
  {
    id: "graphic-design",
    title: "Graphic Design Masterclass",
    price: "8,000",
    duration: "2 Months Program",
    variant: "accent",
    features: [
      "Figma, Photoshop & Illustrator Essentials",
      "Core Color Psychology & Visual Layout Grid",
      "Logo & Brand Identity Styleguide Designing",
      "Professional Certificate of Academy Graduation",
      "Live Direct Interactive Mentor Support Rooms"
    ],
    requirements: ["Smartphone or Laptop required"],
    mentors: ["Favor (Lead Designer)", "Abutu Joseph (Creative Director)"]
  },
  {
    id: "frontend-dev",
    title: "Frontend Web Development",
    price: "150,000",
    duration: "2 Months Program",
    variant: "primary",
    features: [
      "Modern HTML5, Semantic Elements & CSS3",
      "Intermediate & Advanced JavaScript Frameworks",
      "React.js Single Page App (SPA) Component Crafting",
      "Professional Github Portfolio Deployments",
      "Lifetime Direct Access to Mentorship Rooms"
    ],
    requirements: ["Laptop is strictly required"],
    mentors: ["David Simon (Frontend Architect)", "Israel Ujah (Manager)"]
  },
  {
    id: "fullstack-dev",
    title: "Fullstack Web Development",
    price: "250,000",
    duration: "3 Months Program",
    variant: "secondary",
    features: [
      "All Frontend Foundations (HTML, CSS, React)",
      "Express.js & Node.js Serverless Architectures",
      "SQL & NoSQL Database Storage Structures",
      "Deployment Pipelines (GCP, AWS & Docker)",
      "High-Value Technical Internship Projects"
    ],
    requirements: ["Laptop is strictly required"],
    mentors: ["David Simon (Frontend Architect)", "Israel Ujah (Manager)"]
  }
];

export const TEAM: TeamMember[] = [
  {
    name: "David Simon",
    role: "Founder & Lead Creative",
    image: "https://iili.io/Bp1FLPV.jpg",
    bio: "Visionary designer and lead developer driving technological innovation and digital literacy across Nigeria.",
    socials: { twitter: "#", linkedin: "#", instagram: "https://instagram.com/nexlify_innovation" }
  },
  {
    name: "Israel Ujah",
    role: "Manager",
    image: "https://iili.io/Bp1YSuj.png",
    bio: "Strategic director ensuring pristine operations, high-fidelity project delivery, and academy student excellence.",
    socials: { linkedin: "#" }
  },
  {
    name: "Favor",
    role: "Lead Graphic Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Visual storyteller shaping highly memorable branding and user identities for multi-national digital brands.",
    socials: { instagram: "#" }
  },
  {
    name: "Divine Favor",
    role: "Content Lead",
    image: "https://iili.io/Bp1z2a4.jpg",
    bio: "Copywriter specializing in strategic narratives and high-conversion marketing assets for tech scaleups.",
    socials: { twitter: "#", linkedin: "#" }
  },
  {
    name: "Abutu Joseph",
    role: "Content Specialist",
    image: "https://iili.io/BpMaPnf.jpg",
    bio: "Engaging editor and developer relations specialist translating technical concepts into viral digital content.",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Anigboro Joseph",
    role: "Content Writer",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80",
    bio: "Researcher dedicated to delivering highly engaging corporate blog posts and clear technical writing.",
    socials: { linkedin: "#" }
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Shift to Jamstack: Why Modern Companies are Abandoning WordPress",
    excerpt: "Explore how headless Next.js, React, and serverless technology are transforming page speeds and site security.",
    content: `For over a decade, WordPress was the default choice for building corporate websites. But as user expectations for web performance hit an all-time high, legacy monolith systems are proving too slow, bloated, and vulnerable to hacks.\n\nEnter the Jamstack architecture (JavaScript, APIs, and Markup). By pre-rendering page structures into blazing-fast static assets distributed on CDNs globally, and accessing server resources via lightweight serverless APIs, companies are unlocking unprecedented speeds.\n\n### Speed Matters\nStudy after study shows that a 100ms delay in website load times can hurt conversion rates by up to 7%. Jamstack sites load almost instantaneously (often under 1.0 second), compared to the 3-5 seconds of typical database-heavy WordPress configurations.\n\n### Robust Security\nBecause there is no active database connected directly to the user frontend in static sites, typical SQL injections and database hacking strategies are rendered completely useless. Your site becomes a bulletproof fortress.\n\nAt Nexlify Innovation, we help companies migrate from outdated architectures to highly performant Next.js and Tailwind setups, ensuring maximum speed, safety, and modern visual design.`,
    category: "Development",
    date: "July 12, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "David Simon",
      role: "Lead Creative",
      image: "https://iili.io/Bp1FLPV.jpg"
    }
  },
  {
    id: "blog-2",
    title: "Designing for the Next Billion Users: Accessibility and Mobile Optimization",
    excerpt: "How to build digital products that operate flawlessly under sub-optimal network connectivity and older device processors.",
    content: `Designing digital products for emerging markets requires a fundamental shift in perspective. You are no longer designing for high-speed fiber internet and high-end modern computer monitors.\n\nInstead, you must design for 'the next billion users'—many of whom access services exclusively on low-tier mobile devices under slow 3G or 4G connections.\n\n### Performance-First UI/UX\nWhen every kilobyte counts, heavy animations and large uncompressed images become critical liabilities. We prioritize CSS-only designs, SVG iconography over heavy image folders, and lazy load assets on demand. This ensures your service loads in under two seconds, even on older smartphones.\n\n### Accessibility (WCAG AA)\nGood design is inclusive. Proper color contrast, large touch targets (minimum 44px), clear typographical hierarchies, and semantic code structures mean everyone can browse your app seamlessly, including users with visual or physical impairments.`,
    category: "Design",
    date: "June 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Favor",
      role: "Lead Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
    }
  },
  {
    id: "blog-3",
    title: "Maximizing ROI on AI: Integrating Smart APIs in Customer Workflows",
    excerpt: "Practical strategies for businesses to implement LLMs for customer success without risking massive API subscription budgets.",
    content: `Artificial intelligence is no longer a sci-fi concept; it is an active driver of modern enterprise productivity. However, many businesses rush into AI integrations without a solid cost-containment or utility-first plan.\n\nTo see true ROI on AI integrations, companies should target narrow, high-frequency bottlenecks: customer support and automated content categorization.\n\n### Intent-Driven Chat Agents\nBy leveraging smart API calls with pre-determined system instructions, support portals can resolve up to 80% of routine client questions. This frees your human staff to handle high-value consulting, leading to dramatic productivity spikes.\n\nAt Nexlify, we specialize in implementing light, cost-contained Gemini SDK integrations tailored to actual client workflows, ensuring smart features enhance your product experience without expanding your operating budget.`,
    category: "Technology",
    date: "May 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Abutu Joseph",
      role: "Content Specialist",
      image: "https://iili.io/BpMaPnf.jpg"
    }
  }
];

export const JOBS: JobOpening[] = [
  {
    id: "career-1",
    title: "Senior React & Node Developer",
    department: "Engineering",
    location: "Nassarawa State, NG (Hybrid)",
    type: "Full-time",
    description: "We are seeking a talented Senior Developer to lead our client projects and architect our high-performance SaaS applications and training portals.",
    requirements: [
      "3+ years experience with React, TypeScript, and Node.js.",
      "Proven track record of deploying robust APIs and modern server architectures.",
      "Deep understanding of database systems (PostgreSQL / Firestore).",
      "Passion for writing clean, modular, and performant code."
    ],
    benefits: [
      "Competitive Salary (₦350,000 - ₦550,000/mo depending on expertise).",
      "Health insurance & wellness support structures.",
      "Annual remote learning budget & tech equipment allowance.",
      "Supportive, high-growth environment with flexible hybrid hours."
    ]
  },
  {
    id: "career-2",
    title: "Lead Visual / Brand Designer",
    department: "Creative Studio",
    location: "Nassarawa State, NG (Hybrid)",
    type: "Full-time",
    description: "Shape the visual future of Nexlify and our global client list. You will lead UI/UX design, corporate branding assets, and brand books.",
    requirements: [
      "2+ years experience as a UI/UX or Brand Designer.",
      "An exceptional portfolio showcasing modern, high-contrast layouts.",
      "Mastery of Figma, Adobe Illustrator, and Photoshop.",
      "Excellent communication and team presentation skills."
    ],
    benefits: [
      "Competitive Salary (₦180,000 - ₦280,000/mo).",
      "Continuous creative mentorship programs.",
      "Collaborative workspaces with top-of-the-line creative systems.",
      "Direct profit-share on high-value branding projects."
    ]
  }
];

export const FAQs = [
  {
    q: "Where is Nexlify Innovation located?",
    a: "We are proudly headquartered in Nassarawa State, Nigeria, serving local clients and global enterprises hybridly."
  },
  {
    q: "Can I take the training courses online?",
    a: "Yes! We support flexible hybrid structures where students can learn in-person or online with direct, interactive access to recorded video sessions and live weekly support rooms with their mentors."
  },
  {
    q: "How do I book a general consultation for my company?",
    a: "You can use our in-app Consultation Booking system directly, select your preferred service focus, pick a date and time, and our team will lock in the meeting with you via WhatsApp and Google Meet."
  },
  {
    q: "What makes Nexlify different from standard creative agencies?",
    a: "We are not just agency providers; we are technology builders and educators. We couple state-of-the-art software craftsmanship with dedicated academy mentoring, creating an end-to-end technology ecosystem right here in Nigeria."
  }
];

export const PROCESS_STAGES = [
  {
    num: "01",
    title: "Discovery & Blueprint",
    desc: "We research your target market and draft high-fidelity wireframes mapping your exact customer journeys."
  },
  {
    num: "02",
    title: "Handcrafted UI/UX Design",
    desc: "We craft custom visual languages and interactive prototypes in Figma for your early validation."
  },
  {
    num: "03",
    title: "Premium Development",
    desc: "We build your platform utilizing clean, modular TypeScript code with strict performance testing."
  },
  {
    num: "04",
    title: "Autoscaling Deployment",
    desc: "We deploy onto secure, serverless cloud endpoints backed by robust monitoring and instant speeds."
  }
];

export const TECH_STACK = [
  { category: "Frontend", items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express.js", "PostgreSQL", "Firestore", "GraphQL"] },
  { category: "Infrastructure", items: ["Docker", "Google Cloud Run", "AWS Lambda", "Vercel", "CI/CD Pipelines"] },
  { category: "Creative Tooling", items: ["Figma", "Adobe Illustrator", "Premiere Pro", "DaVinci Resolve"] }
];
