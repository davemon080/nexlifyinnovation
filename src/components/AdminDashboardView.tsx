import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Unlock, 
  User, 
  Mail, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  Database, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Settings, 
  Activity,
  UserPlus,
  UserCheck,
  Save,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Sun,
  Moon,
  Menu,
  BookOpen,
  GraduationCap,
  Info,
  Layout,
  Layers,
  Users,
  LayoutDashboard,
  Bell,
  Check,
  CheckCheck,
  BellOff,
  ChevronDown,
  ChevronUp,
  Key,
  HelpCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  Eye,
  RefreshCw,
  Award
} from "lucide-react";
import { 
  Consultation, 
  ContactMessage, 
  JobApplication, 
  StaffUser, 
  getConsultations, 
  updateConsultationStatus, 
  deleteConsultation,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  getJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
  getStaffUsers,
  updateStaffRole,
  updateStaffPermissions,
  updateStaffProfile,
  updateStaffPassword,
  verifyActiveSession,
  registerStaffUser,
  loginStaffUser,
  deleteStaffUser,
  isFirebaseConnected,
  getServices,
  saveService,
  deleteService,
  getProjects,
  saveProject,
  deleteProject,
  getCourses,
  saveCourse,
  deleteCourse,
  getBlogs,
  saveBlog,
  deleteBlog,
  getJobs,
  saveJob,
  deleteJob,
  getAboutPageData,
  saveAboutPageData,
  getTeamMembers,
  saveTeamMember,
  deleteTeamMember,
  AboutPageData,
  getCachedConsultations,
  getCachedContactMessages,
  getCachedJobApplications,
  getCachedStaffUsers,
  getCachedServices,
  getCachedProjects,
  getCachedCourses,
  getCachedBlogs,
  getCachedJobs,
  getCachedAboutPageData,
  getCachedTeamMembers
} from "../lib/db";
import { Service, Project, Course, TeamMember, BlogPost, JobOpening } from "../types";
import { normalizeProjectCategory } from "../lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: "light" | "dark";
}

