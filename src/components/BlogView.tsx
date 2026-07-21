import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, ArrowLeft, Send, CheckCircle2, BookOpen, ChevronLeft, ChevronRight, Eye, MessageSquare, Share2, Twitter, Linkedin, Link2, Check, User } from "lucide-react";
import { getBlogs, saveNewsletterSubscription } from "../lib/db";
import { BlogPost } from "../types";

interface BlogComment {
  id: string;
  author: string;
  role: string;
  content: string;
  date: string;
}

const DEFAULT_COMMENTS: Record<string, BlogComment[]> = {
  "blog-1": [
    {
      id: "comment-s1",
      author: "Sarah Jenkins",
      role: "Lead Front-end Architect",
      content: "This breakdown of state management is extremely detailed. The performance comparison between Context and custom stores matches our production benchmarks exactly.",
      date: "3 days ago"
    },
    {
      id: "comment-s2",
      author: "David Chen",
      role: "Director of Digital",
      content: "Excellent read! We recently refactored our corporate portal using these design guidelines and experienced a massive boost in team velocity.",
      date: "1 day ago"
    }
  ],
  "blog-2": [
    {
      id: "comment-s3",
      author: "Marcus Aurelius",
      role: "UI Engineer",
      content: "A masterclass in micro-interactions. The distinction between satisfying motion and gratuitous animation is something more developers need to understand.",
      date: "5 days ago"
    },
    {
      id: "comment-s4",
      author: "Elena Rostova",
      role: "Product Designer",
      content: "The section on tactile feedback is brilliant. Standardizing touch targets to 44px on mobile completely transformed our checkout conversion rates.",
      date: "2 days ago"
    }
  ],
  "blog-3": [
    {
      id: "comment-s5",
      author: "Julian Thorne",
      role: "Security Consultant",
      content: "Very timely article. Edge computing brings a new set of security challenges, and this summary describes the threat mitigation vectors perfectly.",
      date: "1 week ago"
    },
    {
      id: "comment-s6",
      author: "Amara Okoye",
      role: "Cloud Architect",
      content: "Fascinating insights into sub-millisecond route resolution. We are exploring V8 isolates for our upcoming analytics dashboard as recommended.",
      date: "4 days ago"
    }
  ]
};

