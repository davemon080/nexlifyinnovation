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
  ArrowRight,
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
  Users
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
  registerStaffUser,
  loginStaffUser,
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
  AboutPageData
} from "../lib/db";
import { Service, Project, Course, TeamMember, BlogPost, JobOpening } from "../types";

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
  const [authRole, setAuthRole] = useState<"CEO" | "Employee">("Employee");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data State
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);

  // UI Active State
  const [activeTab, setActiveTab] = useState<"bookings" | "messages" | "careers" | "insights_cms" | "careers_cms" | "training_cms" | "about_cms" | "portfolio_cms" | "services_cms" | "staff">("bookings");
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // CMS Lists state
  const [cmsServices, setCmsServices] = useState<Service[]>([]);
  const [cmsProjects, setCmsProjects] = useState<Project[]>([]);
  const [cmsCourses, setCmsCourses] = useState<Course[]>([]);
  const [cmsBlogs, setCmsBlogs] = useState<BlogPost[]>([]);
  const [cmsJobs, setCmsJobs] = useState<JobOpening[]>([]);
  const [cmsAboutPage, setCmsAboutPage] = useState<AboutPageData | null>(null);
  const [cmsTeam, setCmsTeam] = useState<TeamMember[]>([]);

  // Interaction Modal States
  const [editingBooking, setEditingBooking] = useState<Consultation | null>(null);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // New Staff user form (Inside CEO tab)
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"CEO" | "Employee">("Employee");
  const [newStaffError, setNewStaffError] = useState("");
  const [newStaffSuccess, setNewStaffSuccess] = useState("");
  const [newStaffLoading, setNewStaffLoading] = useState(false);

  // CMS Form States
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Technology");
  const [blogReadTime, setBlogReadTime] = useState("5 mins read");
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
        setCurrentUser(JSON.parse(session));
      } catch {
        sessionStorage.removeItem("nexlify_admin_session");
      }
    }
    setDbStatus(isFirebaseConnected());
  }, []);

  // Fetch dashboard data
  const loadDashboardData = async () => {
    if (!currentUser) return;
    setDataLoading(true);
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
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
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
        setCurrentUser(result);
        sessionStorage.setItem("nexlify_admin_session", JSON.stringify(result));
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
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      const ok = await deleteConsultation(id);
      if (ok) {
        setConsultations(prev => prev.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
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
    if (!confirm("Are you sure you want to permanently delete this contact record?")) return;
    try {
      const ok = await deleteContactMessage(id);
      if (ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
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
    if (!confirm("Are you sure you want to permanently delete this application?")) return;
    try {
      const ok = await deleteJobApplication(id);
      if (ok) {
        setApplications(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Update Staff Role (CEO ONLY)
  const handleToggleStaffRole = async (email: string, currentRole: "CEO" | "Employee") => {
    if (currentUser?.role !== "CEO") return;
    const targetRole = currentRole === "CEO" ? "Employee" : "CEO";
    if (email.toLowerCase() === currentUser.email.toLowerCase()) {
      alert("You cannot demote or promote yourself directly. Safety protection active.");
      return;
    }
    try {
      const ok = await updateStaffRole(email, targetRole);
      if (ok) {
        setStaffList(prev => prev.map(s => s.email.toLowerCase() === email.toLowerCase() ? { ...s, role: targetRole } : s));
      }
    } catch (e) {
      console.error(e);
    }
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
    if (!serviceTitle || !serviceDesc) return;
    const serviceObj: Service = {
      id: editingService ? editingService.id : `srv-${Math.random().toString(36).substring(2, 9)}`,
      title: serviceTitle,
      description: serviceDesc,
      icon: serviceIcon,
      features: serviceFeatures.split("\n").map(f => f.trim()).filter(f => f.length > 0),
      longDescription: serviceDesc,
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
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      setCmsServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Project / Portfolio handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDesc) return;
    const projectObj: Project = {
      id: editingProject ? editingProject.id : `prj-${Math.random().toString(36).substring(2, 9)}`,
      title: projectTitle,
      client: "Nexlify Client",
      category: projectCategory,
      image: projectImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      problem: projectDesc,
      solution: projectLongDesc || projectDesc,
      tech: projectTags.split(",").map(t => t.trim()).filter(t => t.length > 0),
      timeline: "3 Months",
      outcome: "Successfully launched with excellent initial performance metrics.",
      createdAt: editingProject ? (editingProject.createdAt || Date.now()) : Date.now(),
      feedback: {
        quote: "Working with Nexlify was a game changer for our operations.",
        author: "John Doe",
        role: "Head of Operations"
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
      setProjectCategory("Websites");
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setCmsProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Training / Course handlers
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !coursePrice || !courseDuration) return;
    const courseObj: Course = {
      id: editingCourse ? editingCourse.id : `crs-${Math.random().toString(36).substring(2, 9)}`,
      title: courseTitle,
      price: coursePrice,
      duration: courseDuration,
      variant: "primary",
      features: courseSyllabus.split("\n").map(s => s.trim()).filter(s => s.length > 0),
      requirements: courseTags.split(",").map(t => t.trim()).filter(t => t.length > 0),
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
    if (!confirm("Are you sure you want to delete this training course?")) return;
    try {
      await deleteCourse(id);
      setCmsCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Insights / Blog handlers
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    const blogObj: BlogPost = {
      id: editingBlog ? editingBlog.id : `blog-${Math.random().toString(36).substring(2, 9)}`,
      title: blogTitle,
      excerpt: blogExcerpt || blogContent.substring(0, 150) + "...",
      content: blogContent,
      category: blogCategory,
      readTime: blogReadTime,
      date: editingBlog ? editingBlog.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: blogImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      author: {
        name: blogAuthorName || currentUser?.name || "Nexlify Admin",
        role: blogAuthorRole || currentUser?.role || "Administrator",
        image: blogAuthorAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
      setBlogReadTime("5 mins read");
      setBlogImage("");
      setBlogAuthorName("");
      setBlogAuthorRole("");
      setBlogAuthorAvatar("");
      setShowBlogForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteBlog(id);
      setCmsBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Job / Careers handlers
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) return;
    const jobObj: JobOpening = {
      id: editingJob ? editingJob.id : `job-${Math.random().toString(36).substring(2, 9)}`,
      title: jobTitle,
      department: jobDept,
      location: jobLocation,
      type: jobType,
      description: `${jobDesc}\n\nExperience Required: ${jobExp}\nOffered Salary: ${jobSalary}`,
      requirements: jobReqs.split("\n").map(r => r.trim()).filter(r => r.length > 0),
      benefits: jobResps.split("\n").map(r => r.trim()).filter(r => r.length > 0)
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
    if (!confirm("Are you sure you want to delete this job career opening?")) return;
    try {
      await deleteJob(id);
      setCmsJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      console.error(err);
    }
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
      alert("Successfully saved updated About Page texts!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleSaveTeamMemberObj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !teamRole) return;
    const teamObj: TeamMember = {
      name: teamName,
      role: teamRole,
      bio: teamBio,
      image: teamImage || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
      socials: {
        linkedin: teamLinkedin || undefined,
        twitter: teamTwitter || undefined,
        github: teamGithub || undefined
      }
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
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;
    try {
      await deleteTeamMember(name);
      setCmsTeam(prev => prev.filter(t => t.name.toLowerCase() !== name.toLowerCase()));
    } catch (err) {
      console.error(err);
    }
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

              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                {isRegistering && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Israel Ujah"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none transition-all ${
                          theme === "light" 
                            ? "bg-slate-50 border-slate-200 text-slate-950 placeholder-slate-400" 
                            : "bg-zinc-950 border-zinc-850 text-white placeholder-zinc-600"
                        }`}
                      />
                    </div>
                  </div>
                )}

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

                {isRegistering && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Select Registration Access Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthRole("Employee")}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold uppercase transition-all ${
                          authRole === "Employee"
                            ? "bg-zinc-850 border-zinc-750 text-white"
                            : theme === "light"
                              ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                              : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Employee Role
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole("CEO")}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold uppercase transition-all ${
                          authRole === "CEO"
                            ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary"
                            : theme === "light"
                              ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                              : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        CEO Role
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-brand-primary/15 transition-all cursor-pointer"
                >
                  {authLoading ? (
                    <>Authenticating <Loader2 className="w-4 h-4 animate-spin" /></>
                  ) : (
                    <>{isRegistering ? "Provision Account" : "Access Console"} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className={`mt-6 pt-4 border-t flex justify-between items-center text-[11px] font-medium ${
                theme === "light" ? "border-slate-150 text-slate-500" : "border-zinc-850/60 text-zinc-500"
              }`}>
                <span>
                  {isRegistering ? "Already have access?" : "Need an account?"}
                </span>
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setAuthError("");
                  }}
                  className="text-brand-primary hover:underline font-bold cursor-pointer"
                >
                  {isRegistering ? "Sign in to existing Profile" : "Register new Staff Profile"}
                </button>
              </div>
            </motion.div>

            {/* Quick Credentials helper tooltips */}
            <div className={`mt-6 p-4 rounded-2xl border space-y-2.5 shadow-lg ${
              theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/50 border-zinc-850"
            }`}>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">Predefined Credentials (Test immediately):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border text-left ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                }`}>
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1">CEO Role (Full Access)</span>
                  <p className="text-[11px] font-bold">Email: <span className={theme === "light" ? "text-slate-900" : "text-white"}>ceo@nexlify.com</span></p>
                  <p className="text-[11px] font-bold">Pass: <span className={theme === "light" ? "text-slate-900" : "text-white"}>ceopassword123</span></p>
                </div>
                <div className={`p-3 rounded-xl border text-left ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-950/40 border-zinc-900"
                }`}>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Employee (Staff Access)</span>
                  <p className="text-[11px] font-bold">Email: <span className={theme === "light" ? "text-slate-900" : "text-white"}>employee@nexlify.com</span></p>
                  <p className="text-[11px] font-bold">Pass: <span className={theme === "light" ? "text-slate-900" : "text-white"}>employeepassword123</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== ACTIVE ADMIN CONSOLE (SIDEBAR + CONTENT LAYOUT) ==================== */
        <div className="flex min-h-screen">
          
          {/* DESKTOP SIDEBAR MENU (Fixed on left) */}
          <aside className={`hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 border-r z-30 transition-all duration-300 ${
            theme === "light" ? "bg-white border-slate-200 text-slate-800" : "bg-zinc-950 border-zinc-900 text-zinc-100"
          }`}>
            {/* Logo area */}
            <div className="p-6 border-b border-inherit flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden border border-white/5 shadow-lg shrink-0">
                <img src="https://iili.io/Bp0LZ3Q.jpg" alt="Nexlify Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className={`font-display font-black text-base tracking-tight block ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                  Nexlify <span className="text-brand-primary">Innovation</span>
                </span>
                <span className="text-[9px] font-black uppercase text-brand-primary tracking-widest block">Admin Console</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mb-2 ${
                theme === "light" ? "text-slate-400" : "text-zinc-500"
              }`}>
                Management Console
              </span>

              {[
                { id: "bookings", icon: Calendar, label: "Bookings", count: consultations.length },
                { id: "messages", icon: MessageSquare, label: "Inbox", count: messages.filter(m => !m.read).length, countBadge: true },
                { id: "careers", icon: Users, label: "Applications", count: applications.filter(a => a.status === "Reviewing").length, countBadge: true }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSearchTerm("");
                      setStatusFilter("ALL");
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                        : theme === "light"
                          ? "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive 
                          ? "bg-brand-primary text-white" 
                          : tab.countBadge 
                            ? "bg-brand-primary/25 text-brand-primary border border-brand-primary/10 animate-pulse" 
                            : theme === "light"
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : "bg-zinc-900 text-zinc-400 border border-zinc-850"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mt-6 mb-2 ${
                theme === "light" ? "text-slate-400" : "text-zinc-500"
              }`}>
                Dynamic Site CMS
              </span>

              {[
                { id: "insights_cms", icon: BookOpen, label: "Publish Insights" },
                { id: "careers_cms", icon: Briefcase, label: "Publish Careers" },
                { id: "training_cms", icon: GraduationCap, label: "Edit Training" },
                { id: "about_cms", icon: Info, label: "Update About Page" },
                { id: "portfolio_cms", icon: Layout, label: "Update Portfolio" },
                { id: "services_cms", icon: Layers, label: "Update Services" }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSearchTerm("");
                      setStatusFilter("ALL");
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                        : theme === "light"
                          ? "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}

              <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mt-6 mb-2 ${
                theme === "light" ? "text-slate-400" : "text-zinc-500"
              }`}>
                Security & Staff
              </span>

              {[
                { id: "staff", icon: Settings, label: "Security & Staff", locked: currentUser.role !== "CEO", labelBadge: "CEO Only" }
              ].map((tab) => {
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
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                        : theme === "light"
                          ? "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.locked && (
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest shrink-0">
                        {tab.labelBadge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-inherit my-4">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mb-2 ${
                  theme === "light" ? "text-slate-400" : "text-zinc-500"
                }`}>
                  External Actions
                </span>
                
                {setView && (
                  <button
                    onClick={() => setView("home")}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      theme === "light"
                        ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Back to Main Site</span>
                  </button>
                )}
              </div>
            </nav>

            {/* Sidebar Bottom Part: Theme toggle and User profile badge */}
            <div className="p-4 border-t border-inherit space-y-4">
              {/* Theme toggle switch */}
              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                theme === "light" ? "bg-slate-50 border-slate-150" : "bg-zinc-900/60 border-zinc-900"
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider pl-2 ${
                  theme === "light" ? "text-slate-500" : "text-zinc-400"
                }`}>
                  Theme: {theme}
                </span>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    theme === "light" ? "bg-white border-slate-250 text-amber-500 shadow-sm" : "bg-zinc-950 border-zinc-850 text-indigo-400"
                  }`}
                  title="Toggle Visual Theme"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* User profile details */}
              <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                theme === "light" ? "bg-slate-50 border-slate-150" : "bg-zinc-900/40 border-zinc-900"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate flex-grow">
                    <span className={`text-xs font-black block truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] font-black uppercase text-brand-primary tracking-wider">
                      {currentUser.role} Account
                    </span>
                  </div>
                </div>
                
                {/* Logout action */}
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border border-red-500/20 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN PANE (Displaced to the right on desktop) */}
          <div className="flex-grow lg:pl-72 flex flex-col min-h-screen">
            
            {/* TOP BAR / MOBILE NAVBAR */}
            <header className={`px-6 py-4 border-b flex items-center justify-between transition-all duration-300 z-20 ${
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
                  <h2 className={`text-sm font-black uppercase tracking-wider ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                    Nexlify Admin <span className="text-brand-primary font-bold">Console</span>
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Workspace Management</p>
                </div>
              </div>

              {/* Right Status utilities */}
              <div className="flex items-center gap-4">
                {/* Quick theme toggle for smaller viewports */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`lg:hidden p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    theme === "light" ? "bg-white border-slate-200 text-amber-500 shadow-sm" : "bg-zinc-900 border-zinc-850 text-indigo-400"
                  }`}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Database Connection Node */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-inner ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-900/80 border-zinc-850"
                }`}>
                  <Database className="w-3.5 h-3.5 text-zinc-400" />
                  <span className={`hidden md:inline text-[9px] font-black tracking-wider uppercase ${
                    theme === "light" ? "text-slate-500" : "text-zinc-400"
                  }`}>Storage Node:</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${dbStatus ? "bg-green-500" : "bg-amber-500"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${dbStatus ? "text-green-500" : "text-amber-500"}`}>
                      {dbStatus ? "LIVE" : "SANDBOX"}
                    </span>
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className={`text-[9px] font-black uppercase tracking-wider ${
                    theme === "light" ? "text-slate-500" : "text-zinc-400"
                  }`}>
                    Authenticated
                  </span>
                </div>
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
                      theme === "light" ? "bg-white border-slate-200 text-slate-800" : "bg-zinc-950 border-zinc-900 text-zinc-100"
                    }`}
                  >
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-inherit flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                          <img src="https://iili.io/Bp0LZ3Q.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className={`font-display font-black text-sm tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                          Nexlify Admin
                        </span>
                      </div>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`p-2 rounded-lg border cursor-pointer ${
                          theme === "light" ? "bg-slate-50 border-slate-200" : "bg-zinc-900 border-zinc-850"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Drawer middle content */}
                    <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mb-2 ${
                        theme === "light" ? "text-slate-400" : "text-zinc-500"
                      }`}>
                        Management Console
                      </span>

                      {[
                        { id: "bookings", icon: Calendar, label: "Bookings", count: consultations.length },
                        { id: "messages", icon: MessageSquare, label: "Inbox", count: messages.filter(m => !m.read).length, countBadge: true },
                        { id: "careers", icon: Users, label: "Applications", count: applications.filter(a => a.status === "Reviewing").length, countBadge: true }
                      ].map((tab) => {
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
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                                : theme === "light"
                                  ? "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                  : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <tab.icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                              <span>{tab.label}</span>
                            </div>

                            {tab.count !== undefined && tab.count > 0 && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                isActive 
                                  ? "bg-brand-primary text-white" 
                                  : tab.countBadge 
                                    ? "bg-brand-primary/25 text-brand-primary border border-brand-primary/10" 
                                    : theme === "light"
                                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                                      : "bg-zinc-900 text-zinc-400 border border-zinc-850"
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        );
                      })}

                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mt-6 mb-2 ${
                        theme === "light" ? "text-slate-400" : "text-zinc-500"
                      }`}>
                        Dynamic Site CMS
                      </span>

                      {[
                        { id: "insights_cms", icon: BookOpen, label: "Publish Insights" },
                        { id: "careers_cms", icon: Briefcase, label: "Publish Careers" },
                        { id: "training_cms", icon: GraduationCap, label: "Edit Training" },
                        { id: "about_cms", icon: Info, label: "Update About Page" },
                        { id: "portfolio_cms", icon: Layout, label: "Update Portfolio" },
                        { id: "services_cms", icon: Layers, label: "Update Services" }
                      ].map((tab) => {
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
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                                : theme === "light"
                                  ? "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                  : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <tab.icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                              <span>{tab.label}</span>
                            </div>
                          </button>
                        );
                      })}

                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 block mt-6 mb-2 ${
                        theme === "light" ? "text-slate-400" : "text-zinc-500"
                      }`}>
                        Security & Staff
                      </span>

                      {[
                        { id: "staff", icon: Settings, label: "Security & Staff", locked: currentUser.role !== "CEO", labelBadge: "CEO Only" }
                      ].map((tab) => {
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
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5"
                                : theme === "light"
                                  ? "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                  : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <tab.icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : theme === "light" ? "text-slate-400" : "text-zinc-500"}`} />
                              <span>{tab.label}</span>
                            </div>

                            {tab.locked && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest shrink-0">
                                {tab.labelBadge}
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {setView && (
                        <div className="pt-4 border-t border-inherit mt-4">
                          <button
                            onClick={() => {
                              setView("home");
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              theme === "light"
                                ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                            }`}
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            <span>Back to Main Site</span>
                          </button>
                        </div>
                      )}
                    </nav>

                    {/* Drawer bottom content */}
                    <div className="p-4 border-t border-inherit space-y-4">
                      <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                        theme === "light" ? "bg-slate-50 border-slate-150" : "bg-zinc-900/40 border-zinc-900"
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs shadow-md">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate flex-grow">
                            <span className={`text-xs font-black block truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                              {currentUser.name}
                            </span>
                            <span className="text-[9px] font-black uppercase text-brand-primary tracking-wider">
                              {currentUser.role} Account
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border border-red-500/20 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* MAIN WORKSPACE WRAPPER (Scrollable core) */}
            <main className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto">
              
              {/* ANALYTICS BENTO BOARD GRID */}
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
                      {dataLoading ? "..." : consultations.length}
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
                      {dataLoading ? "..." : messages.length}
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
                      {dataLoading ? "..." : applications.length}
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
                  
                  {dataLoading && (
                    <div className="p-12 text-center text-zinc-500 font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                      Syncing Administrative Node...
                    </div>
                  )}

                  {/* --- TAB 1: CONSULTATIONS --- */}
                  {!dataLoading && activeTab === "bookings" && (
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
                  {!dataLoading && activeTab === "messages" && (
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
                  {!dataLoading && activeTab === "careers" && (
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

                  {/* --- TAB 4: SECURITY & STAFF (CEO ONLY) --- */}
                  {!dataLoading && activeTab === "staff" && (
                    <>
                      {currentUser.role !== "CEO" ? (
                        /* LOCKED VIEW TRIGGER */
                        <div className={`p-8 text-center border rounded-3xl space-y-4 ${
                          theme === "light" ? "bg-slate-100/30 border-slate-200" : "bg-zinc-950/10 border-zinc-900"
                        }`}>
                          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Lock className="w-5 h-5 animate-pulse" />
                          </div>
                          <h4 className={`font-bold text-base ${theme === "light" ? "text-slate-900" : "text-white"}`}>CEO Credentials Required</h4>
                          <p className={`text-xs leading-relaxed max-w-xs mx-auto ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>
                            You are currently signed in as an **Employee**. Security logs, database rules, and administrative staff management are restricted to Chief Executive access.
                          </p>
                        </div>
                      ) : (
                        /* ACTIVE ROSTER MANAGEMENT */
                        <div className="space-y-6">
                          
                          {/* ROSTER LISTING */}
                          <div className={`p-6 border rounded-3xl space-y-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Active Administration Roster</span>
                            
                            <div className={`divide-y ${theme === "light" ? "divide-slate-150" : "divide-zinc-850"}`}>
                              {staffList.map((staff) => {
                                const isSelf = staff.email.toLowerCase() === currentUser.email.toLowerCase();
                                return (
                                  <div key={staff.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                    <div>
                                      <h5 className={`font-bold text-xs sm:text-sm ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                                        {staff.name} 
                                        {isSelf && <span className="text-[9px] font-bold text-brand-primary px-1.5 py-0.5 bg-brand-primary/10 rounded tracking-widest uppercase ml-1.5">You</span>}
                                      </h5>
                                      <span className={`text-[10px] font-semibold ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>{staff.email}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => handleToggleStaffRole(staff.email, staff.role)}
                                        disabled={isSelf}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider focus:outline-none border transition-all ${
                                          isSelf 
                                            ? theme === "light"
                                              ? "bg-slate-100 text-slate-300 border-slate-150 cursor-not-allowed"
                                              : "bg-zinc-950 text-zinc-600 border-zinc-900 cursor-not-allowed" 
                                            : theme === "light"
                                              ? "bg-white hover:bg-slate-550/10 text-brand-primary border-brand-primary/25 cursor-pointer shadow-sm"
                                              : "bg-zinc-900 hover:bg-zinc-850 text-brand-primary border-brand-primary/20 cursor-pointer"
                                        }`}
                                      >
                                        Role: {staff.role}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* REGISTER NEW STAFF MODULE */}
                          <div className={`p-6 border rounded-3xl relative overflow-hidden transition-all ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4 flex items-center gap-1.5">
                              <UserPlus className="w-4 h-4 text-brand-primary" /> Provision New Administrator Profile
                            </span>

                            {newStaffError && (
                              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-medium mb-4">
                                {newStaffError}
                              </div>
                            )}

                            {newStaffSuccess && (
                              <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-xl font-medium mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                <span>{newStaffSuccess}</span>
                              </div>
                            )}

                            <form onSubmit={handleAddStaff} className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Divine Favor"
                                  value={newStaffName}
                                  onChange={(e) => setNewStaffName(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light"
                                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                                      : "bg-zinc-950 border-zinc-850 text-white placeholder-zinc-655"
                                  }`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Staff Email</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="email@nexlify.com"
                                  value={newStaffEmail}
                                  onChange={(e) => setNewStaffEmail(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light"
                                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                                      : "bg-zinc-950 border-zinc-850 text-white placeholder-zinc-655"
                                  }`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Initial Password</label>
                                <input
                                  type="password"
                                  required
                                  placeholder="••••••••••••"
                                  value={newStaffPassword}
                                  onChange={(e) => setNewStaffPassword(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light"
                                      ? "bg-slate-50 border-slate-200 text-slate-900"
                                      : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Assign Access Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setNewStaffRole("Employee")}
                                    className={`py-2 px-3 border rounded-xl text-xs font-bold uppercase transition-all ${
                                      newStaffRole === "Employee"
                                        ? "bg-zinc-850 border-zinc-750 text-white"
                                        : theme === "light"
                                          ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                                          : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    Employee
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setNewStaffRole("CEO")}
                                    className={`py-2 px-3 border rounded-xl text-xs font-bold uppercase transition-all ${
                                      newStaffRole === "CEO"
                                        ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary"
                                        : theme === "light"
                                          ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                                          : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    CEO
                                  </button>
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={newStaffLoading}
                                className="sm:col-span-2 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition-all mt-2 cursor-pointer"
                              >
                                {newStaffLoading ? (
                                  <>Provisioning <Loader2 className="w-4 h-4 animate-spin" /></>
                                ) : (
                                  <>Create Administrator Account <UserPlus className="w-4 h-4" /></>
                                )}
                              </button>
                            </form>
                          </div>

                        </div>
                      )}
                    </>
                  )}

                  {/* --- TAB: INSIGHTS CMS --- */}
                  {!dataLoading && activeTab === "insights_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center pb-4 border-b border-inherit">
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
                            setBlogReadTime("5 mins read");
                            setBlogImage("");
                            setBlogAuthorName("");
                            setBlogAuthorRole("");
                            setBlogAuthorAvatar("");
                            setShowBlogForm(!showBlogForm);
                          }}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer"
                        >
                          {showBlogForm ? "Hide Form" : "Publish New Insight"}
                        </button>
                      </div>

                      {showBlogForm && (
                        <form onSubmit={handleSaveBlog} className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">
                            {editingBlog ? "Edit Insight Post" : "Draft New Insight Post"}
                          </span>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Post Title</label>
                              <input
                                type="text"
                                required
                                value={blogTitle}
                                onChange={(e) => setBlogTitle(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Category</label>
                              <select
                                value={blogCategory}
                                onChange={(e) => setBlogCategory(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <option value="Technology">Technology</option>
                                <option value="Design">Design</option>
                                <option value="Business">Business</option>
                                <option value="Mentorship">Mentorship</option>
                                <option value="Corporate">Corporate</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Read Time</label>
                              <input
                                type="text"
                                placeholder="e.g. 5 mins read"
                                value={blogReadTime}
                                onChange={(e) => setBlogReadTime(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <ImageUploadField
                                label="Header Image"
                                value={blogImage}
                                onChange={setBlogImage}
                                placeholder="Header image URL or upload from device"
                                theme={theme}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Short Excerpt</label>
                              <input
                                type="text"
                                placeholder="Brief summary of the post"
                                value={blogExcerpt}
                                onChange={(e) => setBlogExcerpt(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Content (Markdown Supported)</label>
                              <textarea
                                rows={8}
                                required
                                value={blogContent}
                                onChange={(e) => setBlogContent(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-mono ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Author Name</label>
                              <input
                                type="text"
                                value={blogAuthorName}
                                onChange={(e) => setBlogAuthorName(e.target.value)}
                                placeholder={currentUser?.name}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Author Role</label>
                              <input
                                type="text"
                                value={blogAuthorRole}
                                onChange={(e) => setBlogAuthorRole(e.target.value)}
                                placeholder={currentUser?.role}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <ImageUploadField
                                label="Author Avatar Image"
                                value={blogAuthorAvatar}
                                onChange={setBlogAuthorAvatar}
                                placeholder="Author avatar image URL or upload from device"
                                theme={theme}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBlog(null);
                                setShowBlogForm(false);
                              }}
                              className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-all ${
                                theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-zinc-950 hover:bg-zinc-850 text-zinc-400"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer"
                            >
                              {editingBlog ? "Save Changes" : "Publish Post"}
                            </button>
                          </div>
                        </form>
                      )}

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
                                  setBlogReadTime(blog.readTime);
                                  setBlogImage(blog.image);
                                  setBlogAuthorName(blog.author.name);
                                  setBlogAuthorRole(blog.author.role);
                                  setBlogAuthorAvatar(blog.author.image || (blog.author as any).avatar || "");
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
                  {!dataLoading && activeTab === "careers_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center pb-4 border-b border-inherit">
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
                            setShowJobForm(!showJobForm);
                          }}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer"
                        >
                          {showJobForm ? "Hide Form" : "Publish Career Opening"}
                        </button>
                      </div>

                      {showJobForm && (
                        <form onSubmit={handleSaveJob} className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">
                            {editingJob ? "Edit Job Opening" : "Draft New Job Opening"}
                          </span>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Job Title</label>
                              <input
                                type="text"
                                required
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Department</label>
                              <select
                                value={jobDept}
                                onChange={(e) => setJobDept(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Product">Product</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Security">Security</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Job Type</label>
                              <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Location</label>
                              <input
                                type="text"
                                required
                                value={jobLocation}
                                onChange={(e) => setJobLocation(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Experience Level</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Mid-level, Senior"
                                value={jobExp}
                                onChange={(e) => setJobExp(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Salary Range</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. ₦300k - ₦500k/mo"
                                value={jobSalary}
                                onChange={(e) => setJobSalary(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Job Description</label>
                              <textarea
                                rows={4}
                                required
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Requirements (One per line)</label>
                              <textarea
                                rows={4}
                                required
                                placeholder="Bachelor's in CS&#10;3+ years experience with React"
                                value={jobReqs}
                                onChange={(e) => setJobReqs(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Responsibilities (One per line)</label>
                              <textarea
                                rows={4}
                                required
                                placeholder="Build secure web apps&#10;Collaborate with CEO on product roadmap"
                                value={jobResps}
                                onChange={(e) => setJobResps(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingJob(null);
                                setShowJobForm(false);
                              }}
                              className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-all ${
                                theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-zinc-950 hover:bg-zinc-850 text-zinc-400"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer"
                            >
                              {editingJob ? "Save Changes" : "Post Job"}
                            </button>
                          </div>
                        </form>
                      )}

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
                  {!dataLoading && activeTab === "training_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center pb-4 border-b border-inherit">
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
                            setShowCourseForm(!showCourseForm);
                          }}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer"
                        >
                          {showCourseForm ? "Hide Form" : "Add Course"}
                        </button>
                      </div>

                      {showCourseForm && (
                        <form onSubmit={handleSaveCourse} className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">
                            {editingCourse ? "Edit Course Details" : "Create New Course Module"}
                          </span>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Course Title</label>
                              <input
                                type="text"
                                required
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Duration</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 6 Weeks, 3 Months"
                                value={courseDuration}
                                onChange={(e) => setCourseDuration(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Difficulty Level</label>
                              <select
                                value={courseLevel}
                                onChange={(e) => setCourseLevel(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Price</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. ₦120,000"
                                value={coursePrice}
                                onChange={(e) => setCoursePrice(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Next Cohort Date</label>
                              <input
                                type="text"
                                placeholder="e.g. September 10, 2026"
                                value={courseCohort}
                                onChange={(e) => setCourseCohort(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Spots Available</label>
                              <input
                                type="number"
                                value={courseSpots}
                                onChange={(e) => setCourseSpots(Number(e.target.value))}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <ImageUploadField
                                label="Course Cover Image"
                                value={courseImage}
                                onChange={setCourseImage}
                                placeholder="Course cover image URL or upload from device"
                                theme={theme}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Tags (Comma separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. JavaScript, Backend, NodeJS"
                                value={courseTags}
                                onChange={(e) => setCourseTags(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Course Description</label>
                              <textarea
                                rows={3}
                                required
                                value={courseDesc}
                                onChange={(e) => setCourseDesc(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Course Syllabus (One per line)</label>
                              <textarea
                                rows={6}
                                required
                                placeholder="Week 1: Fundamentals&#10;Week 2: Advanced OOP&#10;Week 3: Testing"
                                value={courseSyllabus}
                                onChange={(e) => setCourseSyllabus(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCourse(null);
                                setShowCourseForm(false);
                              }}
                              className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-all ${
                                theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-zinc-950 hover:bg-zinc-850 text-zinc-400"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer"
                            >
                              {editingCourse ? "Save Changes" : "Create Course"}
                            </button>
                          </div>
                        </form>
                      )}

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
                  {!dataLoading && activeTab === "about_cms" && (
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
                        <div className="flex justify-between items-center pb-2 border-b border-inherit">
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
                              setShowTeamForm(!showTeamForm);
                            }}
                            className="px-3 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-sm cursor-pointer"
                          >
                            {showTeamForm ? "Hide Form" : "Add Team Member"}
                          </button>
                        </div>

                        {showTeamForm && (
                          <form onSubmit={handleSaveTeamMemberObj} className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">
                              {editingTeam ? "Edit Member Profile" : "Register New Team Profile"}
                            </span>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
                                <input
                                  type="text"
                                  required
                                  value={teamName}
                                  onChange={(e) => setTeamName(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Role / Title</label>
                                <input
                                  type="text"
                                  required
                                  value={teamRole}
                                  onChange={(e) => setTeamRole(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <ImageUploadField
                                  label="Avatar Image"
                                  value={teamImage}
                                  onChange={setTeamImage}
                                  placeholder="Avatar image URL or upload from device"
                                  theme={theme}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">LinkedIn URL</label>
                                <input
                                  type="text"
                                  value={teamLinkedin}
                                  onChange={(e) => setTeamLinkedin(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Twitter URL</label>
                                <input
                                  type="text"
                                  value={teamTwitter}
                                  onChange={(e) => setTeamTwitter(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">GitHub URL</label>
                                <input
                                  type="text"
                                  value={teamGithub}
                                  onChange={(e) => setTeamGithub(e.target.value)}
                                  className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Short Biography</label>
                                <textarea
                                  rows={2}
                                  value={teamBio}
                                  onChange={(e) => setTeamBio(e.target.value)}
                                  className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                    theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTeam(null);
                                  setShowTeamForm(false);
                                }}
                                className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-all ${
                                  theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-zinc-950 hover:bg-zinc-850 text-zinc-400"
                                }`}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer"
                              >
                                {editingTeam ? "Save Changes" : "Register Member"}
                              </button>
                            </div>
                          </form>
                        )}

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
                  {!dataLoading && activeTab === "portfolio_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center pb-4 border-b border-inherit">
                        <div>
                          <h3 className={`font-black text-xl tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>Portfolio CMS</h3>
                          <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-zinc-500"}`}>Publish and showcase technical innovations, apps, and platforms built by Nexlify.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setProjectTitle("");
                            setProjectCategory("Software");
                            setProjectDesc("");
                            setProjectLongDesc("");
                            setProjectImage("");
                            setProjectTags("");
                            setProjectLink("");
                            setShowProjectForm(!showProjectForm);
                          }}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer"
                        >
                          {showProjectForm ? "Hide Form" : "Add Project"}
                        </button>
                      </div>

                      {showProjectForm && (
                        <form onSubmit={handleSaveProject} className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">
                            {editingProject ? "Edit Project Details" : "Feature New Innovation Project"}
                          </span>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Project Title</label>
                              <input
                                type="text"
                                required
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Category</label>
                              <select
                                value={projectCategory}
                                onChange={(e) => setProjectCategory(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <option value="Websites">Websites</option>
                                <option value="Graphic Designs">Graphic Designs</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <ImageUploadField
                                label="Cover Image"
                                value={projectImage}
                                onChange={setProjectImage}
                                placeholder="Project cover image URL or upload from device"
                                theme={theme}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Tags (Comma separated)</label>
                              <input
                                type="text"
                                placeholder="React, Firebase, Cloud, SaaS"
                                value={projectTags}
                                onChange={(e) => setProjectTags(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Platform Link (Optional)</label>
                              <input
                                type="text"
                                placeholder="https://nexlify-example.com"
                                value={projectLink}
                                onChange={(e) => setProjectLink(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Short Pitch</label>
                              <textarea
                                rows={2}
                                required
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Long Story (Optional)</label>
                              <textarea
                                rows={4}
                                value={projectLongDesc}
                                onChange={(e) => setProjectLongDesc(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProject(null);
                                setShowProjectForm(false);
                              }}
                              className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-all ${
                                theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-zinc-950 hover:bg-zinc-850 text-zinc-400"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer"
                            >
                              {editingProject ? "Save Changes" : "Feature Project"}
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="grid gap-4">
                        {cmsProjects.map(project => (
                          <div key={project.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"
                          }`}>
                            <div className="flex gap-4 items-center truncate">
                              <img src={project.image} className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="truncate">
                                <h4 className={`font-bold text-sm truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>{project.title}</h4>
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{project.category}</span>
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
                  {!dataLoading && activeTab === "services_cms" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center pb-4 border-b border-inherit">
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
                            setShowServiceForm(!showServiceForm);
                          }}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-md transition-all cursor-pointer"
                        >
                          {showServiceForm ? "Hide Form" : "Add Service"}
                        </button>
                      </div>

                      {showServiceForm && (
                        <form onSubmit={handleSaveService} className={`p-6 border rounded-3xl space-y-4 ${theme === "light" ? "bg-white border-slate-200" : "bg-zinc-900/30 border-zinc-850"}`}>
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">
                            {editingService ? "Edit Service Parameters" : "Publish New Platform Service"}
                          </span>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Service Title</label>
                              <input
                                type="text"
                                required
                                value={serviceTitle}
                                onChange={(e) => setServiceTitle(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Visual Icon</label>
                              <select
                                value={serviceIcon}
                                onChange={(e) => setServiceIcon(e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <option value="Cpu">Cpu / Processing Core</option>
                                <option value="Layout">Layout / User Interfaces</option>
                                <option value="Database">Database / Big Data Layer</option>
                                <option value="Globe">Globe / Worldwide Ingress</option>
                                <option value="Cloud">Cloud / Serverless Node</option>
                                <option value="Shield">Shield / Security Node</option>
                                <option value="Terminal">Terminal / Automation Console</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <ImageUploadField
                                label="Service Cover Image"
                                value={serviceImage}
                                onChange={setServiceImage}
                                theme={theme}
                                placeholder="Service cover image URL or upload from device"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Short Capability Summary</label>
                              <textarea
                                rows={2}
                                required
                                value={serviceDesc}
                                onChange={(e) => setServiceDesc(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Detailed Features / Deliverables (One per line)</label>
                              <textarea
                                rows={4}
                                required
                                placeholder="High performance Node.js runtime&#10;Highly optimized SQLite storage layers"
                                value={serviceFeatures}
                                onChange={(e) => setServiceFeatures(e.target.value)}
                                className={`w-full p-4 border rounded-xl text-xs focus:border-brand-primary focus:outline-none transition-all font-semibold ${
                                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-zinc-950 border-zinc-850 text-white"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingService(null);
                                setServiceImage("");
                                setShowServiceForm(false);
                              }}
                              className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-all ${
                                theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-zinc-950 hover:bg-zinc-850 text-zinc-400"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer"
                            >
                              {editingService ? "Save Changes" : "Publish Service"}
                            </button>
                          </div>
                        </form>
                      )}

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

          {/* EDIT NOTES MODALS AREA */}
          <AnimatePresence>
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
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