function ImageUploadField({ label, value, onChange, placeholder, theme }: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          onChange(compressedBase64);
        } else {
          onChange(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const isBase64 = value ? value.startsWith("data:image/") : false;

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Clear Image
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* URL Input and drag-and-drop zone */}
        <div className="md:col-span-3 space-y-2">
          <input
            type="text"
            placeholder={placeholder || "https://example.com/image.jpg"}
            value={isBase64 ? "Uploaded from device (Base64)" : value}
            disabled={isBase64}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
              isBase64 ? "opacity-60 cursor-not-allowed" : ""
            } ${
              theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
            }`}
          />
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 min-h-[90px] ${
              isDragging 
                ? "border-brand-primary bg-brand-primary/5" 
                : theme === "light"
                  ? "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                  : "border-zinc-800 hover:border-zinc-750 bg-zinc-950/20 hover:bg-zinc-950/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className={`p-1.5 rounded-xl ${theme === "light" ? "bg-white text-slate-500" : "bg-zinc-900 text-zinc-400"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand-primary">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <div>
              <p className={`text-[10px] font-bold ${theme === "light" ? "text-slate-700" : "text-zinc-300"}`}>
                Drag & drop or <span className="text-brand-primary">browse device</span>
              </p>
              <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Supports JPG, PNG, GIF (Compressed)</p>
            </div>
            {error && <p className="text-[9px] text-red-500 font-semibold mt-1">{error}</p>}
          </div>
        </div>

        {/* Real-time Visual Image Preview */}
        <div className="md:col-span-2 flex items-center justify-center">
          <div className={`w-full h-full min-h-[110px] rounded-2xl border flex items-center justify-center p-2 relative overflow-hidden ${
            theme === "light" ? "border-slate-200 bg-slate-50/30" : "border-zinc-850 bg-zinc-950/20"
          }`}>
            {value ? (
              <div className="relative w-full h-full min-h-[110px] flex items-center justify-center">
                <img
                  src={value}
                  alt="Preview"
                  className="max-h-[110px] w-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-lg border border-white/10 text-white hover:bg-black transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); onChange(""); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-brand-primary/90 text-[8px] font-black uppercase tracking-wider text-white rounded-md shadow">
                  {isBase64 ? "Local Device" : "External URL"}
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-zinc-600 mb-1">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">No Image Selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getDefaultTabsForRole = (role: StaffUser["role"] | string): string[] => {
  if (role === "CEO") {
    return ["overview", "bookings", "messages", "careers", "insights_cms", "careers_cms", "training_cms", "about_cms", "portfolio_cms", "services_cms", "staff", "my_profile"];
  }
  if (role === "Manager") {
    return ["overview", "bookings", "messages", "careers", "insights_cms", "careers_cms", "training_cms", "about_cms", "portfolio_cms", "services_cms", "my_profile"];
  }
  if (role === "Customer Support") {
    return ["overview", "bookings", "messages", "insights_cms", "my_profile"];
  }
  if (role === "Designer") {
    return ["overview", "portfolio_cms", "insights_cms", "my_profile"];
  }
  if (role === "Developer") {
    return ["overview", "portfolio_cms", "insights_cms", "my_profile"];
  }
  if (role === "Content Editor") {
    return ["overview", "insights_cms", "my_profile"];
  }
  return ["overview", "insights_cms", "my_profile"];
};

export const isTabPermitted = (tabId: string, role: string, allowedTabs?: string[]) => {
  if (role === "CEO") return true;

  if (allowedTabs && Array.isArray(allowedTabs)) {
    return allowedTabs.includes(tabId);
  }

  const defaults = getDefaultTabsForRole(role);
  return defaults.includes(tabId);
};

export const ALL_SYSTEM_MODULES = [
  { id: "overview", label: "Executive Overview", category: "Executive Hub", desc: "Analytics, revenue metrics & operational KPIs" },
  { id: "bookings", label: "Client Bookings", category: "Executive Hub", desc: "Free consultation requests & schedule management" },
  { id: "messages", label: "Messages Hub", category: "Executive Hub", desc: "Inbound client contact inquiries & lead notes" },
  { id: "careers", label: "Job Applications", category: "Executive Hub", desc: "Candidate resumes & recruitment pipeline" },
  { id: "insights_cms", label: "Insights CMS", category: "Content & Publishing", desc: "Tech blog posts & thought leadership publishing" },
  { id: "careers_cms", label: "Careers CMS", category: "Content & Publishing", desc: "Active job openings & hiring descriptions" },
  { id: "training_cms", label: "Training CMS", category: "Content & Publishing", desc: "Academy courses, curriculums & training tracks" },
  { id: "about_cms", label: "About Us CMS", category: "Content & Publishing", desc: "Company timeline, values & leadership team bios" },
  { id: "portfolio_cms", label: "Portfolio CMS", category: "Content & Publishing", desc: "Client case studies & design/tech showcases" },
  { id: "services_cms", label: "Services CMS", category: "Content & Publishing", desc: "Service offerings, features & pricing tiers" },
  { id: "staff", label: "Security & Staff", category: "System & Governance", desc: "User permissions, staff provisioning & security logs" },
];

export interface RoleGuideDetail {
  role: StaffUser["role"];
  title: string;
  badgeClass: string;
  summary: string;
  securityLevel: "Root Level" | "Operational Level" | "Specialized Level" | "Basic Level";
  keyResponsibilities: string[];
}

export const ROLE_PERMISSIONS_GUIDE: Record<StaffUser["role"], RoleGuideDetail> = {
  CEO: {
    role: "CEO",
    title: "Chief Executive / Root Admin",
    badgeClass: "bg-brand-primary/15 text-brand-primary border-brand-primary/30",
    summary: "Unrestricted root administrative power across all 11 business hubs, CMS platforms, staff accounts, and security configurations.",
    securityLevel: "Root Level",
    keyResponsibilities: [
      "Provision, modify, and delete staff accounts across all roles",
      "Full read/write access across all Executive Hubs (Bookings, Messages, Careers)",
      "Full publishing control over all 6 CMS modules",
      "Manage system security, database node connections & administrative logs"
    ]
  },
  Manager: {
    role: "Manager",
    title: "Operations & Content Director",
    badgeClass: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    summary: "Complete operational management authority across client communications, candidate pipelines, and all site CMS content publishing.",
    securityLevel: "Operational Level",
    keyResponsibilities: [
      "Manage client consultation schedules & booking statuses",
      "Review and respond to incoming customer messages",
      "Review job candidate submissions and manage recruitment pipeline",
      "Full write/edit access across all 6 CMS publishing modules",
      "Restricted from managing staff account roles or security settings"
    ]
  },
  Developer: {
    role: "Developer",
    title: "Engineering Lead / Developer",
    badgeClass: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    summary: "Technical showcase access to maintain agency case studies, engineering portfolios, tech stack tags, and live deployment links.",
    securityLevel: "Specialized Level",
    keyResponsibilities: [
      "View executive dashboard analytics and performance metrics",
      "Create, edit, and update engineering portfolio projects",
      "Maintain live project links, tech stack badges, and code details"
    ]
  },
  Designer: {
    role: "Designer",
    title: "Creative Director / UI Designer",
    badgeClass: "bg-purple-500/15 text-purple-500 border-purple-500/30",
    summary: "Creative access to publish visual design case studies, design system articles, and portfolio showcases.",
    securityLevel: "Specialized Level",
    keyResponsibilities: [
      "View executive dashboard analytics and performance metrics",
      "Update portfolio visual showcases and graphic design assets",
      "Publish design leadership articles to the Insights CMS"
    ]
  },
  "Content Editor": {
    role: "Content Editor",
    title: "Editorial & Content Strategist",
    badgeClass: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    summary: "Editorial authority to write, edit, format, and publish articles, news updates, and tech thoughts in the Insights CMS.",
    securityLevel: "Specialized Level",
    keyResponsibilities: [
      "View executive dashboard analytics and performance metrics",
      "Draft, edit, publish, and delete blog insights",
      "Manage article categories, content, and author attributions"
    ]
  },
  "Customer Support": {
    role: "Customer Support",
    title: "Client Communications Specialist",
    badgeClass: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
    summary: "Front-line client relations access to process consultation bookings and reply to customer contact inquiries.",
    securityLevel: "Specialized Level",
    keyResponsibilities: [
      "Review and update statuses of client consultation bookings",
      "Read and respond to incoming contact inquiries",
      "Ensure fast response times for prospective clients"
    ]
  },
  Employee: {
    role: "Employee",
    title: "Standard Team Member",
    badgeClass: "bg-slate-500/15 text-slate-500 border-slate-500/30",
    summary: "Baseline employee account with read-only visibility into executive dashboard analytics and agency performance metrics.",
    securityLevel: "Basic Level",
    keyResponsibilities: [
      "View high-level executive dashboard analytics",
      "Read-only visibility into corporate performance KPIs"
    ]
  }
};

interface AdminDashboardViewProps {
  setView?: (view: any) => void;
}

export default function AdminDashboardView({ setView }: AdminDashboardViewProps) {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  
  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("nexlify_admin_theme") as "dark" | "light") || "dark";
  });

  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<StaffUser["role"]>("Employee");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data State
  const [consultations, setConsultations] = useState<Consultation[]>(() => getCachedConsultations());
  const [messages, setMessages] = useState<ContactMessage[]>(() => getCachedContactMessages());
  const [applications, setApplications] = useState<JobApplication[]>(() => getCachedJobApplications());
  const [staffList, setStaffList] = useState<StaffUser[]>(() => getCachedStaffUsers());
  const [dbStatus, setDbStatus] = useState(false);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);

  // Dynamically calculated real-time notifications
  const allNotifications = [
    ...messages.filter(m => !m.read).map(m => ({
      id: `msg-${m.id}`,
      title: `Unread Message: ${m.name}`,
      subtitle: m.subject || (m.message.length > 40 ? m.message.slice(0, 40) + "..." : m.message),
      time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
      type: "Message",
      tab: "messages" as const,
      isRead: readNotifIds.includes(`msg-${m.id}`)
    })),
    ...consultations.filter(c => c.status === "Pending").map(c => ({
      id: `consult-${c.id}`,
      title: `Pending Booking: ${c.name}`,
      subtitle: `${c.service} • ${c.date} ${c.time}`,
      time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "New",
      type: "Booking",
      tab: "bookings" as const,
      isRead: readNotifIds.includes(`consult-${c.id}`)
    })),
    ...applications.filter(a => a.status === "Reviewing").map(a => ({
      id: `app-${a.id}`,
      title: `Job Applicant: ${a.name}`,
      subtitle: `Applied for ${a.jobTitle}`,
      time: a.submittedAt ? new Date(a.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "New",
      type: "Applicant",
      tab: "careers" as const,
      isRead: readNotifIds.includes(`app-${a.id}`)
    }))
  ];

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  // UI Active State
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "messages" | "careers" | "insights_cms" | "careers_cms" | "training_cms" | "about_cms" | "portfolio_cms" | "services_cms" | "staff" | "my_profile">("overview");

  // Profile state
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  const profileFileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerAvatarUpload = () => {
    profileFileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 600;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setProfileAvatar(dataUrl);
        } else {
          setProfileAvatar(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Sync profile state when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfileAvatar(currentUser.avatar || "");
      setProfileBio(currentUser.bio || "");
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setProfileLoading(true);
    setProfileSuccess("");
    try {
      const updated = await updateStaffProfile(currentUser.email, {
        name: profileName || currentUser.name,
        avatar: profileAvatar,
        bio: profileBio
      });
      if (updated) {
        setCurrentUser(updated);
        sessionStorage.setItem("nexlify_admin_session", JSON.stringify(updated));
        setStaffList(prev => prev.map(s => s.email.toLowerCase() === updated.email.toLowerCase() ? updated : s));
        setProfileSuccess("Your staff profile picture and details have been updated successfully!");
        setTimeout(() => setProfileSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Error updating staff profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Security & Password Change state
  const [changePasswordNew, setChangePasswordNew] = useState("");
  const [changePasswordConfirm, setChangePasswordConfirm] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentUser) return;

    if (!changePasswordNew || changePasswordNew.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (changePasswordNew !== changePasswordConfirm) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const ok = await updateStaffPassword(currentUser.email, changePasswordNew);
      if (ok) {
        setPasswordSuccess("Your staff access password has been updated successfully!");
        setChangePasswordNew("");
        setChangePasswordConfirm("");
        setTimeout(() => setPasswordSuccess(""), 4000);
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred while changing password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Admin Reset Staff Password state & handler
  const [resetStaffModalEmail, setResetStaffModalEmail] = useState<string | null>(null);
  const [resetStaffNewPass, setResetStaffNewPass] = useState("");
  const [resetStaffSuccessMsg, setResetStaffSuccessMsg] = useState("");
  const [resetStaffErrorMsg, setResetStaffErrorMsg] = useState("");

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetStaffModalEmail) return;
    setResetStaffErrorMsg("");
    setResetStaffSuccessMsg("");

    if (resetStaffNewPass.length < 6) {
      setResetStaffErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      await updateStaffPassword(resetStaffModalEmail, resetStaffNewPass);
      setResetStaffSuccessMsg(`Password successfully updated for ${resetStaffModalEmail}!`);
      setResetStaffNewPass("");
      setTimeout(() => {
        setResetStaffModalEmail(null);
        setResetStaffSuccessMsg("");
      }, 2000);
    } catch (err) {
      setResetStaffErrorMsg("Failed to reset staff password.");
    }
  };

  // Enforce permitted tab access based on user role
  useEffect(() => {
    if (currentUser) {
      const allTabs: Array<typeof activeTab> = [
        "overview", "bookings", "messages", "careers", 
        "insights_cms", "careers_cms", "training_cms", 
        "about_cms", "portfolio_cms", "services_cms", "staff", "my_profile"
      ];
      const permitted = allTabs.filter(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs));
      if (permitted.length > 0 && !permitted.includes(activeTab)) {
        setActiveTab(permitted[0]);
      }
    }
  }, [currentUser, activeTab]);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // CMS Lists state
  const [cmsServices, setCmsServices] = useState<Service[]>(() => getCachedServices());
  const [cmsProjects, setCmsProjects] = useState<Project[]>(() => getCachedProjects());
  const [cmsCourses, setCmsCourses] = useState<Course[]>(() => getCachedCourses());
  const [cmsBlogs, setCmsBlogs] = useState<BlogPost[]>(() => getCachedBlogs());
  const [cmsJobs, setCmsJobs] = useState<JobOpening[]>(() => getCachedJobs());
  const [cmsAboutPage, setCmsAboutPage] = useState<AboutPageData | null>(() => getCachedAboutPageData());
  const [cmsTeam, setCmsTeam] = useState<TeamMember[]>(() => getCachedTeamMembers());

  // Interaction Modal States
  const [editingBooking, setEditingBooking] = useState<Consultation | null>(null);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Delete Popup Confirmation Modal State
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    itemLabel?: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", onConfirm: () => {} });

  const triggerDeleteModal = (title: string, itemLabel: string, onConfirm: () => void) => {
    setDeleteConfirmState({
      isOpen: true,
      title,
      itemLabel,
      onConfirm
    });
  };

  // New Staff user form (Inside CEO tab)
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffUser["role"]>("Employee");
  const [newStaffError, setNewStaffError] = useState("");
  const [newStaffSuccess, setNewStaffSuccess] = useState("");
  const [newStaffLoading, setNewStaffLoading] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);

  // Admin Permission Guide & Roster State
  const [guideSelectedRole, setGuideSelectedRole] = useState<StaffUser["role"]>("Manager");
  const [guideViewMode, setGuideViewMode] = useState<"inspector" | "matrix">("inspector");
  const [expandedRosterEmails, setExpandedRosterEmails] = useState<string[]>([]);

  // CMS Form States
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Technology");
  const [blogImage, setBlogImage] = useState("");
  const [blogAuthorName, setBlogAuthorName] = useState("");
  const [blogAuthorRole, setBlogAuthorRole] = useState("");
  const [blogAuthorAvatar, setBlogAuthorAvatar] = useState("");
  const [showBlogForm, setShowBlogForm] = useState(false);

  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Engineering");
  const [jobType, setJobType] = useState("Full-time");
  const [jobLocation, setJobLocation] = useState("Remote");
  const [jobExp, setJobExp] = useState("Mid-level");
  const [jobSalary, setJobSalary] = useState("₦300k - ₦500k/mo");
  const [jobDesc, setJobDesc] = useState("");
  const [jobReqs, setJobReqs] = useState(""); // newline separated
  const [jobResps, setJobResps] = useState(""); // newline separated
  const [showJobForm, setShowJobForm] = useState(false);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseSyllabus, setCourseSyllabus] = useState(""); // newline separated
  const [courseCohort, setCourseCohort] = useState("");
  const [courseSpots, setCourseSpots] = useState(15);
  const [courseImage, setCourseImage] = useState("");
  const [courseTags, setCourseTags] = useState(""); // comma separated
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutStory, setAboutStory] = useState("");
  const [aboutDesc, setAboutDesc] = useState("");
  const [aboutVision, setAboutVision] = useState("");
  const [aboutMission, setAboutMission] = useState("");
  const [aboutFutureTitle, setAboutFutureTitle] = useState("");
  const [aboutFutureDesc, setAboutFutureDesc] = useState("");
  const [aboutFutureMetricCount, setAboutFutureMetricCount] = useState("");
  const [aboutFutureMetricTitle, setAboutFutureMetricTitle] = useState("");
  const [aboutFutureMetricSubtitle, setAboutFutureMetricSubtitle] = useState("");
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [showAboutForm, setShowAboutForm] = useState(false);

  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamImage, setTeamImage] = useState("");
  const [teamLinkedin, setTeamLinkedin] = useState("");
  const [teamTwitter, setTeamTwitter] = useState("");
  const [teamGithub, setTeamGithub] = useState("");
  const [showTeamForm, setShowTeamForm] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Websites");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectLongDesc, setProjectLongDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectTags, setProjectTags] = useState(""); // comma separated
  const [projectLink, setProjectLink] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceIcon, setServiceIcon] = useState("Cpu");
  const [serviceFeatures, setServiceFeatures] = useState(""); // newline separated
  const [serviceImage, setServiceImage] = useState("");
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Sync About state
  useEffect(() => {
    if (cmsAboutPage) {
      setAboutTitle(cmsAboutPage.title);
      setAboutStory(cmsAboutPage.story);
      setAboutDesc(cmsAboutPage.description);
      setAboutVision(cmsAboutPage.vision);
      setAboutMission(cmsAboutPage.mission);
      setAboutFutureTitle(cmsAboutPage.futureTitle);
      setAboutFutureDesc(cmsAboutPage.futureDesc);
      setAboutFutureMetricCount(cmsAboutPage.futureMetricCount);
      setAboutFutureMetricTitle(cmsAboutPage.futureMetricTitle);
      setAboutFutureMetricSubtitle(cmsAboutPage.futureMetricSubtitle);
    }
  }, [cmsAboutPage]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("nexlify_admin_theme", theme);
  }, [theme]);

  // Check login on mount
  useEffect(() => {
    const session = sessionStorage.getItem("nexlify_admin_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed && parsed.role) {
          setCurrentUser(parsed);
        } else {
          sessionStorage.removeItem("nexlify_admin_session");
          setCurrentUser(null);
        }
      } catch {
        sessionStorage.removeItem("nexlify_admin_session");
      }
    }
    setDbStatus(isFirebaseConnected());
  }, []);

  // Enforce single active session per account across devices and browser tabs
  useEffect(() => {
    if (!currentUser || !currentUser.activeSessionToken) return;

    // 1. Storage listener for instant cross-tab session change detection
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nexlify_staff_active_sessions" && currentUser?.activeSessionToken) {
        try {
          const map = JSON.parse(e.newValue || "{}");
          const latestToken = map[currentUser.email.toLowerCase()];
          if (latestToken && latestToken !== currentUser.activeSessionToken) {
            sessionStorage.removeItem("nexlify_admin_session");
            setCurrentUser(null);
            setAuthError("Session Terminated: This account was signed in on another device or tab. Simultaneous logins are restricted for security.");
          }
        } catch (err) {
          console.error("Storage event error:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 2. Periodic background verification check
    const intervalId = setInterval(async () => {
      if (currentUser?.email && currentUser?.activeSessionToken) {
        const isValid = await verifyActiveSession(currentUser.email, currentUser.activeSessionToken);
        if (!isValid) {
          sessionStorage.removeItem("nexlify_admin_session");
          setCurrentUser(null);
          setAuthError("Session Terminated: This account was signed in on another device or browser. Simultaneous logins are restricted for security.");
        }
      }
    }, 4000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentUser]);

  // Fetch dashboard data (unseen background synchronization)
  const loadDashboardData = async () => {
    if (!currentUser) return;
    try {
      const [
        consList, 
        msgsList, 
        appsList, 
        staffRes,
        srvList,
        prjList,
        crsList,
        blgList,
        jobList,
        abtRes,
        tmList
      ] = await Promise.all([
        getConsultations(),
        getContactMessages(),
        getJobApplications(),
        getStaffUsers(),
        getServices(),
        getProjects(),
        getCourses(),
        getBlogs(),
        getJobs(),
        getAboutPageData(),
        getTeamMembers()
      ]);
      setConsultations(consList);
      setMessages(msgsList);
      setApplications(appsList);
      setStaffList(staffRes);
      setCmsServices(srvList);
      setCmsProjects(prjList);
      setCmsCourses(crsList);
      setCmsBlogs(blgList);
      setCmsJobs(jobList);
      setCmsAboutPage(abtRes);
      setCmsTeam(tmList);
    } catch (e) {
      console.error("Error loading dashboard metrics:", e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  useEffect(() => {
    const handlePermissionsUpdated = () => {
      getStaffUsers().then(latestList => {
        if (latestList && latestList.length > 0) {
          setStaffList(latestList);
          if (currentUser) {
            const updatedSelf = latestList.find(s => s.email.toLowerCase() === currentUser.email.toLowerCase());
            if (updatedSelf) {
              setCurrentUser(updatedSelf);
              sessionStorage.setItem("nexlify_admin_session", JSON.stringify(updatedSelf));
            }
          }
        }
      });
    };

    window.addEventListener("storage", handlePermissionsUpdated);
    window.addEventListener("nexlify_permissions_updated", handlePermissionsUpdated);
    return () => {
      window.removeEventListener("storage", handlePermissionsUpdated);
      window.removeEventListener("nexlify_permissions_updated", handlePermissionsUpdated);
    };
  }, [currentUser]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const result = await loginStaffUser(authEmail, authPassword);
      if (typeof result === "string") {
        setAuthError(result);
      } else {
        const permittedTabs = ALL_SYSTEM_MODULES.filter(m => isTabPermitted(m.id, result.role, result.allowedTabs));
        if (permittedTabs.length === 0 && result.role === "Employee") {
          setAuthError("Access Denied: Your employee account has no active page permissions assigned by the CEO.");
        } else {
          setCurrentUser(result);
          sessionStorage.setItem("nexlify_admin_session", JSON.stringify(result));
        }
      }
    } catch (err) {
      setAuthError("An unexpected system exception occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const result = await registerStaffUser(authEmail, authPassword, authName, authRole);
      if (typeof result === "string") {
        setAuthError(result);
      } else {
        setCurrentUser(result);
        sessionStorage.setItem("nexlify_admin_session", JSON.stringify(result));
      }
    } catch (err) {
      setAuthError("An unexpected system registration exception occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("nexlify_admin_session");
    setActiveTab("bookings");
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  // Action: Update Consultation Status
  const handleUpdateConsultation = async (id: string, status: Consultation["status"]) => {
    try {
      const ok = await updateConsultationStatus(id, status);
      if (ok) {
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Delete Consultation (CEO ONLY)
  const handleDeleteConsultation = async (id: string) => {
    if (currentUser?.role !== "CEO") return;
    const booking = consultations.find(c => c.id === id);
    triggerDeleteModal(
      "Are you sure you want to permanently delete this booking request?",
      booking ? `${booking.name} — ${booking.service || 'Consultation'}` : id,
      async () => {
        try {
          const ok = await deleteConsultation(id);
          if (ok) {
            setConsultations(prev => prev.filter(c => c.id !== id));
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  // Action: Save Booking Note
  const handleSaveBookingNote = async () => {
    if (!editingBooking) return;
    setSavingNote(true);
    try {
      const ok = await updateConsultationStatus(editingBooking.id, editingBooking.status, noteText);
      if (ok) {
        setConsultations(prev => prev.map(c => c.id === editingBooking.id ? { ...c, staffNotes: noteText } : c));
        setEditingBooking(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  // Action: Mark Message Read/Unread
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const ok = await updateContactMessageStatus(id, !currentRead);
      if (ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !currentRead } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Save Message Note
  const handleSaveMessageNote = async () => {
    if (!editingMessage) return;
    setSavingNote(true);
    try {
      const ok = await updateContactMessageStatus(editingMessage.id, editingMessage.read, noteText);
      if (ok) {
        setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, staffNotes: noteText } : m));
        setEditingMessage(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  // Action: Delete Contact Message (CEO ONLY)
  const handleDeleteMessage = async (id: string) => {
    if (currentUser?.role !== "CEO") return;
    const msg = messages.find(m => m.id === id);
    triggerDeleteModal(
      "Are you sure you want to permanently delete this contact record?",
      msg ? `${msg.name} (${msg.email})` : id,
      async () => {
        try {
          const ok = await deleteContactMessage(id);
          if (ok) {
            setMessages(prev => prev.filter(m => m.id !== id));
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  // Action: Update Job Application Status
  const handleUpdateAppStatus = async (id: string, status: JobApplication["status"]) => {
    try {
      const ok = await updateJobApplicationStatus(id, status);
      if (ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Delete Job Application (CEO ONLY)
  const handleDeleteApplication = async (id: string) => {
    if (currentUser?.role !== "CEO") return;
    const app = applications.find(a => a.id === id);
    triggerDeleteModal(
      "Are you sure you want to permanently delete this application?",
      app ? `${app.fullName} — ${app.roleApplied}` : id,
      async () => {
        try {
          const ok = await deleteJobApplication(id);
          if (ok) {
            setApplications(prev => prev.filter(a => a.id !== id));
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  // Action: Update Staff Role (CEO ONLY)
  const handleUpdateStaffRole = async (email: string, targetRole: StaffUser["role"]) => {
    if (currentUser?.role !== "CEO") return;
    if (email.toLowerCase() === currentUser.email.toLowerCase()) {
      alert("You cannot modify your own role directly. Safety protection active.");
      return;
    }
    const defaultNewTabs = getDefaultTabsForRole(targetRole);
    setStaffList(prev => prev.map(s => s.email.toLowerCase() === email.toLowerCase() ? { ...s, role: targetRole, allowedTabs: defaultNewTabs } : s));
    try {
      await updateStaffRole(email, targetRole);
      await updateStaffPermissions(email, defaultNewTabs);
      window.dispatchEvent(new Event("nexlify_permissions_updated"));
    } catch (e) {
      console.error("Error updating staff role:", e);
    }
  };

  // Helper: Check if current logged in user has Admin / Manager governance privileges
  const canManageStaffPermissions = Boolean(
    currentUser?.role === "CEO" || 
    currentUser?.role === "Manager" || 
    isTabPermitted("staff", currentUser?.role || "", currentUser?.allowedTabs)
  );

  // Action: Toggle Staff Module Permission (Admin)
  const handleToggleStaffPermission = async (staffEmail: string, tabId: string) => {
    if (!canManageStaffPermissions) return;
    const staffObj = staffList.find(s => s.email.toLowerCase() === staffEmail.toLowerCase());
    if (!staffObj) return;

    const currentTabs = staffObj.allowedTabs ? [...staffObj.allowedTabs] : getDefaultTabsForRole(staffObj.role);
    const isCurrentlyAllowed = isTabPermitted(tabId, staffObj.role, staffObj.allowedTabs);

    let updatedTabs: string[];
    if (isCurrentlyAllowed) {
      updatedTabs = currentTabs.filter(id => id !== tabId);
    } else {
      updatedTabs = Array.from(new Set([...currentTabs, tabId]));
    }

    // Immediate optimistic update for zero UI lag
    setStaffList(prev => prev.map(s => s.email.toLowerCase() === staffEmail.toLowerCase() ? { ...s, allowedTabs: updatedTabs } : s));
    if (currentUser && staffEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      const updatedSelf = { ...currentUser, allowedTabs: updatedTabs };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem("nexlify_admin_session", JSON.stringify(updatedSelf));
    }

    try {
      await updateStaffPermissions(staffEmail, updatedTabs);
      window.dispatchEvent(new Event("nexlify_permissions_updated"));
    } catch (e) {
      console.error("Error toggling staff permission:", e);
    }
  };

  // Action: Grant All Page Access to Staff Member (Admin)
  const handleGrantAllStaffPermissions = async (staffEmail: string) => {
    if (!canManageStaffPermissions) return;
    const staffObj = staffList.find(s => s.email.toLowerCase() === staffEmail.toLowerCase());
    if (!staffObj) return;

    const allTabs = Array.from(new Set([...ALL_SYSTEM_MODULES.map(m => m.id), "my_profile"]));

    setStaffList(prev => prev.map(s => s.email.toLowerCase() === staffEmail.toLowerCase() ? { ...s, allowedTabs: allTabs } : s));
    if (currentUser && staffEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      const updatedSelf = { ...currentUser, allowedTabs: allTabs };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem("nexlify_admin_session", JSON.stringify(updatedSelf));
    }

    try {
      await updateStaffPermissions(staffEmail, allTabs);
      window.dispatchEvent(new Event("nexlify_permissions_updated"));
    } catch (e) {
      console.error("Error granting all permissions:", e);
    }
  };

  // Action: Reset Staff Permissions to Role Defaults (Admin)
  const handleResetStaffPermissions = async (staffEmail: string) => {
    if (!canManageStaffPermissions) return;
    const staffObj = staffList.find(s => s.email.toLowerCase() === staffEmail.toLowerCase());
    if (!staffObj) return;

    const defaultTabs = getDefaultTabsForRole(staffObj.role);

    setStaffList(prev => prev.map(s => s.email.toLowerCase() === staffEmail.toLowerCase() ? { ...s, allowedTabs: defaultTabs } : s));
    if (currentUser && staffEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      const updatedSelf = { ...currentUser, allowedTabs: defaultTabs };
      setCurrentUser(updatedSelf);
      sessionStorage.setItem("nexlify_admin_session", JSON.stringify(updatedSelf));
    }

    try {
      await updateStaffPermissions(staffEmail, defaultTabs);
      window.dispatchEvent(new Event("nexlify_permissions_updated"));
    } catch (e) {
      console.error("Error resetting staff permissions:", e);
    }
  };

  // Action: Delete Staff User (CEO ONLY)
  const handleDeleteStaffUser = async (email: string) => {
    if (currentUser?.role !== "CEO") return;
    if (email.toLowerCase() === currentUser.email.toLowerCase()) {
      alert("You cannot delete your own account directly.");
      return;
    }
    const staff = staffList.find(s => s.email.toLowerCase() === email.toLowerCase());
    triggerDeleteModal(
      "Are you sure you want to permanently delete this staff user account?",
      staff ? `${staff.name} (${staff.email})` : email,
      async () => {
        try {
          const ok = await deleteStaffUser(email);
          if (ok) {
            setStaffList(prev => prev.filter(s => s.email.toLowerCase() !== email.toLowerCase()));
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  // Action: Provision New Staff member (CEO ONLY)
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewStaffError("");
    setNewStaffSuccess("");
    
    if (!newStaffName || !newStaffEmail || !newStaffPassword) {
      setNewStaffError("Please fill out all administrative credentials.");
      return;
    }
    
    setNewStaffLoading(true);
    try {
      const res = await registerStaffUser(newStaffEmail, newStaffPassword, newStaffName, newStaffRole);
      if (typeof res === "string") {
        setNewStaffError(res);
      } else {
        setNewStaffSuccess(`Successfully provisioned ${newStaffName} as a registered ${newStaffRole}!`);
        setNewStaffName("");
        setNewStaffEmail("");
        setNewStaffPassword("");
        setNewStaffRole("Employee");
        // Reload staff list
        const latestStaff = await getStaffUsers();
        setStaffList(latestStaff);
        setShowStaffForm(false);
      }
    } catch (err) {
      setNewStaffError("Failed to register user.");
    } finally {
      setNewStaffLoading(false);
    }
  };

  // ==================== CMS EVENT HANDLERS ====================

  // 1. Service handlers
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle) return;
    const serviceObj: Service = {
      id: editingService ? editingService.id : `srv-${Math.random().toString(36).substring(2, 9)}`,
      title: serviceTitle,
      description: serviceDesc || `${serviceTitle} engineering service & solution.`,
      icon: serviceIcon || "Cpu",
      features: serviceFeatures ? serviceFeatures.split("\n").map(f => f.trim()).filter(f => f.length > 0) : [],
      longDescription: serviceDesc || `${serviceTitle} engineering service & solution.`,
      benefits: ["Highly Reliable", "Secure By Design"],
      technologies: ["React", "TypeScript", "Node.js"],
      timeline: "2-4 Weeks",
      faq: [
        { q: "What is the cost?", a: "Contact us for custom pricing plans based on project parameters." }
      ],
      image: serviceImage || (editingService ? editingService.image : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"),
      variant: "primary"
    };
    try {
      await saveService(serviceObj);
      setCmsServices(prev => {
        const idx = prev.findIndex(s => s.id === serviceObj.id);
        if (idx !== -1) return prev.map(s => s.id === serviceObj.id ? serviceObj : s);
        return [...prev, serviceObj];
      });
      // Reset form
      setEditingService(null);
      setServiceTitle("");
      setServiceDesc("");
      setServiceIcon("Cpu");
      setServiceFeatures("");
      setServiceImage("");
      setShowServiceForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    const s = cmsServices.find(item => item.id === id);
    triggerDeleteModal(
      "Are you sure you want to delete this service from the live platform?",
      s ? s.title : id,
      async () => {
        try {
          await deleteService(id);
          setCmsServices(prev => prev.filter(item => item.id !== id));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 2. Project / Portfolio handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle) return;

    // Enforce category based on role
    let finalCategory = projectCategory;
    if (currentUser?.role === "Designer") {
      finalCategory = "Graphic Designs";
    } else if (currentUser?.role === "Developer") {
      finalCategory = "Websites";
    }

    const projectObj: Project = {
      id: editingProject ? editingProject.id : `prj-${Math.random().toString(36).substring(2, 9)}`,
      title: projectTitle,
      client: "Nexlify Client",
      category: finalCategory,
      image: projectImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      problem: projectDesc || projectTitle,
      solution: projectLongDesc || projectDesc || projectTitle,
      tech: projectTags ? projectTags.split(",").map(t => t.trim()).filter(t => t.length > 0) : [],
      timeline: "3 Months",
      outcome: "Successfully published.",
      createdAt: editingProject ? (editingProject.createdAt || Date.now()) : Date.now(),
      feedback: {
        quote: "Working with Nexlify was a game changer for our operations.",
        author: "Client",
        role: "Stakeholder"
      }
    };
    try {
      await saveProject(projectObj);
      setCmsProjects(prev => {
        const idx = prev.findIndex(p => p.id === projectObj.id);
        if (idx !== -1) return prev.map(p => p.id === projectObj.id ? projectObj : p);
        return [projectObj, ...prev];
      });
      // Reset
      setEditingProject(null);
      setProjectTitle("");
      setProjectCategory(
        currentUser?.role === "Designer"
          ? "Graphic Designs"
          : currentUser?.role === "Developer"
            ? "Websites"
            : "Websites"
      );
      setProjectDesc("");
      setProjectLongDesc("");
      setProjectImage("");
      setProjectTags("");
      setProjectLink("");
      setShowProjectForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const p = cmsProjects.find(item => item.id === id);
    triggerDeleteModal(
      "Are you sure you want to delete this portfolio project?",
      p ? p.title : id,
      async () => {
        try {
          await deleteProject(id);
          setCmsProjects(prev => prev.filter(item => item.id !== id));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 3. Training / Course handlers
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;
    const courseObj: Course = {
      id: editingCourse ? editingCourse.id : `crs-${Math.random().toString(36).substring(2, 9)}`,
      title: courseTitle,
      price: coursePrice || "Free / Inquiry",
      duration: courseDuration || "Self-Paced",
      variant: "primary",
      features: courseSyllabus ? courseSyllabus.split("\n").map(s => s.trim()).filter(s => s.length > 0) : [],
      requirements: courseTags ? courseTags.split(",").map(t => t.trim()).filter(t => t.length > 0) : [],
      mentors: ["Nexlify Engineering Lead"]
    };
    try {
      await saveCourse(courseObj);
      setCmsCourses(prev => {
        const idx = prev.findIndex(c => c.id === courseObj.id);
        if (idx !== -1) return prev.map(c => c.id === courseObj.id ? courseObj : c);
        return [...prev, courseObj];
      });
      // Reset
      setEditingCourse(null);
      setCourseTitle("");
      setCourseDuration("");
      setCourseLevel("Beginner");
      setCoursePrice("");
      setCourseDesc("");
      setCourseSyllabus("");
      setCourseCohort("");
      setCourseSpots(15);
      setCourseImage("");
      setCourseTags("");
      setShowCourseForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const c = cmsCourses.find(item => item.id === id);
    triggerDeleteModal(
      "Are you sure you want to delete this training course?",
      c ? c.title : id,
      async () => {
        try {
          await deleteCourse(id);
          setCmsCourses(prev => prev.filter(item => item.id !== id));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 4. Insights / Blog handlers
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle) return;

    // Author details are automatically set from logged-in staff member's profile
    const authorImage = currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
    const authorName = currentUser?.name || "Nexlify Admin";
    const authorRole = currentUser?.role || "Administrator";

    const blogObj: BlogPost = {
      id: editingBlog ? editingBlog.id : `blog-${Math.random().toString(36).substring(2, 9)}`,
      title: blogTitle,
      excerpt: blogExcerpt || (blogContent ? blogContent.substring(0, 150) + "..." : blogTitle),
      content: blogContent || blogExcerpt || blogTitle,
      category: blogCategory,
      date: editingBlog ? editingBlog.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: blogImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      author: {
        name: authorName,
        role: authorRole,
        image: authorImage
      }
    };
    try {
      await saveBlog(blogObj);
      setCmsBlogs(prev => {
        const idx = prev.findIndex(b => b.id === blogObj.id);
        if (idx !== -1) return prev.map(b => b.id === blogObj.id ? blogObj : b);
        return [...prev, blogObj];
      });
      // Reset
      setEditingBlog(null);
      setBlogTitle("");
      setBlogExcerpt("");
      setBlogContent("");
      setBlogCategory("Technology");
      setBlogImage("");
      setShowBlogForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    const b = cmsBlogs.find(item => item.id === id);
    triggerDeleteModal(
      "Are you sure you want to delete this blog post?",
      b ? b.title : id,
      async () => {
        try {
          await deleteBlog(id);
          setCmsBlogs(prev => prev.filter(item => item.id !== id));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 5. Job / Careers handlers
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;
    const jobObj: JobOpening = {
      id: editingJob ? editingJob.id : `job-${Math.random().toString(36).substring(2, 9)}`,
      title: jobTitle,
      department: jobDept,
      location: jobLocation || "Remote",
      type: jobType || "Full-time",
      description: jobDesc ? `${jobDesc}\n\nExperience Required: ${jobExp}\nOffered Salary: ${jobSalary}` : `Career opening for ${jobTitle}.`,
      requirements: jobReqs ? jobReqs.split("\n").map(r => r.trim()).filter(r => r.length > 0) : [],
      benefits: jobResps ? jobResps.split("\n").map(r => r.trim()).filter(r => r.length > 0) : []
    };
    try {
      await saveJob(jobObj);
      setCmsJobs(prev => {
        const idx = prev.findIndex(j => j.id === jobObj.id);
        if (idx !== -1) return prev.map(j => j.id === jobObj.id ? jobObj : j);
        return [...prev, jobObj];
      });
      // Reset
      setEditingJob(null);
      setJobTitle("");
      setJobDept("Engineering");
      setJobType("Full-time");
      setJobLocation("Remote");
      setJobExp("Mid-level");
      setJobSalary("₦300k - ₦500k/mo");
      setJobDesc("");
      setJobReqs("");
      setJobResps("");
      setShowJobForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    const j = cmsJobs.find(item => item.id === id);
    triggerDeleteModal(
      "Are you sure you want to delete this job career opening?",
      j ? j.title : id,
      async () => {
        try {
          await deleteJob(id);
          setCmsJobs(prev => prev.filter(item => item.id !== id));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 6. About Info & Team member handlers
  const handleSaveAboutPageInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAbout(true);
    const updatedAbout: AboutPageData = {
      title: aboutTitle,
      story: aboutStory,
      description: aboutDesc,
      vision: aboutVision,
      mission: aboutMission,
      futureTitle: aboutFutureTitle,
      futureDesc: aboutFutureDesc,
      futureMetricCount: aboutFutureMetricCount,
      futureMetricTitle: aboutFutureMetricTitle,
      futureMetricSubtitle: aboutFutureMetricSubtitle
    };
    try {
      await saveAboutPageData(updatedAbout);
      setCmsAboutPage(updatedAbout);
      setShowAboutForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleSaveTeamMemberObj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    const socialsObj: { linkedin?: string; twitter?: string; github?: string } = {};
    if (teamLinkedin.trim()) socialsObj.linkedin = teamLinkedin.trim();
    if (teamTwitter.trim()) socialsObj.twitter = teamTwitter.trim();
    if (teamGithub.trim()) socialsObj.github = teamGithub.trim();

    const teamObj: TeamMember = {
      name: teamName,
      role: teamRole || "Team Member",
      bio: teamBio || "",
      image: teamImage || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
      socials: socialsObj
    };
    try {
      await saveTeamMember(teamObj);
      setCmsTeam(prev => {
        const idx = prev.findIndex(t => t.name.toLowerCase() === teamObj.name.toLowerCase());
        if (idx !== -1) return prev.map(t => t.name.toLowerCase() === teamObj.name.toLowerCase() ? teamObj : t);
        return [...prev, teamObj];
      });
      // Reset
      setEditingTeam(null);
      setTeamName("");
      setTeamRole("");
      setTeamBio("");
      setTeamImage("");
      setTeamLinkedin("");
      setTeamTwitter("");
      setTeamGithub("");
      setShowTeamForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeamMemberObj = async (name: string) => {
    triggerDeleteModal(
      "Are you sure you want to remove this team member from the About Page?",
      `Team Member: ${name}`,
      async () => {
        try {
          await deleteTeamMember(name);
          setCmsTeam(prev => prev.filter(t => t.name.toLowerCase() !== name.toLowerCase()));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // Filtering lists based on search and filters
  const getFilteredConsultations = () => {
    return consultations.filter(c => {
      const matchSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchFilter = statusFilter === "ALL" || c.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchFilter;
    });
  };

  const getFilteredMessages = () => {
    return messages.filter(m => {
      const matchSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchFilter = 
        statusFilter === "ALL" || 
        (statusFilter === "UNREAD" && !m.read) || 
        (statusFilter === "READ" && m.read);
      return matchSearch && matchFilter;
    });
  };

  const getFilteredApplications = () => {
    return applications.filter(a => {
      const matchSearch = 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.note.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchFilter = statusFilter === "ALL" || a.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchFilter;
    });
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === "light" ? "bg-slate-50 text-slate-800" : "bg-zinc-950 text-zinc-100"
    }`}>
      
      {!currentUser ? (
        /* ==================== LOGIN / PORTAL ACCESSIBILITY ==================== */
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-md w-full mx-auto relative z-10">
            {/* Quick header inside Login */}
            <div className="text-center mb-6">
              {setView && (
                <button
                  onClick={() => setView("home")}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-4 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    theme === "light" 
                      ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-600 shadow-sm" 
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-zinc-400"
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Main Site
                </button>
              )}
              
              <div className="flex justify-center gap-2 mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                  theme === "light" ? "bg-slate-200/50 border-slate-300" : "bg-zinc-900 border-zinc-880"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "light" ? "text-slate-500" : "text-zinc-400"}`}>
                    Secure Staff Area
                  </span>
                </div>
                
                {/* Theme toggle directly on login page */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-1.5 px-2.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    theme === "light" ? "bg-white border-slate-300 text-amber-500 shadow-sm" : "bg-zinc-900 border-zinc-800 text-indigo-400"
                  }`}
                  title="Toggle Visual Theme"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>
              <h1 className={`text-3xl font-black tracking-tight mb-2 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                Nexlify <span className="text-brand-primary">Portal</span>
              </h1>
              <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                Administrative access center for core developers, coordinators, and directors.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 sm:p-8 rounded-[2rem] border transition-all shadow-2xl relative overflow-hidden ${
                theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/40 border-zinc-900"
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                <Lock className="w-4 h-4 text-brand-primary" /> {isRegistering ? "Register Admin Account" : "Administrative Authentication"}
              </h3>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-medium mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {isRegistering ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className={`font-bold text-sm ${theme === "light" ? "text-slate-900" : "text-white"}`}>Self-Registration Deactivated</h4>
                  <p className={`text-[11px] leading-relaxed max-w-xs mx-auto ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                    To maintain security integrity, public self-registration has been disabled. Administrative accounts must be created and assigned access roles directly by the CEO inside the Secure Staff Roster.
                  </p>
                  <p className={`text-[10px] font-bold text-zinc-500 ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>
                    Please contact your system CEO to request a provisioned administrator account.
                  </p>
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setAuthError("");
                    }}
                    className={`w-full py-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer mt-2 ${
                      theme === "light"
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        : "bg-zinc-950 hover:bg-zinc-850 border-zinc-850 text-zinc-300"
                    }`}
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Official Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        required
                        placeholder="example@nexlify.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none transition-all ${
                          theme === "light" 
                            ? "bg-slate-50 border-slate-200 text-slate-950 placeholder-slate-400" 
                            : "bg-zinc-950 border-zinc-850 text-white placeholder-zinc-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Security Access Key (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all ${
                          theme === "light" 
                            ? "bg-slate-50 border-slate-200 text-slate-950" 
                            : "bg-zinc-950 border-zinc-850 text-white"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-brand-primary/15 transition-all cursor-pointer"
                  >
                    {authLoading ? (
                      <>Authenticating <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Access Console <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}

              {!isRegistering && (
                <div className={`mt-6 pt-4 border-t flex justify-between items-center text-[11px] font-medium ${
                  theme === "light" ? "border-slate-150 text-slate-500" : "border-zinc-850/60 text-zinc-500"
                }`}>
                  <span>
                    Need an account?
                  </span>
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setAuthError("");
                    }}
                    className="text-brand-primary hover:underline font-bold cursor-pointer"
                  >
                    Register new Staff Profile
                  </button>
                </div>
              )}
            </motion.div>


          </div>
        </div>
      ) : (
        /* ==================== ACTIVE ADMIN CONSOLE (SIDEBAR + CONTENT LAYOUT) ==================== */
        <div className="flex min-h-screen">
          
          {/* DESKTOP SIDEBAR MENU (Fixed on left) */}
          <aside className={`hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 border-r z-30 transition-all duration-300 ${
            theme === "light" ? "bg-white/95 border-slate-200/80 text-slate-800 shadow-sm" : "bg-zinc-950/95 border-zinc-900 text-zinc-100 shadow-2xl"
          } backdrop-blur-xl`}>
            {/* Pro Header Branding */}
            <div className="p-5 border-b border-inherit">
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                theme === "light" 
                  ? "bg-slate-50/90 border-slate-200/80 shadow-sm" 
                  : "bg-zinc-900/50 border-zinc-850/90 shadow-inner"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-brand-primary/30 shadow-md shrink-0">
                    <img src="https://iili.io/Bp0LZ3Q.jpg" alt="Nexlify Logo" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-display font-black text-sm tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                        Nexlify
                      </span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-gradient-to-r from-brand-primary to-indigo-600 text-white rounded-md uppercase tracking-widest shadow-xs">
                        ADMIN
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-brand-primary tracking-wider block mt-0.5">
                      Admin Console
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-grow p-3 space-y-4 overflow-y-auto custom-scrollbar">
              {["overview", "bookings", "messages", "careers"].some(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs)) && (
                <div className="space-y-1">
                  <div className="px-2.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                    <span>Executive Hub</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  </div>

                  {[
                    { id: "overview", icon: LayoutDashboard, label: "Overview Page" },
                    { id: "bookings", icon: Calendar, label: "Bookings", count: consultations.length },
                    { id: "messages", icon: MessageSquare, label: "Inbox Messages", count: messages.filter(m => !m.read).length, countBadge: true },
                    { id: "careers", icon: Users, label: "Job Applicants", count: applications.filter(a => a.status === "Reviewing").length, countBadge: true }
                  ].filter(tab => isTabPermitted(tab.id, currentUser.role, currentUser.allowedTabs)).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setSearchTerm("");
                          setStatusFilter("ALL");
                        }}
                        className={`group relative w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left font-bold text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent border-brand-primary/40 text-brand-primary shadow-xs font-extrabold translate-x-0.5"
                            : theme === "light"
                              ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full shadow-sm shadow-brand-primary" />
                        )}
                        <div className="flex items-center gap-2 pl-0.5">
                          <tab.icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400 group-hover:text-slate-700" : "text-zinc-500 group-hover:text-zinc-300"
                          }`} />
                          <span className="truncate">{tab.label}</span>
                        </div>

                        {tab.count !== undefined && tab.count > 0 && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black tracking-tight shrink-0 ${
                            isActive 
                              ? "bg-brand-primary text-white shadow-xs" 
                              : tab.countBadge 
                                ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30 animate-pulse" 
                                : theme === "light"
                                  ? "bg-slate-100 text-slate-700 border border-slate-200"
                                  : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {["insights_cms", "careers_cms", "training_cms", "about_cms", "portfolio_cms", "services_cms"].some(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs)) && (
                <div className="space-y-1">
                  <div className="px-2.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                    <span>Content & Publishing</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                  </div>

                  {[
                    { id: "insights_cms", icon: BookOpen, label: "Publish Insights" },
                    { id: "careers_cms", icon: Briefcase, label: "Publish Careers" },
                    { id: "training_cms", icon: GraduationCap, label: "Edit Training" },
                    { id: "about_cms", icon: Info, label: "Update About Page" },
                    { id: "portfolio_cms", icon: Layout, label: "Update Portfolio" },
                    { id: "services_cms", icon: Layers, label: "Update Services" }
                  ].filter(tab => isTabPermitted(tab.id, currentUser.role, currentUser.allowedTabs)).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setSearchTerm("");
                          setStatusFilter("ALL");
                        }}
                        className={`group relative w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left font-bold text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent border-brand-primary/40 text-brand-primary shadow-xs font-extrabold translate-x-0.5"
                            : theme === "light"
                              ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full shadow-sm shadow-brand-primary" />
                        )}
                        <div className="flex items-center gap-2 pl-0.5">
                          <tab.icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400 group-hover:text-slate-700" : "text-zinc-500 group-hover:text-zinc-300"
                          }`} />
                          <span className="truncate">{tab.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {["staff", "my_profile"].some(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs)) && (
                <div className="space-y-1">
                  <div className="px-2.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                    <span>Account & System</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                  </div>

                  {[
                    { id: "my_profile", icon: UserCheck, label: "My Profile" },
                    { id: "staff", icon: Settings, label: "Security & Staff", locked: !isTabPermitted("staff", currentUser.role, currentUser.allowedTabs), labelBadge: "CEO" }
                  ].filter(tab => isTabPermitted(tab.id, currentUser.role, currentUser.allowedTabs)).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          if (tab.locked) {
                            alert("The Security & Staff section requires root CEO permissions. Safety block active.");
                            return;
                          }
                          setActiveTab(tab.id as any);
                          setSearchTerm("");
                          setStatusFilter("ALL");
                        }}
                        className={`group relative w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left font-bold text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent border-brand-primary/40 text-brand-primary shadow-xs font-extrabold translate-x-0.5"
                            : theme === "light"
                              ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full shadow-sm shadow-brand-primary" />
                        )}
                        <div className="flex items-center gap-2 pl-0.5">
                          <tab.icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400 group-hover:text-slate-700" : "text-zinc-500 group-hover:text-zinc-300"
                          }`} />
                          <span className="truncate">{tab.label}</span>
                        </div>

                        {tab.locked && (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest shrink-0">
                            {tab.labelBadge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {setView && (
                <div className="pt-1">
                  <button
                    onClick={() => setView("home")}
                    className={`group w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      theme === "light"
                        ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Main Site</span>
                  </button>
                </div>
              )}
            </nav>

            {/* Pro Sidebar Bottom Compact User Card */}
            <div className={`p-3 border-t transition-colors ${theme === "light" ? "border-slate-200 bg-slate-50/50" : "border-zinc-900 bg-zinc-950/80"}`}>
              <div className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-xs" : "bg-zinc-900/70 border-zinc-800/80"
              }`}>
                {/* User Info */}
                <button
                  type="button"
                  onClick={() => setActiveTab("my_profile")}
                  className="flex items-center gap-2 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer group"
                  title="View My Profile"
                >
                  <div className="relative shrink-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-lg object-cover border border-brand-primary/40 shadow-xs" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-indigo-500 flex items-center justify-center text-white font-black text-[10px] shadow-xs">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-zinc-950" />
                  </div>
                  <div className="truncate">
                    <span className={`text-[11px] font-bold block truncate group-hover:text-brand-primary transition-colors ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                      {currentUser.name}
                    </span>
                    <span className="text-[8px] font-black uppercase text-brand-primary tracking-widest block">
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {/* Right Quick Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      theme === "light" 
                        ? "bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200" 
                        : "bg-zinc-950 border-zinc-800 text-indigo-400 hover:bg-zinc-800"
                    }`}
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-red-500/20 cursor-pointer flex items-center justify-center"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN PANE (Displaced to the right on desktop) */}
          <div className="flex-grow lg:pl-72 flex flex-col min-h-screen">
            
            {/* TOP BAR / HEADER */}
            <header className={`px-6 py-3 border-b flex items-center justify-between transition-all duration-300 z-30 relative ${
              theme === "light" ? "bg-white border-slate-200" : "bg-zinc-950 border-zinc-900"
            }`}>
              {/* Left Title details */}
              <div className="flex items-center gap-3">
                {/* Mobile hamburger menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden p-2 rounded-xl border cursor-pointer ${
                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-zinc-900 border-zinc-850 text-zinc-300"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div>
                  <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                    Nexlify Admin <span className="text-brand-primary font-bold">Console</span>
                  </h2>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Workspace Management</p>
                </div>
              </div>

              {/* Right Utilities: Theme & Functional Notifications Bell */}
              <div className="flex items-center gap-3 relative">
                {/* Theme toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    theme === "light" ? "bg-slate-50 border-slate-200 text-amber-600 hover:bg-slate-100 shadow-xs" : "bg-zinc-900 border-zinc-800 text-indigo-400 hover:bg-zinc-850"
                  }`}
                  title="Toggle Visual Theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications Bell Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    showNotifications 
                      ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20" 
                      : theme === "light" 
                        ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                  }`}
                  aria-label="View Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-zinc-950 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                        theme === "light" 
                          ? "bg-white border-slate-200 text-slate-800" 
                          : "bg-zinc-950 border-zinc-800 text-zinc-100"
                      }`}
                    >
                      {/* Header */}
                      <div className={`p-3.5 border-b flex items-center justify-between ${
                        theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-900/60 border-zinc-850"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-brand-primary" />
                          <span className="text-xs font-black uppercase tracking-wider">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-brand-primary text-white">
                              {unreadCount} new
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {unreadCount > 0 && (
                            <button
                              onClick={() => {
                                setReadNotifIds(allNotifications.map(n => n.id));
                              }}
                              className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1 px-2 py-1 cursor-pointer"
                              title="Mark all as read"
                            >
                              <CheckCheck className="w-3 h-3" /> Mark read
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/40 custom-scrollbar">
                        {allNotifications.length === 0 ? (
                          <div className="p-8 text-center space-y-2">
                            <BellOff className="w-8 h-8 text-zinc-500 mx-auto opacity-60" />
                            <p className="text-xs font-bold text-zinc-400">All caught up!</p>
                            <p className="text-[10px] text-zinc-500">No new alerts or pending tasks requiring attention.</p>
                          </div>
                        ) : (
                          allNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setReadNotifIds((prev) => [...prev, notif.id]);
                                setActiveTab(notif.tab);
                                setShowNotifications(false);
                              }}
                              className={`p-3 text-left transition-all cursor-pointer flex items-start gap-3 hover:bg-brand-primary/5 ${
                                !notif.isRead 
                                  ? theme === "light" ? "bg-brand-primary/5" : "bg-brand-primary/10" 
                                  : "opacity-75"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                !notif.isRead ? "bg-brand-primary" : "bg-transparent"
                              }`} />
                              <div className="flex-grow min-w-0 space-y-0.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-xs font-bold truncate ${
                                    theme === "light" ? "text-slate-900" : "text-white"
                                  }`}>
                                    {notif.title}
                                  </span>
                                  <span className="text-[9px] font-bold text-zinc-500 shrink-0">
                                    {notif.time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 truncate">
                                  {notif.subtitle}
                                </p>
                                <span className="inline-block text-[8px] font-black uppercase tracking-widest text-brand-primary pt-0.5">
                                  Go to {notif.type}s →
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </header>

            {/* MOBILE SIDEBAR DRAWERS */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                  />
                  {/* Menu container */}
                  <motion.aside
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className={`fixed inset-y-0 left-0 w-72 z-50 flex flex-col lg:hidden border-r shadow-2xl transition-all duration-300 ${
                      theme === "light" ? "bg-white/95 border-slate-200 text-slate-800" : "bg-zinc-950/95 border-zinc-900 text-zinc-100"
                    } backdrop-blur-xl`}
                  >
                    {/* Drawer Header */}
                    <div className="p-5 border-b border-inherit flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-brand-primary/30 shadow-md shrink-0">
                          <img src="https://iili.io/Bp0LZ3Q.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-display font-black text-sm tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                              Nexlify
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-md uppercase tracking-wider">
                              ADMIN
                            </span>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider block">
                            Mobile Console
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Drawer middle content */}
                    <nav className="flex-grow p-3 space-y-4 overflow-y-auto custom-scrollbar">
                      {["overview", "bookings", "messages", "careers"].some(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs)) && (
                        <div className="space-y-1">
                          <div className="px-2.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                            <span>Executive Hub</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                          </div>

                          {[
                            { id: "overview", icon: LayoutDashboard, label: "Overview Page" },
                            { id: "bookings", icon: Calendar, label: "Bookings", count: consultations.length },
                            { id: "messages", icon: MessageSquare, label: "Inbox Messages", count: messages.filter(m => !m.read).length, countBadge: true },
                            { id: "careers", icon: Users, label: "Job Applicants", count: applications.filter(a => a.status === "Reviewing").length, countBadge: true }
                          ].filter(tab => isTabPermitted(tab.id, currentUser.role, currentUser.allowedTabs)).map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setActiveTab(tab.id as any);
                                  setSearchTerm("");
                                  setStatusFilter("ALL");
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`group relative w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left font-bold text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? "bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent border-brand-primary/40 text-brand-primary font-extrabold"
                                    : theme === "light"
                                      ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                                      : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                                }`}
                              >
                                {isActive && (
                                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full shadow-sm shadow-brand-primary" />
                                )}
                                <div className="flex items-center gap-2 pl-0.5">
                                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                                  <span className="truncate">{tab.label}</span>
                                </div>

                                {tab.count !== undefined && tab.count > 0 && (
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black tracking-tight shrink-0 ${
                                    isActive 
                                      ? "bg-brand-primary text-white shadow-xs" 
                                      : tab.countBadge 
                                        ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30 animate-pulse" 
                                        : theme === "light"
                                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                                          : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                                  }`}>
                                    {tab.count}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {["insights_cms", "careers_cms", "training_cms", "about_cms", "portfolio_cms", "services_cms"].some(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs)) && (
                        <div className="space-y-1">
                          <div className="px-2.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                            <span>Content & Publishing</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                          </div>

                          {[
                            { id: "insights_cms", icon: BookOpen, label: "Publish Insights" },
                            { id: "careers_cms", icon: Briefcase, label: "Publish Careers" },
                            { id: "training_cms", icon: GraduationCap, label: "Edit Training" },
                            { id: "about_cms", icon: Info, label: "Update About Page" },
                            { id: "portfolio_cms", icon: Layout, label: "Update Portfolio" },
                            { id: "services_cms", icon: Layers, label: "Update Services" }
                          ].filter(tab => isTabPermitted(tab.id, currentUser.role, currentUser.allowedTabs)).map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setActiveTab(tab.id as any);
                                  setSearchTerm("");
                                  setStatusFilter("ALL");
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`group relative w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left font-bold text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? "bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent border-brand-primary/40 text-brand-primary font-extrabold"
                                    : theme === "light"
                                      ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                                      : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                                }`}
                              >
                                {isActive && (
                                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full shadow-sm shadow-brand-primary" />
                                )}
                                <div className="flex items-center gap-2 pl-0.5">
                                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                                  <span className="truncate">{tab.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {["staff", "my_profile"].some(id => isTabPermitted(id, currentUser.role, currentUser.allowedTabs)) && (
                        <div className="space-y-1">
                          <div className="px-2.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                            <span>Account & System</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                          </div>

                          {[
                            { id: "my_profile", icon: UserCheck, label: "My Profile" },
                            { id: "staff", icon: Settings, label: "Security & Staff", locked: !isTabPermitted("staff", currentUser.role, currentUser.allowedTabs), labelBadge: "CEO" }
                          ].filter(tab => isTabPermitted(tab.id, currentUser.role, currentUser.allowedTabs)).map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  if (tab.locked) {
                                    alert("The Security & Staff section requires root CEO permissions. Safety block active.");
                                    return;
                                  }
                                  setActiveTab(tab.id as any);
                                  setSearchTerm("");
                                  setStatusFilter("ALL");
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`group relative w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left font-bold text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? "bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent border-brand-primary/40 text-brand-primary font-extrabold"
                                    : theme === "light"
                                      ? "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                                      : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                                }`}
                              >
                                {isActive && (
                                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full shadow-sm shadow-brand-primary" />
                                )}
                                <div className="flex items-center gap-2 pl-0.5">
                                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                                  <span className="truncate">{tab.label}</span>
                                </div>

                                {tab.locked && (
                                  <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest shrink-0">
                                    {tab.labelBadge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {setView && (
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              setView("home");
                              setIsMobileMenuOpen(false);
                            }}
                            className={`group w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              theme === "light"
                                ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                            }`}
                          >
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                            <span>Back to Main Site</span>
                          </button>
                        </div>
                      )}
                    </nav>

                    {/* Drawer bottom content */}
                    <div className={`p-3 border-t transition-colors ${theme === "light" ? "border-slate-200 bg-slate-50/50" : "border-zinc-900 bg-zinc-950/80"}`}>
                      <div className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                        theme === "light" ? "bg-white border-slate-200/80 shadow-xs" : "bg-zinc-900/70 border-zinc-800/80"
                      }`}>
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-indigo-500 flex items-center justify-center text-white font-black text-[10px] shadow-xs">
                              {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-zinc-950" />
                          </div>
                          <div className="truncate">
                            <span className={`text-[11px] font-bold block truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                              {currentUser.name}
                            </span>
                            <span className="text-[8px] font-black uppercase text-brand-primary tracking-widest block">
                              {currentUser.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              theme === "light" 
                                ? "bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200" 
                                : "bg-zinc-950 border-zinc-800 text-indigo-400 hover:bg-zinc-800"
                            }`}
                            title="Toggle Theme"
                          >
                            {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                          </button>

                          <button
                            onClick={handleLogout}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-red-500/20 cursor-pointer flex items-center justify-center"
                            title="Sign Out"
                          >
                            <LogOut className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* MAIN WORKSPACE WRAPPER (Scrollable core) */}
            <main className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto">
              
              {/* OVERVIEW PAGE CONTENT */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Executive Overview Header */}
                  <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
                    theme === "light" 
                      ? "bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border-slate-800 shadow-xl" 
                      : "bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white border-zinc-800/80 shadow-2xl"
                  }`}>
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest border border-brand-primary/30 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> System Overview
                          </span>
                          <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                            dbStatus 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {dbStatus ? "• DB Connected" : "• Local Mode"}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                          Welcome back, {currentUser.name}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1 max-w-xl font-medium leading-relaxed">
                          Central executive console summarizing consultation bookings, direct client inquiries, recruitment pipelines, and publishing metrics.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
                        <button
                          onClick={() => setActiveTab("bookings")}
                          className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs transition-all shadow-md shadow-brand-primary/20 cursor-pointer flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>View Bookings</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("messages")}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all backdrop-blur-md cursor-pointer flex items-center gap-2 border border-white/10"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Check Inbox</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ANALYTICS BENTO BOARD METRIC CONTAINERS */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className={`p-4 sm:p-5 border rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all ${
                      theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/40 border-zinc-850 shadow-xl"
                    }`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Bookings</span>
                        <Calendar className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div>
                        <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                          {consultations.length}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold block mt-1 uppercase tracking-wider">
                          {consultations.filter(c => c.status === "Pending").length} Pending approval
                        </span>
                      </div>
                    </div>

                    <div className={`p-4 sm:p-5 border rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all ${
                      theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/40 border-zinc-850 shadow-xl"
                    }`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-secondary/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Direct Messages</span>
                        <MessageSquare className="w-4 h-4 text-brand-secondary" />
                      </div>
                      <div>
                        <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                          {messages.length}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold block mt-1 uppercase tracking-wider">
                          {messages.filter(m => !m.read).length} Unread inquiries
                        </span>
                      </div>
                    </div>

                    <div className={`p-4 sm:p-5 border rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all ${
                      theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/40 border-zinc-850 shadow-xl"
                    }`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Job Applicants</span>
                        <Briefcase className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                          {applications.length}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold block mt-1 uppercase tracking-wider">
                          {applications.filter(a => a.status === "Shortlisted").length} Shortlisted devs
                        </span>
                      </div>
                    </div>

                    <div className={`p-4 sm:p-5 border rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all ${
                      theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/40 border-zinc-850 shadow-xl"
                    }`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conversion Rate</span>
                        <TrendingUp className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div>
                        <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                          {consultations.length > 0 
                            ? `${Math.round((consultations.filter(c => c.status === "Completed" || c.status === "Approved").length / consultations.length) * 100)}%`
                            : "0%"
                          }
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold block mt-1 uppercase tracking-wider">
                          Ratio of active clients
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* OVERVIEW RECENT ACTIVITY PANELS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings Panel */}
                    <div className={`p-6 border rounded-3xl space-y-4 ${
                      theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/40 border-zinc-850"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-brand-primary" />
                          <h3 className={`font-black text-sm tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Recent Consultation Requests</h3>
                        </div>
                        <button 
                          onClick={() => setActiveTab("bookings")}
                          className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {consultations.slice(0, 4).map((c) => (
                          <div key={c.id} className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 ${
                            theme === "light" ? "bg-slate-50/80 border-slate-200/60" : "bg-zinc-900/60 border-zinc-800/80"
                          }`}>
                            <div className="truncate min-w-0">
                              <span className={`font-bold text-xs block truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                {c.name}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-medium block truncate">
                                {c.service || "General Inquiry"} • {c.email}
                              </span>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              c.status === "Pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                              c.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                              "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                            }`}>
                              {c.status}
                            </span>
                          </div>
                        ))}
                        {consultations.length === 0 && (
                          <p className="text-xs text-zinc-500 italic py-6 text-center">No consultation requests recorded yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Latest Inbox Messages Panel */}
                    <div className={`p-6 border rounded-3xl space-y-4 ${
                      theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/40 border-zinc-850"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-brand-secondary" />
                          <h3 className={`font-black text-sm tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Latest Inbox Messages</h3>
                        </div>
                        <button 
                          onClick={() => setActiveTab("messages")}
                          className="text-[11px] font-bold text-brand-secondary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {messages.slice(0, 4).map((m) => (
                          <div key={m.id} className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 ${
                            theme === "light" ? "bg-slate-50/80 border-slate-200/60" : "bg-zinc-900/60 border-zinc-800/80"
                          }`}>
                            <div className="truncate min-w-0">
                              <span className={`font-bold text-xs block truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                {m.name}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-medium block truncate">
                                {m.subject || m.message}
                              </span>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              !m.read ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 animate-pulse" : "bg-zinc-500/10 text-zinc-500"
                            }`}>
                              {!m.read ? "New" : "Read"}
                            </span>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <p className="text-xs text-zinc-500 italic py-6 text-center">No messages in inbox.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN DATA INTERFACE MODULE */}
              <div className="space-y-6">
                
                {/* SEARCH AND FILTER BAR */}
                {["bookings", "messages", "careers"].includes(activeTab) && (
                  <div className={`flex flex-col sm:flex-row gap-4 border p-4 rounded-2xl shadow-md transition-all ${
                    theme === "light" ? "bg-white border-slate-200" : "bg-zinc-950 border-zinc-900"
                  }`}>
                    {/* Search box */}
                    <div className="relative flex-grow">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                          theme === "light"
                            ? "bg-slate-50 border-slate-200 text-slate-950 placeholder-slate-400"
                            : "bg-zinc-950 border-zinc-850 text-white placeholder-zinc-650"
                        }`}
                      />
                    </div>

                    {/* Filter Select Options */}
                    <div className="flex items-center gap-3 shrink-0">
                      <Filter className="w-4 h-4 text-zinc-500" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`py-2.5 pl-3 pr-8 border rounded-xl text-xs font-bold focus:border-brand-primary focus:outline-none focus:ring-0 uppercase tracking-wide cursor-pointer ${
                          theme === "light"
                            ? "bg-slate-50 border-slate-200 text-slate-700"
                            : "bg-zinc-950 border-zinc-850 text-zinc-400"
                        }`}
                      >
                        {activeTab === "bookings" && (
                          <>
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </>
                        )}
                        {activeTab === "messages" && (
                          <>
                            <option value="ALL">All Messages</option>
                            <option value="UNREAD">Unread Only</option>
                            <option value="READ">Read Only</option>
                          </>
                        )}
                        {activeTab === "careers" && (
                          <>
                            <option value="ALL">All Applicants</option>
                            <option value="REVIEWING">Reviewing</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="HIRED">Hired</option>
                            <option value="REJECTED">Rejected</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                )}

                {/* LIST VIEWS PORTLET */}
                <div className="space-y-4">
                  
                  {/* --- TAB 1: CONSULTATIONS --- */}
                  {activeTab === "bookings" && (
                    <>
                      {getFilteredConsultations().length === 0 ? (
                        <div className={`p-12 text-center font-bold text-xs border rounded-3xl uppercase tracking-widest ${
                          theme === "light" ? "bg-slate-100/50 border-slate-200 text-slate-400" : "bg-zinc-950/20 border-zinc-900 text-zinc-500"
                        }`}>
                          No consultations found.
                        </div>
                      ) : (
                        getFilteredConsultations().map((item) => (
                          <div key={item.id} className={`p-6 border rounded-3xl shadow-lg relative space-y-4 transition-all ${
                            theme === "light" ? "bg-white border-slate-200 text-slate-700" : "bg-zinc-900/30 border-zinc-850 text-zinc-100"
                          }`}>
                            {/* Top header row */}
                            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b ${
                              theme === "light" ? "border-slate-150" : "border-zinc-850/60"
                            }`}>
                              <div>
                                <h4 className={`font-bold text-base tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>{item.name}</h4>
                                <span className={`text-[10px] font-semibold ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>{item.email} • {item.whatsapp}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Status Badge */}
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateConsultation(item.id, e.target.value as any)}
                                  className={`py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-wider focus:outline-none border cursor-pointer transition-colors ${
                                    item.status === "Approved" 
                                      ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                      : item.status === "Completed" 
                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/30" 
                                        : item.status === "Cancelled" 
                                          ? "bg-red-500/10 text-red-500 border-red-500/30" 
                                          : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                  }`}
                                >
                                  <option value="Pending" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Pending</option>
                                  <option value="Approved" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Approved</option>
                                  <option value="Completed" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Completed</option>
                                  <option value="Cancelled" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Cancelled</option>
                                </select>

                                {/* Delete (CEO ONLY) */}
                                {currentUser.role === "CEO" && (
                                  <button
                                    onClick={() => handleDeleteConsultation(item.id)}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                      theme === "light"
                                        ? "bg-slate-50 border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200"
                                        : "bg-zinc-950 border-zinc-850 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 hover:border-red-500/20"
                                    }`}
                                    title="Delete Consultation (CEO Permission)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Detail specs */}
                            <div className="grid sm:grid-cols-3 gap-3 pt-1 text-xs">
                              <div className={`p-2.5 rounded-xl border ${
                                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                              }`}>
                                <span className={`text-[9px] uppercase tracking-widest font-black block ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Service focus</span>
                                <span className={`font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>{item.service}</span>
                              </div>
                              <div className={`p-2.5 rounded-xl border ${
                                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                              }`}>
                                <span className={`text-[9px] uppercase tracking-widest font-black block ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Scheduled Date</span>
                                <span className={`font-bold ${theme === "light" ? "text-slate-800" : "text-zinc-300"}`}>{item.date}</span>
                              </div>
                              <div className={`p-2.5 rounded-xl border ${
                                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                              }`}>
                                <span className={`text-[9px] uppercase tracking-widest font-black block ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Preferred Slot (GMT+1)</span>
                                <span className={`font-bold ${theme === "light" ? "text-slate-800" : "text-zinc-300"}`}>{item.time}</span>
                              </div>
                            </div>

                            {/* Brief notes */}
                            <div className={`text-xs leading-relaxed font-medium p-3.5 rounded-2xl border ${
                              theme === "light" ? "bg-slate-50/50 border-slate-150 text-slate-600" : "bg-zinc-950/10 border-zinc-850/40 text-zinc-400"
                            }`}>
                              <span className={`text-[9px] uppercase tracking-widest font-black block mb-1 ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Project Brief</span>
                              {item.brief || "No brief specified."}
                            </div>

                            {/* Staff Internal Notes */}
                            <div className="flex justify-between items-start gap-4 p-3.5 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl">
                              <div className="text-xs">
                                <span className="text-[9px] text-brand-primary uppercase tracking-widest font-black block mb-0.5">Staff Internal Notes</span>
                                <p className={`font-semibold italic ${theme === "light" ? "text-slate-700" : "text-zinc-300"}`}>
                                  {item.staffNotes || "No staff notes added yet."}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingBooking(item);
                                  setNoteText(item.staffNotes || "");
                                }}
                                className={`p-1.5 rounded border transition-all cursor-pointer shrink-0 ${
                                  theme === "light"
                                    ? "bg-white border-brand-primary/20 hover:bg-brand-primary/5 text-brand-primary shadow-sm"
                                    : "bg-zinc-950 border-brand-primary/20 hover:bg-zinc-850 text-brand-primary"
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {/* --- TAB 2: CONTACT INBOX --- */}
                  {activeTab === "messages" && (
                    <>
                      {getFilteredMessages().length === 0 ? (
                        <div className={`p-12 text-center font-bold text-xs border rounded-3xl uppercase tracking-widest ${
                          theme === "light" ? "bg-slate-100/50 border-slate-200 text-slate-400" : "bg-zinc-950/20 border-zinc-900 text-zinc-500"
                        }`}>
                          No inbox messages found.
                        </div>
                      ) : (
                        getFilteredMessages().map((item) => (
                          <div key={item.id} className={`p-6 border rounded-3xl shadow-lg relative space-y-4 transition-all ${
                            item.read 
                              ? theme === "light" 
                                ? "bg-white border-slate-200 text-slate-700 shadow-sm" 
                                : "bg-zinc-900/20 border-zinc-850 text-zinc-300"
                              : theme === "light"
                                ? "bg-white border-brand-primary/25 shadow-md shadow-brand-primary/5 text-slate-700"
                                : "bg-zinc-900/50 border-brand-primary/25 shadow-brand-primary/5 text-zinc-100"
                          }`}>
                            {/* Message Top Ribbon */}
                            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b ${
                              theme === "light" ? "border-slate-150" : "border-zinc-850/60"
                            }`}>
                              <div>
                                <h4 className={`font-bold text-base tracking-tight flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                  {item.name}
                                  {!item.read && <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shrink-0" />}
                                </h4>
                                <span className={`text-[10px] font-semibold ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>{item.email}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Read / Unread Status */}
                                <button
                                  onClick={() => handleToggleMessageRead(item.id, item.read)}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider focus:outline-none border cursor-pointer transition-colors ${
                                    item.read 
                                      ? theme === "light"
                                        ? "bg-slate-50 text-slate-500 border-slate-200"
                                        : "bg-zinc-950 text-zinc-500 border-zinc-850" 
                                      : "bg-brand-primary/10 text-brand-primary border-brand-primary/30"
                                  }`}
                                >
                                  {item.read ? "Mark Unread" : "Mark Read"}
                                </button>

                                {/* Delete (CEO ONLY) */}
                                {currentUser.role === "CEO" && (
                                  <button
                                    onClick={() => handleDeleteMessage(item.id)}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                      theme === "light"
                                        ? "bg-slate-50 border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200"
                                        : "bg-zinc-950 border-zinc-850 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 hover:border-red-500/20"
                                    }`}
                                    title="Delete Message (CEO Permission)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Message Content */}
                            <div>
                              <div className="bg-brand-primary/5 px-3 py-1.5 rounded-lg border border-brand-primary/15 w-fit text-[10px] text-brand-primary font-black uppercase tracking-widest mb-2">
                                {item.subject}
                              </div>
                              <p className={`text-xs leading-relaxed font-semibold ${theme === "light" ? "text-slate-700" : "text-zinc-300"}`}>
                                {item.message}
                              </p>
                            </div>

                            {/* Message Date stamp */}
                            <span className={`text-[10px] font-semibold block pt-2 ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>
                              Received: {new Date(item.createdAt).toLocaleString()}
                            </span>

                            {/* Internal Message Notes */}
                            <div className="flex justify-between items-start gap-4 p-3.5 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl">
                              <div className="text-xs">
                                <span className="text-[9px] text-brand-primary uppercase tracking-widest font-black block mb-0.5">Staff Response Log</span>
                                <p className={`font-semibold italic ${theme === "light" ? "text-slate-700" : "text-zinc-300"}`}>
                                  {item.staffNotes || "No reply notes added yet."}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingMessage(item);
                                  setNoteText(item.staffNotes || "");
                                }}
                                className={`p-1.5 rounded border transition-all cursor-pointer shrink-0 ${
                                  theme === "light"
                                    ? "bg-white border-brand-primary/20 hover:bg-brand-primary/5 text-brand-primary shadow-sm"
                                    : "bg-zinc-950 border-brand-primary/20 hover:bg-zinc-850 text-brand-primary"
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {/* --- TAB 3: CAREER APPLICATIONS --- */}
                  {activeTab === "careers" && (
                    <>
                      {getFilteredApplications().length === 0 ? (
                        <div className={`p-12 text-center font-bold text-xs border rounded-3xl uppercase tracking-widest ${
                          theme === "light" ? "bg-slate-100/50 border-slate-200 text-slate-400" : "bg-zinc-950/20 border-zinc-900 text-zinc-500"
                        }`}>
                          No candidates found.
                        </div>
                      ) : (
                        getFilteredApplications().map((item) => (
                          <div key={item.id} className={`p-6 border rounded-3xl shadow-lg relative space-y-4 transition-all ${
                            theme === "light" ? "bg-white border-slate-200 text-slate-700" : "bg-zinc-900/30 border-zinc-850 text-zinc-100"
                          }`}>
                            {/* Application Header Ribbon */}
                            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b ${
                              theme === "light" ? "border-slate-150" : "border-zinc-850/60"
                            }`}>
                              <div>
                                <h4 className={`font-bold text-base tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>{item.name}</h4>
                                <span className={`text-[10px] font-semibold ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>{item.email}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Application Status Selector */}
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateAppStatus(item.id, e.target.value as any)}
                                  className={`py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-wider focus:outline-none border cursor-pointer transition-colors ${
                                    item.status === "Hired" 
                                      ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                      : item.status === "Shortlisted" 
                                        ? "bg-brand-primary/10 text-brand-primary border-brand-primary/30" 
                                        : item.status === "Rejected" 
                                          ? "bg-red-500/10 text-red-500 border-red-500/30" 
                                          : theme === "light"
                                            ? "bg-slate-100 text-slate-500 border-slate-200"
                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                  }`}
                                >
                                  <option value="Reviewing" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Reviewing</option>
                                  <option value="Shortlisted" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Shortlisted</option>
                                  <option value="Hired" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Hired</option>
                                  <option value="Rejected" className={theme === "light" ? "bg-white text-slate-900" : "bg-zinc-950 text-white"}>Rejected</option>
                                </select>

                                {/* Delete Application (CEO ONLY) */}
                                {currentUser.role === "CEO" && (
                                  <button
                                    onClick={() => handleDeleteApplication(item.id)}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                      theme === "light"
                                        ? "bg-slate-50 border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200"
                                        : "bg-zinc-950 border-zinc-850 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 hover:border-red-500/20"
                                    }`}
                                    title="Delete Application (CEO Permission)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Applied Target job info */}
                            <div className="grid sm:grid-cols-2 gap-3 text-xs">
                              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                              }`}>
                                <div>
                                  <span className={`text-[9px] uppercase tracking-widest font-black block ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Target Position</span>
                                  <span className={`font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>{item.jobTitle}</span>
                                </div>
                                <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
                              </div>
                              
                              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                              }`}>
                                <div className="truncate flex-grow mr-2">
                                  <span className={`text-[9px] uppercase tracking-widest font-black block ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Portfolio URL</span>
                                  <a 
                                    href={item.portfolio} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-brand-primary font-bold hover:underline truncate block max-w-xs"
                                  >
                                    {item.portfolio || "No link provided."}
                                  </a>
                                </div>
                                {item.portfolio && <ExternalLink className="w-4 h-4 text-brand-primary shrink-0" />}
                              </div>
                            </div>

                            {/* Candidate Note / bio */}
                            <div className={`text-xs leading-relaxed font-medium p-3.5 rounded-2xl border ${
                              theme === "light" ? "bg-slate-50/50 border-slate-150 text-slate-600" : "bg-zinc-950/10 border-zinc-850/40 text-zinc-400"
                            }`}>
                              <span className={`text-[9px] uppercase tracking-widest font-black block mb-1 ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>Key Expertise Brief</span>
                              {item.note || "No note added."}
                            </div>

                            {/* Time Stamp */}
                            <span className={`text-[10px] font-semibold block text-right ${theme === "light" ? "text-slate-400" : "text-zinc-500"}`}>
                              Submitted: {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {/* --- TAB 4: SECURITY & STAFF --- */}
                  {activeTab === "staff" && (
                    <>
                      {!canManageStaffPermissions ? (
                        /* LOCKED VIEW TRIGGER */
                        <div className={`p-8 text-center border rounded-3xl space-y-4 ${
                          theme === "light" ? "bg-slate-100/30 border-slate-200" : "bg-zinc-950/10 border-zinc-900"
                        }`}>
                          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Lock className="w-5 h-5 animate-pulse" />
                          </div>
                          <h4 className={`font-bold text-base ${theme === "light" ? "text-slate-900" : "text-white"}`}>Staff Governance Credentials Required</h4>
                          <p className={`text-xs leading-relaxed max-w-xs mx-auto ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                            You are currently signed in as {currentUser.name} ({currentUser.role}). Security logs, database rules, and administrative staff management require authorized privileges.
                          </p>
                        </div>
                      ) : (
                        /* ACTIVE ROSTER MANAGEMENT */
                        <div className="space-y-8 animate-fade-in">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                            <div>
                              <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Security & Staff Workspace</h3>
                              <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Manage staff user roles, privileges, and provision new administrator profiles.</p>
                            </div>
                            <button
                              onClick={() => {
                                setNewStaffError("");
                                setNewStaffSuccess("");
                                setShowStaffForm(true);
                              }}
                              className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Provision New Staff</span>
                            </button>
                          </div>
                          
                          {/* ROSTER LISTING */}
                          <div className={`p-6 border rounded-3xl space-y-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Active Administration Roster ({staffList.length})</span>
                              <span className="text-[10px] font-bold text-brand-primary">Click 'Access Scope' to view what each account can access</span>
                            </div>
                            
                            <div className={`divide-y ${theme === "light" ? "divide-slate-150" : "divide-zinc-850"}`}>
                              {staffList.map((staff) => {
                                const isSelf = staff.email.toLowerCase() === currentUser.email.toLowerCase();
                                const isExpanded = expandedRosterEmails.includes(staff.email.toLowerCase());
                                const permittedMods = ALL_SYSTEM_MODULES.filter(m => isTabPermitted(m.id, staff.role, staff.allowedTabs));
                                const roleDetail = ROLE_PERMISSIONS_GUIDE[staff.role] || ROLE_PERMISSIONS_GUIDE["Employee"];

                                return (
                                  <div key={staff.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div>
                                        <h5 className={`font-bold text-xs sm:text-sm flex items-center gap-1.5 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                          {staff.name} 
                                          {isSelf && <span className="text-[9px] font-bold text-brand-primary px-1.5 py-0.5 bg-brand-primary/10 rounded tracking-widest uppercase">You</span>}
                                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                            staff.role === "CEO" 
                                              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                                              : staff.role === "Manager"
                                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                : staff.role === "Developer"
                                                  ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                  : staff.role === "Designer"
                                                    ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                                                    : staff.role === "Content Editor"
                                                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                      : staff.role === "Customer Support"
                                                        ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                                                        : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                          }`}>
                                            {staff.role}
                                          </span>
                                        </h5>
                                        <span className={`text-[10px] font-semibold ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>{staff.email}</span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {/* Toggle Scope Button */}
                                        <button
                                          onClick={() => {
                                            const lower = staff.email.toLowerCase();
                                            setExpandedRosterEmails(prev => 
                                              prev.includes(lower) ? prev.filter(e => e !== lower) : [...prev, lower]
                                            );
                                          }}
                                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-1 ${
                                            isExpanded
                                              ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                                              : theme === "light"
                                                ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                                                : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                                          }`}
                                        >
                                          <ShieldCheck className="w-3 h-3 text-brand-primary" />
                                          <span>Access Scope ({permittedMods.length})</span>
                                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                        </button>

                                        {/* Role Dropdown */}
                                        <select
                                          value={staff.role}
                                          onChange={(e) => handleUpdateStaffRole(staff.email, e.target.value as StaffUser["role"])}
                                          disabled={isSelf}
                                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider focus:outline-none border cursor-pointer transition-all ${
                                            isSelf 
                                              ? theme === "light"
                                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                                : "bg-zinc-950 text-zinc-600 border-zinc-900 cursor-not-allowed" 
                                              : theme === "light"
                                                ? "bg-white hover:bg-slate-550/10 text-brand-primary border-brand-primary/25 shadow-sm"
                                                : "bg-zinc-900 hover:bg-zinc-850 text-brand-primary border-brand-primary/20"
                                          }`}
                                        >
                                          <option value="CEO">CEO</option>
                                          <option value="Manager">Manager</option>
                                          <option value="Developer">Developer</option>
                                          <option value="Designer">Designer</option>
                                          <option value="Content Editor">Editor</option>
                                          <option value="Customer Support">Customer Support</option>
                                          <option value="Employee">Employee</option>
                                        </select>

                                        {/* Reset Staff Password Button */}
                                        <button
                                          onClick={() => {
                                            setResetStaffModalEmail(staff.email);
                                            setResetStaffNewPass("");
                                            setResetStaffSuccessMsg("");
                                            setResetStaffErrorMsg("");
                                          }}
                                          className={`p-1.5 rounded-lg border transition-all ${
                                            theme === "light"
                                              ? "bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-400 hover:text-amber-600 hover:border-amber-200 cursor-pointer"
                                              : "bg-zinc-950 border-zinc-850 hover:bg-amber-500/10 text-zinc-500 hover:text-amber-400 hover:border-amber-500/20 cursor-pointer"
                                          }`}
                                          title="Reset Password for this account"
                                        >
                                          <Key className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Delete Staff Member Button */}
                                        <button
                                          onClick={() => handleDeleteStaffUser(staff.email)}
                                          disabled={isSelf}
                                          className={`p-1.5 rounded-lg border transition-all ${
                                            isSelf
                                              ? "opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500"
                                              : theme === "light"
                                                ? "bg-slate-50 border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200 cursor-pointer"
                                                : "bg-zinc-950 border-zinc-850 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 hover:border-red-500/20 cursor-pointer"
                                          }`}
                                          title={isSelf ? "You cannot delete your own CEO account." : "Delete Staff Profile"}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* EXPANDABLE ACCESS SCOPE DRAWER */}
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-2xl border space-y-3 ${
                                          theme === "light" ? "bg-slate-50/80 border-slate-200" : "bg-zinc-950/80 border-zinc-800"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary">
                                              Assigned Role Authority Scope: {staff.role}
                                            </span>
                                            <span className={`text-[8px] font-black px-2 py-0.2 rounded-full border uppercase tracking-wider ${roleDetail.badgeClass}`}>
                                              {roleDetail.securityLevel}
                                            </span>
                                          </div>
                                          <span className="text-[9px] font-bold text-zinc-500">{permittedMods.length} of {ALL_SYSTEM_MODULES.length} modules accessible</span>
                                        </div>

                                        <p className={`text-[11px] font-medium leading-relaxed ${theme === "light" ? "text-slate-600" : "text-zinc-400"}`}>
                                          {roleDetail.summary}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-inherit pt-2.5 mt-2">
                                          <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary block">
                                              Granular Page & Module Access Overrides (Admin Controls)
                                            </span>
                                            <p className="text-[10px] text-zinc-500 font-medium">
                                              {canManageStaffPermissions 
                                                ? `Click any page button below to grant or remove access instantly for ${staff.name}.`
                                                : `Role page access overview for ${staff.name}.`}
                                            </p>
                                          </div>
                                          {canManageStaffPermissions && (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => handleGrantAllStaffPermissions(staff.email)}
                                                className="text-[9px] font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 transition-all cursor-pointer"
                                                title="Grant access to all pages for this staff member"
                                              >
                                                Grant All Pages
                                              </button>
                                              {staff.allowedTabs && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleResetStaffPermissions(staff.email)}
                                                  className="text-[9px] font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 transition-all cursor-pointer"
                                                  title="Reset custom page overrides back to role defaults"
                                                >
                                                  Reset Defaults
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                          {ALL_SYSTEM_MODULES.map((mod) => {
                                            const isPermitted = isTabPermitted(mod.id, staff.role, staff.allowedTabs);
                                            const isCeoUser = canManageStaffPermissions;

                                            return (
                                              <button
                                                key={mod.id}
                                                type="button"
                                                disabled={!isCeoUser}
                                                onClick={() => handleToggleStaffPermission(staff.email, mod.id)}
                                                className={`text-[9px] font-bold px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                                                  isPermitted
                                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-black hover:bg-emerald-500/20 shadow-xs cursor-pointer active:scale-95"
                                                    : "bg-red-500/5 text-zinc-500 border-red-500/15 hover:bg-red-500/10 hover:text-zinc-400 cursor-pointer active:scale-95"
                                                }`}
                                                title={
                                                  isCeoUser
                                                    ? isPermitted ? `Click to REVOKE ${mod.label} access` : `Click to GRANT ${mod.label} access`
                                                    : undefined
                                                }
                                              >
                                                {isPermitted ? (
                                                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                                ) : (
                                                  <X className="w-3 h-3 text-red-400 shrink-0" />
                                                )}
                                                <span>{mod.label}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* ADMIN PERMISSION GUIDE & ROLE MATRIX SECTION */}
                          <div className={`p-6 border rounded-3xl space-y-6 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                              <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                  <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className={`font-black text-lg tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                    Admin Role Permission Guide & Access Matrix
                                  </h4>
                                  <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                                    Reference manual for Chief Executives when granting staff privileges and assigning access roles.
                                  </p>
                                </div>
                              </div>

                              {/* View Mode Switcher */}
                              <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                                theme === "light" ? "bg-slate-100 border-slate-200" : "bg-zinc-950 border-zinc-800"
                              }`}>
                                <button
                                  type="button"
                                  onClick={() => setGuideViewMode("inspector")}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    guideViewMode === "inspector"
                                      ? "bg-brand-primary text-white shadow-xs"
                                      : theme === "light" ? "text-slate-600 hover:text-slate-900" : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  Role Inspector
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGuideViewMode("matrix")}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    guideViewMode === "matrix"
                                      ? "bg-brand-primary text-white shadow-xs"
                                      : theme === "light" ? "text-slate-600 hover:text-slate-900" : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  Comparison Matrix
                                </button>
                              </div>
                            </div>

                            {guideViewMode === "inspector" ? (
                              <div className="space-y-6">
                                {/* Role Selection Tabs */}
                                <div className="flex flex-wrap gap-2">
                                  {(["CEO", "Manager", "Developer", "Designer", "Content Editor", "Customer Support", "Employee"] as StaffUser["role"][]).map((r) => {
                                    const isSelected = guideSelectedRole === r;
                                    return (
                                      <button
                                        type="button"
                                        key={r}
                                        onClick={() => setGuideSelectedRole(r)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                                          isSelected
                                            ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                                            : theme === "light"
                                              ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                              : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                                        }`}
                                      >
                                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-brand-primary"}`} />
                                        <span>{r}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Selected Role Detailed Card */}
                                {(() => {
                                  const info = ROLE_PERMISSIONS_GUIDE[guideSelectedRole] || ROLE_PERMISSIONS_GUIDE["Employee"];
                                  const permittedTabs = ALL_SYSTEM_MODULES.filter(m => isTabPermitted(m.id, guideSelectedRole));
                                  const restrictedTabs = ALL_SYSTEM_MODULES.filter(m => !isTabPermitted(m.id, guideSelectedRole));

                                  return (
                                    <div className={`p-6 rounded-2xl border space-y-6 ${
                                      theme === "light" ? "bg-slate-50/70 border-slate-200" : "bg-zinc-950/70 border-zinc-800"
                                    }`}>
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-inherit">
                                        <div>
                                          <div className="flex items-center gap-2.5">
                                            <h5 className={`font-black text-base ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                              {info.title}
                                            </h5>
                                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${info.badgeClass}`}>
                                              {info.securityLevel}
                                            </span>
                                          </div>
                                          <p className={`text-xs mt-1 font-medium ${theme === "light" ? "text-slate-600" : "text-zinc-400"}`}>
                                            {info.summary}
                                          </p>
                                        </div>

                                        <div className="shrink-0 sm:text-right">
                                          <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest block">
                                            Accessible Modules
                                          </span>
                                          <span className={`text-lg font-black ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                            {permittedTabs.length} / {ALL_SYSTEM_MODULES.length}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Modules Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Permitted Modules List */}
                                        <div className="space-y-3">
                                          <span className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4" /> Permitted Access Modules ({permittedTabs.length})
                                          </span>
                                          <div className="space-y-2">
                                            {permittedTabs.map((mod) => (
                                              <div
                                                key={mod.id}
                                                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                                  theme === "light" 
                                                    ? "bg-white border-emerald-200/80 shadow-2xs" 
                                                    : "bg-zinc-900/80 border-emerald-500/20"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                                                    <Check className="w-3.5 h-3.5" />
                                                  </div>
                                                  <div className="truncate">
                                                    <span className={`text-xs font-bold block truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                                      {mod.label}
                                                    </span>
                                                    <span className="text-[9px] font-semibold text-zinc-500 block truncate">
                                                      {mod.desc}
                                                    </span>
                                                  </div>
                                                </div>
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-wider shrink-0">
                                                  {mod.category}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Restricted Modules List */}
                                        <div className="space-y-3">
                                          <span className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                            <X className="w-4 h-4 text-red-400" /> Restricted Modules ({restrictedTabs.length})
                                          </span>
                                          {restrictedTabs.length === 0 ? (
                                            <div className={`p-6 rounded-xl border text-center ${
                                              theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/40 border-zinc-800"
                                            }`}>
                                              <ShieldCheck className="w-8 h-8 text-brand-primary mx-auto mb-2 opacity-80" />
                                              <p className={`text-xs font-bold ${theme === "light" ? "text-slate-800" : "text-white"}`}>No Restricted Modules</p>
                                              <p className="text-[10px] text-zinc-500 mt-0.5">This role possesses full system authority.</p>
                                            </div>
                                          ) : (
                                            <div className="space-y-2 opacity-75">
                                              {restrictedTabs.map((mod) => (
                                                <div
                                                  key={mod.id}
                                                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                                    theme === "light" 
                                                      ? "bg-slate-100/60 border-slate-200/60" 
                                                      : "bg-zinc-900/30 border-zinc-850"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                                                      <X className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="truncate">
                                                      <span className={`text-xs font-bold block truncate line-through ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                                                        {mod.label}
                                                      </span>
                                                      <span className="text-[9px] font-semibold text-zinc-500 block truncate">
                                                        Access blocked for {guideSelectedRole}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-red-500/10 text-red-400 uppercase tracking-wider shrink-0">
                                                    Restricted
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Responsibilities */}
                                      <div className={`pt-4 border-t border-inherit space-y-2`}>
                                        <span className="text-xs font-black uppercase tracking-wider text-brand-primary block">
                                          Key Administrative Responsibilities & Action Limits:
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {info.keyResponsibilities.map((resp, i) => (
                                            <div
                                              key={i}
                                              className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs font-semibold ${
                                                theme === "light" ? "bg-white border-slate-200 text-slate-800" : "bg-zinc-900/80 border-zinc-800 text-zinc-200"
                                              }`}
                                            >
                                              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                                              <span>{resp}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              /* FULL COMPARISON MATRIX TABLE */
                              <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
                                      theme === "light" ? "border-slate-200 bg-slate-100/70 text-slate-600" : "border-zinc-800 bg-zinc-950/80 text-zinc-400"
                                    }`}>
                                      <th className="p-3 font-black">System Module</th>
                                      {(["CEO", "Manager", "Developer", "Designer", "Content Editor", "Customer Support", "Employee"] as StaffUser["role"][]).map((r) => (
                                        <th key={r} className="p-3 text-center font-black">
                                          {r}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className={`divide-y ${theme === "light" ? "divide-slate-200" : "divide-zinc-850"}`}>
                                    {ALL_SYSTEM_MODULES.map((mod) => (
                                      <tr key={mod.id} className={`transition-colors ${
                                        theme === "light" ? "hover:bg-slate-50" : "hover:bg-zinc-900/40"
                                      }`}>
                                        <td className="p-3">
                                          <span className={`font-bold block ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                            {mod.label}
                                          </span>
                                          <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">
                                            {mod.category}
                                          </span>
                                        </td>
                                        {(["CEO", "Manager", "Developer", "Designer", "Content Editor", "Customer Support", "Employee"] as StaffUser["role"][]).map((r) => {
                                          const permitted = isTabPermitted(mod.id, r);
                                          return (
                                            <td key={r} className="p-3 text-center">
                                              {permitted ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase">
                                                  <Check className="w-2.5 h-2.5" /> Allowed
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/5 text-zinc-500 border border-red-500/10 text-[9px] font-bold uppercase opacity-50">
                                                  <X className="w-2.5 h-2.5" /> Blocked
                                                </span>
                                              )}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* --- TAB: MY PROFILE --- */}
                  {activeTab === "my_profile" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
                      {/* Hidden File Input for Camera / Photo Upload */}
                      <input 
                        type="file" 
                        ref={profileFileInputRef} 
                        accept="image/*" 
                        onChange={handleAvatarFileChange} 
                        className="hidden" 
                      />

                      {/* Header Profile Card */}
                      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                        theme === "light" 
                          ? "bg-white border-slate-200/80 shadow-md text-slate-900" 
                          : "bg-zinc-900/80 border-zinc-800 text-white shadow-2xl"
                      }`}>
                        {/* Decorative mesh pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                          {/* Main Profile Picture Avatar with Small Camera Icon Badge */}
                          <div className="relative group shrink-0">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-brand-primary/30 shadow-2xl flex items-center justify-center bg-gradient-to-tr from-brand-primary via-indigo-600 to-purple-800 relative">
                              {profileAvatar ? (
                                <img src={profileAvatar} alt={profileName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-white font-black text-4xl">{currentUser.name.charAt(0).toUpperCase()}</span>
                              )}

                              {/* Hover Overlay */}
                              <div 
                                onClick={triggerAvatarUpload}
                                className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2 rounded-3xl"
                                title="Click to upload or update picture"
                              >
                                <Camera className="w-6 h-6 mb-1 text-brand-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                              </div>
                            </div>

                            {/* Small Camera Icon Badge Button on the Profile Picture Section */}
                            <button
                              type="button"
                              onClick={triggerAvatarUpload}
                              title="Add or update profile picture"
                              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-brand-primary text-white shadow-xl border-2 border-zinc-950 hover:bg-brand-primary/90 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center group/cam"
                            >
                              <Camera className="w-4 h-4 group-hover/cam:rotate-12 transition-transform" />
                            </button>
                          </div>

                          {/* Profile Quick Info */}
                          <div className="space-y-2 flex-grow">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <h2 className={`text-2xl font-black tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                {profileName || currentUser.name}
                              </h2>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Verified Staff
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-zinc-400 flex items-center justify-center sm:justify-start gap-2">
                              <Mail className="w-3.5 h-3.5 text-brand-primary" /> {currentUser.email}
                            </p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px]">
                              <span className="px-2.5 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-bold uppercase tracking-wider">
                                {currentUser.role} Account
                              </span>
                              <span className="text-zinc-500">•</span>
                              <span className="text-zinc-400 font-mono text-[10px]">ID: {currentUser.id}</span>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                              <button
                                type="button"
                                onClick={triggerAvatarUpload}
                                className="px-4 py-2 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                Add / Update Picture
                              </button>

                              {profileAvatar && (
                                <button
                                  type="button"
                                  onClick={() => setProfileAvatar("")}
                                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove Photo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {profileSuccess && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{profileSuccess}</span>
                          </div>
                          <button onClick={() => setProfileSuccess("")} className="text-emerald-500 hover:text-emerald-400 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}

                      {/* Profile Details Form Card */}
                      <div className={`p-6 sm:p-8 border rounded-3xl ${
                        theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/60 border-zinc-800"
                      }`}>
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                          <h4 className="font-bold text-xs tracking-wider uppercase text-brand-primary border-b border-inherit pb-3 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4" /> Personal & Account Information
                            </span>
                            <span className="text-[10px] text-zinc-500 font-normal">Staff Profile</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                                Full Name <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={profileName}
                                onChange={e => setProfileName(e.target.value)}
                                placeholder="Your full display name"
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:border-brand-primary focus:outline-none transition-colors ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                                }`}
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                                Email Address <span className="text-zinc-500 font-normal">(Verified Lock)</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="email"
                                  value={currentUser.email}
                                  disabled
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold opacity-60 cursor-not-allowed pr-10 ${
                                    theme === "light" ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                                  }`}
                                />
                                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute right-3.5 top-3" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                                Author Bio / Corporate Tagline
                              </label>
                              <span className="text-[10px] text-zinc-500 font-semibold">{profileBio.length} / 300 chars</span>
                            </div>
                            <textarea
                              rows={3}
                              maxLength={300}
                              placeholder="e.g. Executive Leader driving digital transformation and enterprise technology innovation..."
                              value={profileBio}
                              onChange={e => setProfileBio(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:border-brand-primary focus:outline-none leading-relaxed ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                              }`}
                            />
                            <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                              This bio displays on corporate blog posts and staff author cards.
                            </p>
                          </div>

                          {/* Active Privileges Overview */}
                          <div className="pt-2 border-t border-inherit space-y-3">
                            <h4 className="font-bold text-xs tracking-wider uppercase text-brand-primary flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Active Console Privileges
                              </span>
                              <span className="text-[10px] text-emerald-500 font-bold uppercase">Role: {currentUser.role}</span>
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {[
                                { id: "overview", label: "Dashboard Analytics" },
                                { id: "bookings", label: "Client Consultations" },
                                { id: "messages", label: "Contact Enquiries" },
                                { id: "insights_cms", label: "Insights / Blog CMS" },
                                { id: "portfolio_cms", label: "Portfolio Showcase" },
                                { id: "services_cms", label: "Services & Pricing" },
                                { id: "training_cms", label: "Academy Courses" },
                                { id: "about_cms", label: "About Page Content" },
                                { id: "staff", label: "Staff Management" }
                              ].map((mod) => {
                                const isPermitted = isTabPermitted(mod.id, currentUser.role, currentUser.allowedTabs);
                                return (
                                  <div 
                                    key={mod.id} 
                                    className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-between ${
                                      isPermitted 
                                        ? theme === "light" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                        : theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 opacity-60" : "bg-zinc-950 border-zinc-800 text-zinc-600 opacity-60"
                                    }`}
                                  >
                                    <span className="truncate">{mod.label}</span>
                                    {isPermitted ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                      <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="pt-3 flex items-center justify-between gap-4 border-t border-inherit">
                            <button
                              type="submit"
                              disabled={profileLoading}
                              className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
                            >
                              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Profile Changes
                            </button>
                            
                            <p className="text-[11px] text-zinc-500 hidden sm:block font-medium">
                              Changes sync immediately across corporate blogs & team profile widgets.
                            </p>
                          </div>
                        </form>
                      </div>

                      {/* Security & Change Password Card */}
                      <div className={`p-6 sm:p-8 border rounded-3xl ${
                        theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-zinc-900/60 border-zinc-800"
                      }`}>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                          <h4 className="font-bold text-xs tracking-wider uppercase text-brand-primary border-b border-inherit pb-3 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Key className="w-4 h-4" /> Security & Change Password
                            </span>
                            <span className="text-[10px] text-zinc-500 font-normal">Account Security</span>
                          </h4>

                          {passwordError && (
                            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>{passwordError}</span>
                            </div>
                          )}

                          {passwordSuccess && (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>{passwordSuccess}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                                New Password <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="password"
                                required
                                minLength={6}
                                value={changePasswordNew}
                                onChange={e => setChangePasswordNew(e.target.value)}
                                placeholder="Minimum 6 characters"
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:border-brand-primary focus:outline-none transition-colors ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                                }`}
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                                Confirm New Password <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="password"
                                required
                                minLength={6}
                                value={changePasswordConfirm}
                                onChange={e => setChangePasswordConfirm(e.target.value)}
                                placeholder="Re-enter new password"
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:border-brand-primary focus:outline-none transition-colors ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                                }`}
                              />
                            </div>
                          </div>

                          <div className="pt-3 flex items-center justify-between gap-4 border-t border-inherit">
                            <button
                              type="submit"
                              disabled={passwordLoading}
                              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
                            >
                              {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                              Update Password
                            </button>
                            
                            <p className="text-[11px] text-zinc-500 hidden sm:block font-medium">
                              Your password will be updated across administrative portals immediately.
                            </p>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                  {/* --- TAB: INSIGHTS CMS --- */}
                  {activeTab === "insights_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Insights CMS</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Publish, edit, and delete corporate blogs and tech thoughts.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingBlog(null);
                            setBlogTitle("");
                            setBlogExcerpt("");
                            setBlogContent("");
                            setBlogCategory("Technology");
                            setBlogImage("");
                            setBlogAuthorName(currentUser?.name || "Nexlify Admin");
                            setBlogAuthorRole(currentUser?.role || "Administrator");
                            setBlogAuthorAvatar(currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80");
                            setShowBlogForm(true);
                          }}
                          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Publish New Insight</span>
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {cmsBlogs.map(blog => (
                          <div key={blog.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="flex gap-4 items-center truncate">
                              <img src={blog.image} className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="truncate">
                                <h4 className={`font-bold text-sm truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>{blog.title}</h4>
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{blog.category} • {blog.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingBlog(blog);
                                  setBlogTitle(blog.title);
                                  setBlogExcerpt(blog.excerpt);
                                  setBlogContent(blog.content);
                                  setBlogCategory(blog.category);
                                  setBlogImage(blog.image);
                                  setBlogAuthorName(blog.author?.name || currentUser?.name || "Nexlify Admin");
                                  setBlogAuthorRole(blog.author?.role || currentUser?.role || "Administrator");
                                  setBlogAuthorAvatar(blog.author?.image || (blog.author as any)?.avatar || currentUser?.avatar || "");
                                  setShowBlogForm(true);
                                }}
                                className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- TAB: CAREERS CMS --- */}
                  {activeTab === "careers_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Careers CMS</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Publish and manage global talent openings at Nexlify Innovation.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingJob(null);
                            setJobTitle("");
                            setJobDept("Engineering");
                            setJobType("Full-time");
                            setJobLocation("Remote");
                            setJobExp("Mid-level");
                            setJobSalary("₦300k - ₦500k/mo");
                            setJobDesc("");
                            setJobReqs("");
                            setJobResps("");
                            setShowJobForm(true);
                          }}
                          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Publish Career Opening</span>
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {cmsJobs.map(job => (
                          <div key={job.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div>
                              <h4 className={`font-bold text-sm ${theme === "light" ? "text-slate-900" : "text-white"}`}>{job.title}</h4>
                              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{job.department} • {job.location} • {job.type}</span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingJob(job);
                                  setJobTitle(job.title);
                                  setJobDept(job.department);
                                  setJobType(job.type);
                                  setJobLocation(job.location);
                                  setJobExp(job.experience);
                                  setJobSalary(job.salary);
                                  setJobDesc(job.description);
                                  setJobReqs((job.requirements || []).join("\n"));
                                  setJobResps((job.responsibilities || []).join("\n"));
                                  setShowJobForm(true);
                                }}
                                className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- TAB: TRAINING CMS --- */}
                  {activeTab === "training_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Training CMS</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Publish, edit, and coordinate technical tech courses and cohort syllabi.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingCourse(null);
                            setCourseTitle("");
                            setCourseDuration("");
                            setCourseLevel("Beginner");
                            setCoursePrice("");
                            setCourseDesc("");
                            setCourseSyllabus("");
                            setCourseCohort("");
                            setCourseSpots(15);
                            setCourseImage("");
                            setCourseTags("");
                            setShowCourseForm(true);
                          }}
                          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Course</span>
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {cmsCourses.map(course => (
                          <div key={course.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="flex gap-4 items-center truncate">
                              <img src={course.image} className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="truncate">
                                <h4 className={`font-bold text-sm truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>{course.title}</h4>
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{course.duration} • {course.level} • {course.price}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingCourse(course);
                                  setCourseTitle(course.title);
                                  setCourseDuration(course.duration);
                                  setCourseLevel(course.level);
                                  setCoursePrice(course.price);
                                  setCourseDesc(course.description);
                                  setCourseSyllabus((course.syllabus || []).join("\n"));
                                  setCourseCohort(course.nextCohort);
                                  setCourseSpots(course.spotsLeft);
                                  setCourseImage(course.image);
                                  setCourseTags((course.tags || []).join(", "));
                                  setShowCourseForm(true);
                                }}
                                className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- TAB: ABOUT PAGE & TEAM CMS --- */}
                  {activeTab === "about_cms" && (
                    <div className="space-y-8 animate-fade-in">
                      {/* Top text updates */}
                      <div className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>About Page Texts</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Update corporate storytelling, vision statements, and primary site statistics.</p>
                        </div>

                        <form onSubmit={handleSaveAboutPageInfo} className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Page Sub-Header</label>
                            <input
                              type="text"
                              required
                              value={aboutTitle}
                              onChange={(e) => setAboutTitle(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Primary Mission/Story Text</label>
                            <textarea
                              rows={3}
                              required
                              value={aboutStory}
                              onChange={(e) => setAboutStory(e.target.value)}
                              className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Description Block</label>
                            <textarea
                              rows={3}
                              required
                              value={aboutDesc}
                              onChange={(e) => setAboutDesc(e.target.value)}
                              className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Vision Statement</label>
                            <textarea
                              rows={3}
                              required
                              value={aboutVision}
                              onChange={(e) => setAboutVision(e.target.value)}
                              className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Mission Statement</label>
                            <textarea
                              rows={3}
                              required
                              value={aboutMission}
                              onChange={(e) => setAboutMission(e.target.value)}
                              className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Future Header</label>
                            <input
                              type="text"
                              required
                              value={aboutFutureTitle}
                              onChange={(e) => setAboutFutureTitle(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Future Description</label>
                            <input
                              type="text"
                              required
                              value={aboutFutureDesc}
                              onChange={(e) => setAboutFutureDesc(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Metric Banner Count</label>
                            <input
                              type="text"
                              required
                              value={aboutFutureMetricCount}
                              onChange={(e) => setAboutFutureMetricCount(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Metric Banner Title</label>
                            <input
                              type="text"
                              required
                              value={aboutFutureMetricTitle}
                              onChange={(e) => setAboutFutureMetricTitle(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Metric Banner Subtitle</label>
                            <input
                              type="text"
                              required
                              value={aboutFutureMetricSubtitle}
                              onChange={(e) => setAboutFutureMetricSubtitle(e.target.value)}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                              }`}
                            />
                          </div>
                          <div className="sm:col-span-2 flex justify-end">
                            <button
                              type="submit"
                              disabled={isSavingAbout}
                              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                            >
                              {isSavingAbout ? "Saving..." : "Save About Texts"}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Team Member management roster */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-inherit">
                          <div>
                            <h4 className={`font-black text-lg ${theme === "light" ? "text-slate-900" : "text-white"}`}>Team Roster CMS</h4>
                            <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Add, edit, and coordinate staff profiles displaying on our platform.</p>
                          </div>
                          <button
                            onClick={() => {
                              setEditingTeam(null);
                              setTeamName("");
                              setTeamRole("");
                              setTeamBio("");
                              setTeamImage("");
                              setTeamLinkedin("");
                              setTeamTwitter("");
                              setTeamGithub("");
                              setShowTeamForm(true);
                            }}
                            className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-sm cursor-pointer flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Team Member</span>
                          </button>
                        </div>

                        <div className="grid gap-4">
                          {cmsTeam.map(member => (
                            <div key={member.name} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                              theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                            }`}>
                              <div className="flex gap-4 items-center truncate">
                                <img src={member.image} className="w-10 h-10 rounded-full object-cover border border-zinc-500/20" referrerPolicy="no-referrer" />
                                <div className="truncate">
                                  <h4 className={`font-bold text-sm truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>{member.name}</h4>
                                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{member.role}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingTeam(member);
                                    setTeamName(member.name);
                                    setTeamRole(member.role);
                                    setTeamBio(member.bio);
                                    setTeamImage(member.image);
                                    setTeamLinkedin(member.socials?.linkedin || "");
                                    setTeamTwitter(member.socials?.twitter || "");
                                    setTeamGithub(member.socials?.github || "");
                                    setShowTeamForm(true);
                                  }}
                                  className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTeamMemberObj(member.name)}
                                  className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: PORTFOLIO CMS --- */}
                  {activeTab === "portfolio_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Portfolio CMS</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Publish and showcase technical innovations, apps, and platforms built by Nexlify.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setProjectTitle("");
                            setProjectCategory(
                              currentUser?.role === "Designer"
                                ? "Graphic Designs"
                                : currentUser?.role === "Developer"
                                  ? "Websites"
                                  : "Websites"
                            );
                            setProjectDesc("");
                            setProjectLongDesc("");
                            setProjectImage("");
                            setProjectTags("");
                            setProjectLink("");
                            setShowProjectForm(true);
                          }}
                          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Project</span>
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {cmsProjects
                          .filter(p => {
                            const cat = normalizeProjectCategory(p.category);
                            if (currentUser?.role === "Designer") return cat === "Graphic Designs";
                            if (currentUser?.role === "Developer") return cat === "Websites";
                            return true;
                          })
                          .map(project => (
                            <div key={project.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="flex gap-4 items-center truncate">
                              <img src={project.image} className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="truncate">
                                <h4 className={`font-bold text-sm truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>{project.title}</h4>
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{normalizeProjectCategory(project.category)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingProject(project);
                                  setProjectTitle(project.title);
                                  setProjectCategory(project.category);
                                  setProjectDesc(project.description);
                                  setProjectLongDesc(project.longDescription || "");
                                  setProjectImage(project.image);
                                  setProjectTags((project.tags || []).join(", "));
                                  setProjectLink(project.link || "");
                                  setShowProjectForm(true);
                                }}
                                className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- TAB: SERVICES CMS --- */}
                  {activeTab === "services_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-inherit">
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Services CMS</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Publish, adjust, and structure engineering capabilities offered by Nexlify.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingService(null);
                            setServiceTitle("");
                            setServiceDesc("");
                            setServiceIcon("Cpu");
                            setServiceFeatures("");
                            setServiceImage("");
                            setShowServiceForm(true);
                          }}
                          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Service</span>
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {cmsServices.map(service => (
                          <div key={service.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div>
                              <h4 className={`font-bold text-sm ${theme === "light" ? "text-slate-900" : "text-white"}`}>{service.title}</h4>
                              <p className="text-[10px] text-zinc-500 font-bold max-w-md">{service.description}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingService(service);
                                  setServiceTitle(service.title);
                                  setServiceDesc(service.description);
                                  setServiceIcon(service.icon);
                                  setServiceFeatures((service.features || []).join("\n"));
                                  setServiceImage(service.image || "");
                                  setShowServiceForm(true);
                                }}
                                className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </main>

          </div>

          {/* EDIT NOTES MODALS AREA & CMS POPUP FORMS */}
          <AnimatePresence>
            {/* STAFF USER MODAL FORM */}
            {showStaffForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowStaffForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowStaffForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">Provision Staff Member</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Add a new team member with administrative access.</p>
                    </div>
                  </div>

                  {newStaffError && (
                    <div className="my-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                      {newStaffError}
                    </div>
                  )}
                  {newStaffSuccess && (
                    <div className="my-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                      {newStaffSuccess}
                    </div>
                  )}

                  <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={newStaffName}
                        onChange={e => setNewStaffName(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="s.jenkins@nexlify.com"
                        value={newStaffEmail}
                        onChange={e => setNewStaffEmail(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newStaffPassword}
                        onChange={e => setNewStaffPassword(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Assigned Role</label>
                      <select
                        value={newStaffRole}
                        onChange={e => setNewStaffRole(e.target.value as StaffUser["role"])}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Designer">Designer</option>
                        <option value="Developer">Developer</option>
                        <option value="Content Editor">Content Editor</option>
                        <option value="Customer Support">Customer Support</option>
                        <option value="CEO">CEO</option>
                      </select>
                    </div>

                    {/* LIVE PERMISSIONS PREVIEW BOX FOR SELECTED ROLE */}
                    {(() => {
                      const roleInfo = ROLE_PERMISSIONS_GUIDE[newStaffRole] || ROLE_PERMISSIONS_GUIDE["Employee"];
                      const permittedMods = ALL_SYSTEM_MODULES.filter(m => isTabPermitted(m.id, newStaffRole));
                      
                      return (
                        <div className={`p-4 rounded-2xl border space-y-3 ${
                          theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950 border-zinc-800"
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Access Scope Preview ({permittedMods.length} Modules)
                            </span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${roleInfo.badgeClass}`}>
                              {roleInfo.securityLevel}
                            </span>
                          </div>

                          <p className={`text-xs font-medium leading-relaxed ${theme === "light" ? "text-slate-600" : "text-zinc-400"}`}>
                            {roleInfo.summary}
                          </p>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                              Permitted Access Hubs:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {ALL_SYSTEM_MODULES.map(m => {
                                const ok = isTabPermitted(m.id, newStaffRole);
                                return (
                                  <span
                                    key={m.id}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                                      ok
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-black"
                                        : "bg-red-500/5 text-zinc-500 border-red-500/10 line-through opacity-40"
                                    }`}
                                  >
                                    {ok ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                                    {m.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowStaffForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={newStaffLoading}
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        {newStaffLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Provision User"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* ABOUT PAGE NARRATIVE MODAL FORM */}
            {showAboutForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAboutForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowAboutForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">Edit About Page Narrative</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Update mission, vision, and hero content for the public site.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAboutPageInfo} className="space-y-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Page Hero Title</label>
                      <input
                        type="text"
                        value={aboutTitle}
                        onChange={e => setAboutTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Headline Subtitle / Short Story</label>
                      <textarea
                        rows={2}
                        value={aboutStory}
                        onChange={e => setAboutStory(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Company Overview Narrative</label>
                      <textarea
                        rows={4}
                        value={aboutDesc}
                        onChange={e => setAboutDesc(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Company Vision</label>
                        <textarea
                          rows={3}
                          value={aboutVision}
                          onChange={e => setAboutVision(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Company Mission</label>
                        <textarea
                          rows={3}
                          value={aboutMission}
                          onChange={e => setAboutMission(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="p-4 border rounded-2xl space-y-3 bg-zinc-500/5 border-inherit">
                      <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary">Future Vision Section</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Future Title</label>
                          <input
                            type="text"
                            value={aboutFutureTitle}
                            onChange={e => setAboutFutureTitle(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                              theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Future Description</label>
                          <input
                            type="text"
                            value={aboutFutureDesc}
                            onChange={e => setAboutFutureDesc(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                              theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Metric Count</label>
                          <input
                            type="text"
                            value={aboutFutureMetricCount}
                            onChange={e => setAboutFutureMetricCount(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                              theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Metric Title</label>
                          <input
                            type="text"
                            value={aboutFutureMetricTitle}
                            onChange={e => setAboutFutureMetricTitle(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                              theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Metric Subtitle</label>
                          <input
                            type="text"
                            value={aboutFutureMetricSubtitle}
                            onChange={e => setAboutFutureMetricSubtitle(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                              theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowAboutForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingAbout}
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        {isSavingAbout ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* TEAM MEMBER MODAL FORM */}
            {showTeamForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowTeamForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowTeamForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{editingTeam ? "Edit Team Member" : "Add Team Member"}</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Upload photo, enter member name, role, and optional bio.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveTeamMemberObj} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Member Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Alex Vance"
                          value={teamName}
                          onChange={e => setTeamName(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Role / Position <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lead Designer / Developer"
                          value={teamRole}
                          onChange={e => setTeamRole(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <ImageUploadField
                      label="Upload Member Photo / Image (Optional)"
                      value={teamImage}
                      onChange={setTeamImage}
                      placeholder="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
                      theme={theme}
                    />

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Member Biography / Notes <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Brief bio or description (optional)..."
                        value={teamBio}
                        onChange={e => setTeamBio(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          LinkedIn <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/..."
                          value={teamLinkedin}
                          onChange={e => setTeamLinkedin(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Twitter <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://twitter.com/..."
                          value={teamTwitter}
                          onChange={e => setTeamTwitter(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          GitHub <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://github.com/..."
                          value={teamGithub}
                          onChange={e => setTeamGithub(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowTeamForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        {editingTeam ? "Update Member" : "Save Member"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* BLOG / INSIGHT MODAL FORM */}
            {showBlogForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowBlogForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowBlogForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{editingBlog ? "Edit Insight Article" : "Publish New Insight"}</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Upload banner image, enter title, and optional article content.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveBlog} className="space-y-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Article Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern UI Design Trends in 2026"
                        value={blogTitle}
                        onChange={e => setBlogTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <ImageUploadField
                      label="Upload Article Cover Image / Design (Optional)"
                      value={blogImage}
                      onChange={setBlogImage}
                      placeholder="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                      theme={theme}
                    />

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Category <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <select
                          value={blogCategory}
                          onChange={e => setBlogCategory(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        >
                          <option value="Technology">Technology</option>
                          <option value="Design">Design</option>
                          <option value="AI & Engineering">AI & Engineering</option>
                          <option value="Case Studies">Case Studies</option>
                          <option value="Industry Trends">Industry Trends</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Short Excerpt / Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief description or summary (optional)..."
                        value={blogExcerpt}
                        onChange={e => setBlogExcerpt(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Full Article Content <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Article details and full text (optional)..."
                        value={blogContent}
                        onChange={e => setBlogContent(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowBlogForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        {editingBlog ? "Update Article" : "Publish Article"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* JOB / CAREER OPENING MODAL FORM */}
            {showJobForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowJobForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowJobForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{editingJob ? "Edit Career Opportunity" : "Post New Career Opening"}</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Enter position title and optional role details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveJob} className="space-y-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Position Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UI/UX Designer / Software Engineer"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Department <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <select
                          value={jobDept}
                          onChange={e => setJobDept(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Product">Product</option>
                          <option value="Support">Support</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Employment Type <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <select
                          value={jobType}
                          onChange={e => setJobType(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Location <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Remote / Lagos"
                          value={jobLocation}
                          onChange={e => setJobLocation(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Experience Level <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mid-level (2+ Yrs)"
                          value={jobExp}
                          onChange={e => setJobExp(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Salary Range <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₦300k - ₦500k/mo"
                          value={jobSalary}
                          onChange={e => setJobSalary(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Job Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Overview of the role (optional)..."
                        value={jobDesc}
                        onChange={e => setJobDesc(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Key Requirements <span className="text-xs font-normal text-slate-400">(Optional - One per line)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Key requirements (optional)..."
                        value={jobReqs}
                        onChange={e => setJobReqs(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Benefits & Perks <span className="text-xs font-normal text-slate-400">(Optional - One per line)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Perks and benefits (optional)..."
                        value={jobResps}
                        onChange={e => setJobResps(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowJobForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        {editingJob ? "Update Opening" : "Post Opening"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* TRAINING COURSE MODAL FORM */}
            {showCourseForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCourseForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowCourseForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{editingCourse ? "Edit Course Syllabus" : "Create Training Program"}</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Upload banner image, title, and optional course details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveCourse} className="space-y-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UI/UX & Web Development Course"
                        value={courseTitle}
                        onChange={e => setCourseTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <ImageUploadField
                      label="Upload Course Banner / Design (Optional)"
                      value={courseImage}
                      onChange={setCourseImage}
                      placeholder="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
                      theme={theme}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Pricing <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₦150,000 / Free"
                          value={coursePrice}
                          onChange={e => setCoursePrice(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Duration <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 12 Weeks"
                          value={courseDuration}
                          onChange={e => setCourseDuration(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Level <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <select
                          value={courseLevel}
                          onChange={e => setCourseLevel(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Start Date <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Next Batch / Open"
                          value={courseCohort}
                          onChange={e => setCourseCohort(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Available Spots <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="15"
                          value={courseSpots}
                          onChange={e => setCourseSpots(parseInt(e.target.value) || 15)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Program Overview <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Summary of learning outcomes (optional)..."
                        value={courseDesc}
                        onChange={e => setCourseDesc(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Syllabus Modules <span className="text-xs font-normal text-slate-400">(Optional - One per line)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Module 1: Design Fundamentals&#10;Module 2: Practical Projects"
                        value={courseSyllabus}
                        onChange={e => setCourseSyllabus(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Tags / Prerequisites <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Figma, React, UI/UX"
                        value={courseTags}
                        onChange={e => setCourseTags(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowCourseForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        {editingCourse ? "Update Program" : "Save Program"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* PORTFOLIO PROJECT / DESIGN MODAL FORM */}
            {showProjectForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowProjectForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowProjectForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Layout className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{editingProject ? "Edit Design / Portfolio Showcase" : "Add Design / Portfolio Showcase"}</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Upload design, enter title, and optional description.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Design / Item Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Brand Identity / E-Commerce Website Design"
                        value={projectTitle}
                        onChange={e => setProjectTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <ImageUploadField
                      label="Upload Design / Preview Image (Optional)"
                      value={projectImage}
                      onChange={setProjectImage}
                      placeholder="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                      theme={theme}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Category <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <select
                          value={projectCategory}
                          disabled={currentUser?.role === "Designer" || currentUser?.role === "Developer"}
                          onChange={e => setProjectCategory(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        >
                          <option value="Graphic Designs">Graphic Designs</option>
                          <option value="Websites">Websites</option>
                          <option value="Mobile Apps">Mobile Apps</option>
                          <option value="Cloud Engineering">Cloud Engineering</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Live Project Link <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com"
                          value={projectLink}
                          onChange={e => setProjectLink(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Technologies / Tools Used <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Figma, Photoshop, React, Tailwind"
                        value={projectTags}
                        onChange={e => setProjectTags(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Small Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary or description of the design (optional)..."
                        value={projectDesc}
                        onChange={e => setProjectDesc(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Full Case Study / Details <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detailed design breakdown or project case study (optional)..."
                        value={projectLongDesc}
                        onChange={e => setProjectLongDesc(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowProjectForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        {editingProject ? "Update Item" : "Publish Item"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* SERVICE MODAL FORM */}
            {showServiceForm && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowServiceForm(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 0 }}
                  className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setShowServiceForm(false)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light" ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{editingService ? "Edit Service Capability" : "Add Service Offering"}</h3>
                      <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Upload design image, title, icon, and optional description.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Service Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Brand & Graphic Design"
                          value={serviceTitle}
                          onChange={e => setServiceTitle(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                          Icon Name <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Layout, Cpu, Code, Server"
                          value={serviceIcon}
                          onChange={e => setServiceIcon(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold ${
                            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <ImageUploadField
                      label="Upload Service Header Image / Design (Optional)"
                      value={serviceImage}
                      onChange={setServiceImage}
                      placeholder="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                      theme={theme}
                    />

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Service Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Small description of the service (optional)..."
                        value={serviceDesc}
                        onChange={e => setServiceDesc(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Key Deliverables & Features <span className="text-xs font-normal text-slate-400">(Optional - One per line)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Key feature 1&#10;Key feature 2"
                        value={serviceFeatures}
                        onChange={e => setServiceFeatures(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none font-semibold resize-none ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setShowServiceForm(false)}
                        className={`w-1/2 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light" ? "border-slate-200 text-slate-500 hover:bg-slate-50" : "border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        {editingService ? "Update Service" : "Save Service"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* LOG NOTES MODAL */}
            {(editingBooking || editingMessage) && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setEditingBooking(null);
                    setEditingMessage(null);
                  }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className={`relative w-full max-w-lg border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 overflow-hidden transition-all duration-300 ${
                    theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-850"
                  }`}
                >
                  <button 
                    onClick={() => {
                      setEditingBooking(null);
                      setEditingMessage(null);
                    }}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light"
                        ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800"
                        : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className={`font-bold text-lg mb-1 tracking-tight flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                    <Edit3 className="w-4 h-4 text-brand-primary" /> Update Internal Log
                  </h3>
                  <p className={`text-xs mb-6 ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                    Add action records, client call responses, or private notes for this lead record.
                  </p>

                  <div className="space-y-4">
                    <textarea
                      rows={4}
                      placeholder="e.g. Called Alhaji Ibrahim. Confirmed details and set date for follow up proposal delivery on Monday..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold resize-none ${
                        theme === "light"
                          ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                          : "bg-zinc-950 border-zinc-850 text-white placeholder-zinc-655"
                      }`}
                    />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBooking(null);
                          setEditingMessage(null);
                        }}
                        className={`w-1/2 py-3 border rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                          theme === "light"
                            ? "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                            : "border-zinc-850 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={editingBooking ? handleSaveBookingNote : handleSaveMessageNote}
                        disabled={savingNote}
                        className="w-1/2 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition-all cursor-pointer"
                      >
                        {savingNote ? (
                          <>Saving Note <Loader2 className="w-4 h-4 animate-spin" /></>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* POPUP CONFIRMATION MODAL FOR ITEM DELETION */}
            {deleteConfirmState.isOpen && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteConfirmState({ isOpen: false, title: "", onConfirm: () => {} })}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className={`relative w-full max-w-md border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 overflow-hidden transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setDeleteConfirmState({ isOpen: false, title: "", onConfirm: () => {} })}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light"
                        ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 min-w-0 flex-grow pt-0.5">
                      <span className="text-[10px] font-black uppercase text-red-500 tracking-widest block">Action Requires Confirmation</span>
                      <h3 className="font-display font-black text-lg tracking-tight">Confirm Deletion</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                        {deleteConfirmState.title || "Are you sure you want to delete this item? This action cannot be undone."}
                      </p>
                      {deleteConfirmState.itemLabel && (
                        <div className={`mt-3 p-3 rounded-xl border text-xs font-bold truncate ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-zinc-950 border-zinc-800/80 text-zinc-300"
                        }`}>
                          {deleteConfirmState.itemLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmState({ isOpen: false, title: "", onConfirm: () => {} })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        theme === "light" 
                          ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700" 
                          : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmFn = deleteConfirmState.onConfirm;
                        setDeleteConfirmState({ isOpen: false, title: "", onConfirm: () => {} });
                        confirmFn();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Confirm Delete</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* RESET STAFF PASSWORD MODAL */}
          <AnimatePresence>
            {resetStaffModalEmail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setResetStaffModalEmail(null)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className={`relative w-full max-w-md border rounded-[2rem] shadow-2xl z-10 p-6 sm:p-8 overflow-hidden transition-all ${
                    theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-zinc-900 border-zinc-800 text-white"
                  }`}
                >
                  <button
                    onClick={() => setResetStaffModalEmail(null)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      theme === "light"
                        ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      <Key className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-grow pt-0.5">
                      <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest block">Administrative Credential Override</span>
                      <h3 className="font-display font-black text-lg tracking-tight">Reset Staff Password</h3>
                      <p className="text-xs text-zinc-400 font-medium truncate">
                        Account: <strong className="text-brand-primary">{resetStaffModalEmail}</strong>
                      </p>
                    </div>
                  </div>

                  {resetStaffErrorMsg && (
                    <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{resetStaffErrorMsg}</span>
                    </div>
                  )}

                  {resetStaffSuccessMsg && (
                    <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{resetStaffSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminResetPassword} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-zinc-500">
                        New Account Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={resetStaffNewPass}
                        onChange={e => setResetStaffNewPass(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:border-brand-primary focus:outline-none transition-colors ${
                          theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-800 text-white"
                        }`}
                      />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                      <button
                        type="button"
                        onClick={() => setResetStaffModalEmail(null)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          theme === "light" 
                            ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700" 
                            : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-primary/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