// Dynamic Skeleton Grid matching our blog card layout exactly
function BlogSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-skeletons">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col h-full rounded-none">
          <div className="aspect-[16/10] bg-zinc-900/80 rounded-none w-full mb-4" />
          <div className="h-3.5 bg-zinc-900 rounded-none w-1/3 mb-2.5" />
          <div className="h-4.5 bg-zinc-800 rounded-none w-3/4 mb-2.5" />
          <div className="h-3.5 bg-zinc-900 rounded-none w-full mb-1.5" />
          <div className="h-3.5 bg-zinc-900 rounded-none w-5/6 mb-4" />
          <div className="mt-auto pt-3 border-t border-zinc-900/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-zinc-900" />
              <div className="h-3 bg-zinc-900 rounded-none w-16" />
            </div>
            <div className="h-3 bg-zinc-800 rounded-none w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogView() {
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Top slideshow state
  const [activeSlide, setActiveSlide] = useState(0);

  // Views dictionary stored in localStorage
  const [viewsMap, setViewsMap] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("nexlify_blog_views");
    return saved ? JSON.parse(saved) : {};
  });

  // Comments dictionary stored in localStorage (user added)
  const [userCommentsMap, setUserCommentsMap] = useState<Record<string, BlogComment[]>>(() => {
    const saved = localStorage.getItem("nexlify_blog_comments");
    return saved ? JSON.parse(saved) : {};
  });

  // Unique view increment effect on article load
  React.useEffect(() => {
    if (selectedPost) {
      const postId = selectedPost.id;
      const sessionKey = `viewed_${postId}`;
      const alreadyViewed = sessionStorage.getItem(sessionKey);
      
      setViewsMap((prev) => {
        const baseViews = 120 + (postId.charCodeAt(0) || 0) * 3 + (postId.charCodeAt(postId.length - 1) || 0) * 2;
        const current = prev[postId] !== undefined ? prev[postId] : baseViews;
        
        let nextValue = current;
        if (!alreadyViewed) {
          nextValue = current + 1;
          sessionStorage.setItem(sessionKey, "true");
          const updated = { ...prev, [postId]: nextValue };
          localStorage.setItem("nexlify_blog_views", JSON.stringify(updated));
        }
        return { ...prev, [postId]: nextValue };
      });
    }
  }, [selectedPost]);

  // Combined comments helper
  const getCommentsForPost = (postId: string): BlogComment[] => {
    const seeds = DEFAULT_COMMENTS[postId] || [];
    const userComments = userCommentsMap[postId] || [];
    return [...seeds, ...userComments];
  };

  // State for new comment inputs
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentRole, setCommentRole] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Sharing states
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const posts = await getBlogs();
        setBlogsList(posts);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", "Development", "Design", "Technology"];

  const filteredPosts = (blogsList || []).filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured posts (top 3 articles) for the slider
  const featuredPosts = (blogsList || []).slice(0, 3);

  // Automatic transition for slideshow
  React.useEffect(() => {
    if (featuredPosts.length <= 1 || selectedPost) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredPosts.length, selectedPost]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      try {
        await saveNewsletterSubscription(email);
        setSubscribed(true);
        setEmail("");
      } catch (err) {
        console.error("Newsletter sub failed:", err);
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentAuthor.trim() || !commentText.trim()) return;

    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      author: commentAuthor.trim(),
      role: commentRole.trim() || "Technology Enthusiast",
      content: commentText.trim(),
      date: "Just now"
    };

    const postId = selectedPost.id;
    setUserCommentsMap((prev) => {
      const currentList = prev[postId] || [];
      const updatedList = [newComment, ...currentList];
      const updated = { ...prev, [postId]: updatedList };
      localStorage.setItem("nexlify_blog_comments", JSON.stringify(updated));
      return updated;
    });

    setCommentAuthor("");
    setCommentRole("");
    setCommentText("");
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto" id="insights-view-container">
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12"
          >
            {/* Header display */}
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-880 backdrop-blur-md mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nexlify Library</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Latest <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Insights</span>.
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Stay updated with deep technical post-mortems, interface paradigms, and optimal workflow guides authored by our creative leads.
              </p>
            </div>

            {/* Search and Category Control block */}
            <div className="max-w-xl mx-auto space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-850 focus:border-brand-primary text-xs text-white placeholder-zinc-600 focus:outline-none transition-all rounded-none"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      activeCategory === cat
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/15"
                        : "bg-zinc-900/40 text-zinc-500 border-transparent hover:text-white hover:bg-zinc-850"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-12">
                {/* Skeleton for slider */}
                <div className="w-full h-80 bg-zinc-900/40 border border-zinc-900 animate-pulse rounded-none" />
                <BlogSkeletonGrid />
              </div>
            ) : (
              <>
                {/* Immersive Top Slide for Featured Articles */}
                {activeCategory === "All" && !searchTerm.trim() && featuredPosts.length > 0 && (
                  <div className="relative border border-zinc-900 bg-zinc-950/40 rounded-none overflow-hidden" id="featured-insights-slider">
                    <div className="absolute top-3 left-3 z-20 bg-brand-primary border border-brand-primary/20 text-white px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                      Featured Insight
                    </div>
                    
                    <div className="relative min-h-[350px]">
                      <AnimatePresence mode="wait">
                        {featuredPosts.map((post, index) => {
                          if (index !== activeSlide) return null;
                          return (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.35 }}
                              className="grid grid-cols-1 md:grid-cols-12 min-h-[350px] cursor-pointer"
                              onClick={() => setSelectedPost(post)}
                            >
                              {/* Slide image on the right/top */}
                              <div className="md:col-span-5 h-48 md:h-auto overflow-hidden relative border-b md:border-b-0 md:border-r border-zinc-900 order-1 md:order-2">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
                              </div>

                              {/* Slide content on the left/bottom */}
                              <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between order-2 md:order-1 bg-zinc-950/20">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                    <span>{post.date}</span>
                                    <span className="text-zinc-800">•</span>
                                    <span>{post.readTime}</span>
                                    <span className="text-zinc-800">•</span>
                                    <span className="text-brand-primary">{post.category}</span>
                                  </div>

                                  <h2 className="text-xl sm:text-2xl font-black text-white hover:text-brand-primary transition-colors tracking-tight leading-tight line-clamp-2">
                                    {post.title}
                                  </h2>

                                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-900/60">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={post.author.image}
                                      alt={post.author.name}
                                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <h4 className="text-white font-bold text-xs">{post.author.name}</h4>
                                      <p className="text-zinc-600 text-[9px] uppercase tracking-wider">{post.author.role}</p>
                                    </div>
                                  </div>

                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary inline-flex items-center gap-1.5 hover:translate-x-1 transition-transform">
                                    Read Article <BookOpen className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {/* Navigation Arrows */}
                    {featuredPosts.length > 1 && (
                      <div className="absolute right-4 bottom-4 z-20 flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
                          }}
                          className="p-2 border border-zinc-850 hover:border-brand-primary bg-zinc-950/90 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-none"
                          title="Previous slide"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlide((prev) => (prev + 1) % featuredPosts.length);
                          }}
                          className="p-2 border border-zinc-850 hover:border-brand-primary bg-zinc-950/90 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-none"
                          title="Next slide"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Articles Grid display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group rounded-none transition-all duration-500 cursor-pointer flex flex-col h-full"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 shrink-0 rounded-none">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Floating Category Tag */}
                        <span className="absolute top-3 left-3 bg-zinc-950/90 border border-white/5 backdrop-blur-md px-2 py-0.5 rounded-none text-[8px] font-bold uppercase text-zinc-400 tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      <div className="pt-4 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-2 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                          <span>{post.date}</span>
                          <span className="text-zinc-800">•</span>
                          <span>{post.readTime}</span>
                        </div>

                        <h3 className="text-base font-bold text-white mb-1.5 tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto flex justify-between items-center pt-3 border-t border-zinc-900">
                          <div className="flex items-center gap-2">
                            <img src={post.author.image} className="w-5 h-5 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                            <span className="text-[10px] font-bold text-zinc-400">{post.author.name}</span>
                          </div>
                          <span className="text-[8px] font-extrabold uppercase tracking-widest text-brand-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read <BookOpen className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-12 border border-zinc-900 rounded-none max-w-md mx-auto bg-zinc-950/20">
                <p className="text-zinc-500 text-xs font-medium">No articles matched your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                  className="mt-3 text-brand-primary hover:underline text-xs font-bold"
                >
                  Clear search and filters
                </button>
              </div>
            )}

            {/* Newsletter registration panel */}
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-brand-primary/10 via-brand-secondary/5 to-zinc-950 border border-zinc-900 rounded-none p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-lg mx-auto space-y-4">
                <span className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.2em] block">Newsletter</span>
                <h3 className="text-white font-bold text-2xl tracking-tight">Stay Locked In With Tech Updates</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Join hundreds of regional developers and digital managers. We deliver clean, zero-spam educational summaries direct to your inbox twice a month.
                </p>

                <AnimatePresence mode="wait">
                  {!subscribed ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row items-center gap-2 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <input
                        type="email"
                        required
                        placeholder="Enter your professional email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-none bg-zinc-950 border border-zinc-800 text-xs placeholder-zinc-500 text-white focus:border-brand-primary focus:outline-none transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full sm:w-auto shrink-0 bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-3 rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Subscribe <Send className="w-3.5 h-3.5" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-none text-brand-primary inline-flex items-center gap-2 text-xs font-semibold mt-4"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> You've joined the Nexlify list successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.article
            key="reading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-6xl mx-auto"
          >
            {/* Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Insights
              </button>
              
              {/* Quick views badge on top for mobile */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 lg:hidden rounded-none text-[10px] font-bold uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-brand-primary" />
                <span>{viewsMap[selectedPost.id] || 120} Unique Views</span>
              </div>
            </div>

            {/* Title & category header */}
            <div className="space-y-4 max-w-3xl">
              <span className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {selectedPost.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {selectedPost.title}
              </h1>
            </div>

            {/* Dynamic Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Left Side: Image, Content & Comments Section */}
              <div className="lg:col-span-8 space-y-12">
                {/* Cover Image with Progressive Loading Style */}
                <div className="aspect-[16/9] rounded-none overflow-hidden border border-zinc-900 bg-zinc-900 shrink-0">
                  <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
                </div>

                {/* Typography Block Content */}
                <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm sm:text-base space-y-6 border-b border-zinc-900 pb-10">
                  {selectedPost.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h3 key={i} className="text-white font-extrabold text-lg sm:text-xl pt-4">
                          {para.replace("### ", "")}
                        </h3>
                      );
                    }
                    return (
                      <p key={i} className="leading-relaxed font-medium">
                        {para}
                      </p>
                    );
                  })}
                </div>

                {/* Interactive Comments Section */}
                <div className="space-y-8" id="comments-section">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Discussion ({getCommentsForPost(selectedPost.id).length})
                    </h3>
                  </div>

                  {/* Comment Submission Form */}
                  <form onSubmit={handleCommentSubmit} className="space-y-4 bg-zinc-950/60 border border-zinc-900 p-6 rounded-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Join the discussion</h4>
                    <p className="text-zinc-500 text-[10px]">Your professional insight contributes directly to our development standards.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          placeholder="e.g. Liam Parker"
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-brand-primary text-white p-2.5 rounded-none text-xs focus:outline-none transition-all placeholder-zinc-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Professional Role</label>
                        <input
                          type="text"
                          value={commentRole}
                          onChange={(e) => setCommentRole(e.target.value)}
                          placeholder="e.g. Senior Frontend Dev"
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-brand-primary text-white p-2.5 rounded-none text-xs focus:outline-none transition-all placeholder-zinc-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Your Comment *</label>
                      <textarea
                        required
                        rows={4}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Share your technical post-mortem critique or thoughts..."
                        className="w-full bg-zinc-950 border border-zinc-850 focus:border-brand-primary text-white p-2.5 rounded-none text-xs focus:outline-none transition-all placeholder-zinc-700 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <AnimatePresence>
                        {commentSuccess && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Comment published successfully!
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <button
                        type="submit"
                        className="ml-auto px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-none transition-all cursor-pointer flex items-center gap-2"
                      >
                        Publish Comment <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {getCommentsForPost(selectedPost.id).map((comment, index) => (
                      <div
                        key={comment.id || index}
                        className="p-5 border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition-colors rounded-none flex gap-4"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="space-y-1.5 min-w-0 flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <h4 className="text-white font-bold text-xs">{comment.author}</h4>
                              <p className="text-zinc-600 text-[9px] uppercase tracking-wider">{comment.role}</p>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-medium shrink-0">{comment.date}</span>
                          </div>
                          <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Beautiful Sticky Meta Sidebar for Desktop */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                
                {/* Author Info Card */}
                <div className="p-6 bg-zinc-950/30 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-2">
                    Author Profile
                  </h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author.image}
                      alt={selectedPost.author.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-white font-bold text-xs">{selectedPost.author.name}</h4>
                      <p className="text-zinc-600 text-[9px] uppercase tracking-wider">{selectedPost.author.role}</p>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Creative lead specializing in digital system architecture, aesthetic frontend development, and modern UX guidelines.
                  </p>
                </div>

                {/* Article Analytics Card */}
                <div className="p-6 bg-zinc-950/30 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-2">
                    Article Analytics
                  </h4>
                  <div className="space-y-3.5">
                    {/* Unique Views Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">Unique Views</span>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                        </span>
                        <span className="text-white font-black text-xs">
                          {viewsMap[selectedPost.id] || 120}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Read Time</span>
                      <span className="text-zinc-300 font-bold">{selectedPost.readTime}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Published</span>
                      <span className="text-zinc-300 font-bold">{selectedPost.date}</span>
                    </div>
                  </div>
                </div>

                {/* Share Functionality Widget */}
                <div className="p-6 bg-zinc-950/30 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-2">
                    Share Insight
                  </h4>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">
                    Share this high-quality research with your peer networks and team Slack channels.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=Check out this brilliant insight by @nexlify: ${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-2.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:border-brand-primary transition-colors text-xs font-bold rounded-none"
                    >
                      <Twitter className="w-3.5 h-3.5" /> Twitter
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-2.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:border-brand-primary transition-colors text-xs font-bold rounded-none"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  </div>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      
                      // Also try navigator.share API if available
                      if (navigator.share) {
                        navigator.share({
                          title: selectedPost.title,
                          text: selectedPost.excerpt,
                          url: window.location.href,
                        }).catch(() => {});
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-brand-primary transition-all text-xs font-extrabold uppercase tracking-wider rounded-none cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        <span className="text-emerald-500">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Copy Link Address</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Inside Sidebar quick subscription banner */}
                <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-zinc-950 border border-zinc-900 rounded-none text-left space-y-3">
                  <h5 className="text-white font-bold text-xs">Stay locked in</h5>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">
                    Get bi-weekly digital updates on clean system architecture directly in your inbox.
                  </p>
                  <button
                    onClick={() => {
                      const newsletterElement = document.getElementById("insights-view-container");
                      if (newsletterElement) {
                        newsletterElement.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-brand-primary hover:underline text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    Subscribe below <Send className="w-2.5 h-2.5" />
                  </button>
                </div>

              </div>

            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
