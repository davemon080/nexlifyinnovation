import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp,
  setDoc
} from "firebase/firestore";
import { Service, Project, Course, TeamMember, BlogPost, JobOpening } from "../types";
import { SERVICES, PROJECTS, COURSES, TEAM, BLOGS, JOBS } from "../data";

// Firebase Config from environment variables
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

let db: any = null;
let auth: any = null;
let isFirebaseEnabled = false;

// Safe initialization
try {
  if (
    firebaseConfig.apiKey && 
    firebaseConfig.projectId && 
    firebaseConfig.apiKey !== "" && 
    firebaseConfig.projectId !== ""
  ) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseEnabled = true;
    console.log("Firebase initialized successfully! Connecting to Firestore.");
  } else {
    console.warn("Firebase environment variables are missing. Using Local Storage Fallback with offline persistence.");
  }
} catch (error) {
  console.error("Firebase failed to initialize:", error);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}


// Interfaces
export interface Consultation {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  date: string;
  time: string;
  brief: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled";
  staffNotes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  staffNotes?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  portfolio: string;
  note: string;
  createdAt: string;
  status: "Reviewing" | "Shortlisted" | "Hired" | "Rejected";
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "CEO" | "Employee";
  createdAt: string;
}

// PRE-POPULATED MOCK DATA FOR LOCAL STORAGE
const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: "cons-1",
    name: "Alhaji Ibrahim Musa",
    email: "ibrahim.musa@kdfoundation.org",
    whatsapp: "+2348031234567",
    service: "Web Development",
    date: "2026-07-20",
    time: "11:30 AM",
    brief: "We need a comprehensive portal to coordinate digital literacy training grants for 500 scholars in Nassarawa State. Must have offline caching and mobile-responsive layouts.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "Approved",
    staffNotes: "Discussed on initial phone call. Sounds highly aligned with our Academy core mission."
  },
  {
    id: "cons-2",
    name: "Dr. Chioma Nwachukwu",
    email: "chioma@vitalsaas.com",
    whatsapp: "+2349022345678",
    service: "Custom Business ERP / CRM",
    date: "2026-07-22",
    time: "09:00 AM",
    brief: "Rebuilding our clinical records management software. Security and strict role-based access control are high priorities.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Pending"
  },
  {
    id: "cons-3",
    name: "Tunde Ednut Jr.",
    email: "tunde@vividcreatives.ng",
    whatsapp: "+2348123456789",
    service: "UI/UX Design Systems",
    date: "2026-07-16",
    time: "03:30 PM",
    brief: "Need a complete luxury brand identity design and visual style guide for a new real estate venture in Abuja.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    staffNotes: "Brand guide completed and delivered in high-res vectors. Client was highly pleased and gave us a tip!"
  }
];

const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Kelechi Okafor",
    email: "kelechi@gmail.com",
    subject: "Academy Enrollment",
    message: "Hello! I want to enroll for the Fullstack Web Development bootcamp starting next month. Can I pay the fee in installments, and is there public transport access to your physical hub in Nassarawa?",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "msg-2",
    name: "Amara Peters",
    email: "amara@brandspace.ng",
    subject: "Branding Design",
    message: "Greetings, Nexlify. We love your visual identity portfolio. We'd like to hire you to build a custom brand playbook and full marketing collateral for our launch. What are your timelines?",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    staffNotes: "Shared package pricing and timeline. Waiting for their feedback."
  },
  {
    id: "msg-3",
    name: "Engr. Yusuf Bello",
    email: "yusuf@bello-associates.com",
    subject: "SaaS Custom Build",
    message: "Do you have experience building custom inventory tracking software that connects with physical barcode scanners?",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    staffNotes: "Responded. Confirmed we can build this using custom hardware SDKs."
  }
];

const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "career-1",
    jobTitle: "Senior React & Node Developer",
    name: "Chinedu Emmanuel",
    email: "chinedu.dev@github.io",
    portfolio: "https://chinedudev.github.io",
    note: "Over 4 years of solid experience in React, Next.js, and Express. Built 6 responsive production web tools. Active contributor to open-source libraries.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Shortlisted"
  },
  {
    id: "app-2",
    jobId: "career-2",
    jobTitle: "Lead Visual / Brand Designer",
    name: "Sade Adebayo",
    email: "sade@behance.net",
    portfolio: "https://behance.net/sadebrand",
    note: "Specialized in luxury brand architectures and high-fidelity Figma typography layout prototypes. Excited to teach part-time design bootcamps!",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Reviewing"
  }
];

const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: "sub-1", email: "nigeriatech@yahoo.com", subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "sub-2", email: "simondavid@outlook.com", subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
];

// Define AboutPageData interface
export interface AboutPageData {
  title: string;
  story: string;
  description: string;
  vision: string;
  mission: string;
  futureTitle: string;
  futureDesc: string;
  futureMetricCount: string;
  futureMetricTitle: string;
  futureMetricSubtitle: string;
}

const DEFAULT_ABOUT_PAGE: AboutPageData = {
  title: "Innovating From The Heart of Nigeria.",
  story: "Nexlify Innovation is a premier digital services agency and training hub headquartered in Nassarawa State. We believe high-quality technological solutions and elite digital literacy should be globally accessible.",
  description: "We blend visual design craftsmanship with robust software engineering to build scalable systems. Beyond our corporate consulting, we lead hands-on mentoring bootcamps, shaping the next generation of engineers and designers.",
  vision: "To build Nigeria's #1 digital powerhouse, bridging regional talent with the global software economy.",
  mission: "To provide elite, secure software products and world-class structured training resources for scale-ups.",
  futureTitle: "Building The Future Tech Ecosystem",
  futureDesc: "We are aggressively scaling our training program capacities to deliver highly advanced cloud technologies, database operations, and deep learning neural designs directly to Nigeria's creative community. Our long-term focus lies in deploying fully autonomous systems that operate securely across low-bandwidth environments.",
  futureMetricCount: "1,000+",
  futureMetricTitle: "Empowered Graduates",
  futureMetricSubtitle: "Projected for 2027"
};

const INITIAL_STAFF: StaffUser[] = [
  { id: "staff-1", name: "David Simon", email: "ceo@nexlify.com", role: "CEO", createdAt: new Date().toISOString() },
  { id: "staff-2", name: "Israel Ujah", email: "employee@nexlify.com", role: "Employee", createdAt: new Date().toISOString() }
];

// Helper to initialize Local Storage
const initLocalStorage = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("nexlify_consultations")) {
    localStorage.setItem("nexlify_consultations", JSON.stringify(INITIAL_CONSULTATIONS));
  }
  if (!localStorage.getItem("nexlify_contact_messages")) {
    localStorage.setItem("nexlify_contact_messages", JSON.stringify(INITIAL_CONTACT_MESSAGES));
  }
  if (!localStorage.getItem("nexlify_job_applications")) {
    localStorage.setItem("nexlify_job_applications", JSON.stringify(INITIAL_JOB_APPLICATIONS));
  }
  if (!localStorage.getItem("nexlify_subscribers")) {
    localStorage.setItem("nexlify_subscribers", JSON.stringify(INITIAL_SUBSCRIBERS));
  }
  if (!localStorage.getItem("nexlify_staff")) {
    localStorage.setItem("nexlify_staff", JSON.stringify(INITIAL_STAFF));
  }
  if (!localStorage.getItem("nexlify_services")) {
    localStorage.setItem("nexlify_services", JSON.stringify(SERVICES));
  }
  if (!localStorage.getItem("nexlify_projects")) {
    localStorage.setItem("nexlify_projects", JSON.stringify(PROJECTS));
  }
  if (!localStorage.getItem("nexlify_courses")) {
    localStorage.setItem("nexlify_courses", JSON.stringify(COURSES));
  }
  if (!localStorage.getItem("nexlify_team")) {
    localStorage.setItem("nexlify_team", JSON.stringify(TEAM));
  }
  if (!localStorage.getItem("nexlify_blogs")) {
    localStorage.setItem("nexlify_blogs", JSON.stringify(BLOGS));
  }
  if (!localStorage.getItem("nexlify_jobs")) {
    localStorage.setItem("nexlify_jobs", JSON.stringify(JOBS));
  }
  if (!localStorage.getItem("nexlify_about_page")) {
    localStorage.setItem("nexlify_about_page", JSON.stringify(DEFAULT_ABOUT_PAGE));
  }
};

initLocalStorage();

// Helper to access LocalStorage collections safely
const getLocalCollection = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setLocalCollection = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ==================== SYSTEM DATABASE OPERATIONS ====================

// 1. DATABASE CONNECTIVITY HEALTH STATUS
export function isFirebaseConnected(): boolean {
  return isFirebaseEnabled;
}

// 2. CONSULTATION BOOKINGS API
export async function saveConsultation(data: Omit<Consultation, "id" | "createdAt" | "status">): Promise<Consultation> {
  const newBooking: Consultation = {
    ...data,
    id: `cons-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: "Pending"
  };

  if (isFirebaseEnabled && db) {
    try {
      const docRef = await addDoc(collection(db, "consultations"), {
        ...newBooking,
        createdAt: Timestamp.now()
      });
      newBooking.id = docRef.id;
      return newBooking;
    } catch (e) {
      console.error("Firebase write error, saving to local storage fallback instead:", e);
      handleFirestoreError(e, OperationType.CREATE, "consultations");
    }
  }

  // Fallback
  const list = getLocalCollection<Consultation>("nexlify_consultations");
  list.unshift(newBooking);
  setLocalCollection("nexlify_consultations", list);
  return newBooking;
}

export async function getConsultations(): Promise<Consultation[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = query(collection(db, "consultations"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items: Consultation[] = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        items.push({
          ...d,
          id: doc.id,
          createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate().toISOString() : d.createdAt
        } as Consultation);
      });
      return items;
    } catch (e) {
      console.error("Firebase fetch error, loading from local fallback:", e);
      handleFirestoreError(e, OperationType.LIST, "consultations");
    }
  }

  return getLocalCollection<Consultation>("nexlify_consultations");
}

export async function updateConsultationStatus(id: string, status: Consultation["status"], notes?: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, "consultations", id);
      const updateData: any = { status };
      if (notes !== undefined) updateData.staffNotes = notes;
      await updateDoc(docRef, updateData);
      return true;
    } catch (e) {
      console.error("Firebase update error, updating local fallback:", e);
      handleFirestoreError(e, OperationType.UPDATE, `consultations/${id}`);
    }
  }

  const list = getLocalCollection<Consultation>("nexlify_consultations");
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    if (notes !== undefined) list[idx].staffNotes = notes;
    setLocalCollection("nexlify_consultations", list);
    return true;
  }
  return false;
}

export async function deleteConsultation(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "consultations", id));
      return true;
    } catch (e) {
      console.error("Firebase delete error, deleting from local fallback:", e);
      handleFirestoreError(e, OperationType.DELETE, `consultations/${id}`);
    }
  }

  const list = getLocalCollection<Consultation>("nexlify_consultations");
  const filtered = list.filter(c => c.id !== id);
  setLocalCollection("nexlify_consultations", filtered);
  return true;
}

// 3. CONTACT MESSAGES API
export async function saveContactMessage(data: Omit<ContactMessage, "id" | "createdAt" | "read">): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    ...data,
    id: `msg-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    read: false
  };

  if (isFirebaseEnabled && db) {
    try {
      const docRef = await addDoc(collection(db, "contact_messages"), {
        ...newMessage,
        createdAt: Timestamp.now()
      });
      newMessage.id = docRef.id;
      return newMessage;
    } catch (e) {
      console.error("Firebase message write error, saving to local fallback:", e);
      handleFirestoreError(e, OperationType.CREATE, "contact_messages");
    }
  }

  const list = getLocalCollection<ContactMessage>("nexlify_contact_messages");
  list.unshift(newMessage);
  setLocalCollection("nexlify_contact_messages", list);
  return newMessage;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        items.push({
          ...d,
          id: doc.id,
          createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate().toISOString() : d.createdAt
        } as ContactMessage);
      });
      return items;
    } catch (e) {
      console.error("Firebase message fetch error, loading from local fallback:", e);
      handleFirestoreError(e, OperationType.LIST, "contact_messages");
    }
  }

  return getLocalCollection<ContactMessage>("nexlify_contact_messages");
}

export async function updateContactMessageStatus(id: string, read: boolean, notes?: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, "contact_messages", id);
      const updateData: any = { read };
      if (notes !== undefined) updateData.staffNotes = notes;
      await updateDoc(docRef, updateData);
      return true;
    } catch (e) {
      console.error("Firebase message update error, updating local fallback:", e);
      handleFirestoreError(e, OperationType.UPDATE, `contact_messages/${id}`);
    }
  }

  const list = getLocalCollection<ContactMessage>("nexlify_contact_messages");
  const idx = list.findIndex(m => m.id === id);
  if (idx !== -1) {
    list[idx].read = read;
    if (notes !== undefined) list[idx].staffNotes = notes;
    setLocalCollection("nexlify_contact_messages", list);
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "contact_messages", id));
      return true;
    } catch (e) {
      console.error("Firebase message delete error, deleting from local fallback:", e);
      handleFirestoreError(e, OperationType.DELETE, `contact_messages/${id}`);
    }
  }

  const list = getLocalCollection<ContactMessage>("nexlify_contact_messages");
  const filtered = list.filter(m => m.id !== id);
  setLocalCollection("nexlify_contact_messages", filtered);
  return true;
}

// 4. JOB APPLICATIONS API
export async function saveJobApplication(data: Omit<JobApplication, "id" | "createdAt" | "status">): Promise<JobApplication> {
  const newApp: JobApplication = {
    ...data,
    id: `app-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: "Reviewing"
  };

  if (isFirebaseEnabled && db) {
    try {
      const docRef = await addDoc(collection(db, "job_applications"), {
        ...newApp,
        createdAt: Timestamp.now()
      });
      newApp.id = docRef.id;
      return newApp;
    } catch (e) {
      console.error("Firebase application write error, saving to local fallback:", e);
      handleFirestoreError(e, OperationType.CREATE, "job_applications");
    }
  }

  const list = getLocalCollection<JobApplication>("nexlify_job_applications");
  list.unshift(newApp);
  setLocalCollection("nexlify_job_applications", list);
  return newApp;
}

export async function getJobApplications(): Promise<JobApplication[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = query(collection(db, "job_applications"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items: JobApplication[] = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        items.push({
          ...d,
          id: doc.id,
          createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate().toISOString() : d.createdAt
        } as JobApplication);
      });
      return items;
    } catch (e) {
      console.error("Firebase applications fetch error, loading from local fallback:", e);
      handleFirestoreError(e, OperationType.LIST, "job_applications");
    }
  }

  return getLocalCollection<JobApplication>("nexlify_job_applications");
}

export async function updateJobApplicationStatus(id: string, status: JobApplication["status"]): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, "job_applications", id);
      await updateDoc(docRef, { status });
      return true;
    } catch (e) {
      console.error("Firebase application update error, updating local fallback:", e);
      handleFirestoreError(e, OperationType.UPDATE, `job_applications/${id}`);
    }
  }

  const list = getLocalCollection<JobApplication>("nexlify_job_applications");
  const idx = list.findIndex(a => a.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    setLocalCollection("nexlify_job_applications", list);
    return true;
  }
  return false;
}

export async function deleteJobApplication(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "job_applications", id));
      return true;
    } catch (e) {
      console.error("Firebase application delete error, deleting from local fallback:", e);
      handleFirestoreError(e, OperationType.DELETE, `job_applications/${id}`);
    }
  }

  const list = getLocalCollection<JobApplication>("nexlify_job_applications");
  const filtered = list.filter(a => a.id !== id);
  setLocalCollection("nexlify_job_applications", filtered);
  return true;
}

// 5. NEWSLETTER SUBSCRIBERS API
export async function saveNewsletterSubscription(email: string): Promise<NewsletterSubscriber | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const newSub: NewsletterSubscriber = {
    id: `sub-${Math.random().toString(36).substr(2, 9)}`,
    email: normalizedEmail,
    subscribedAt: new Date().toISOString()
  };

  if (isFirebaseEnabled && db) {
    try {
      const docRef = await addDoc(collection(db, "subscribers"), {
        ...newSub,
        subscribedAt: Timestamp.now()
      });
      newSub.id = docRef.id;
      return newSub;
    } catch (e) {
      console.error("Firebase subscriber write error, saving to local fallback:", e);
      handleFirestoreError(e, OperationType.CREATE, "subscribers");
    }
  }

  const list = getLocalCollection<NewsletterSubscriber>("nexlify_subscribers");
  const alreadyExists = list.some(s => s.email === normalizedEmail);
  if (alreadyExists) return null;

  list.unshift(newSub);
  setLocalCollection("nexlify_subscribers", list);
  return newSub;
}

export async function getNewsletterSubscriptions(): Promise<NewsletterSubscriber[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items: NewsletterSubscriber[] = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        items.push({
          ...d,
          id: doc.id,
          subscribedAt: d.subscribedAt instanceof Timestamp ? d.subscribedAt.toDate().toISOString() : d.subscribedAt
        } as NewsletterSubscriber);
      });
      return items;
    } catch (e) {
      console.error("Firebase subscribers fetch error, loading from local fallback:", e);
      handleFirestoreError(e, OperationType.LIST, "subscribers");
    }
  }

  return getLocalCollection<NewsletterSubscriber>("nexlify_subscribers");
}

export async function deleteNewsletterSubscription(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "subscribers", id));
      return true;
    } catch (e) {
      console.error("Firebase subscriber delete error, deleting from local fallback:", e);
      handleFirestoreError(e, OperationType.DELETE, `subscribers/${id}`);
    }
  }

  const list = getLocalCollection<NewsletterSubscriber>("nexlify_subscribers");
  const filtered = list.filter(s => s.id !== id);
  setLocalCollection("nexlify_subscribers", filtered);
  return true;
}

// 6. STAFF / ROLE MANAGEMENT API
export async function getStaffUsers(): Promise<StaffUser[]> {
  if (isFirebaseEnabled && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "staff_users"));
      const items: StaffUser[] = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        items.push({
          ...d,
          id: doc.id
        } as StaffUser);
      });
      return items;
    } catch (e) {
      console.error("Firebase staff fetch error, loading from local fallback:", e);
      handleFirestoreError(e, OperationType.LIST, "staff_users");
    }
  }

  return getLocalCollection<StaffUser>("nexlify_staff");
}

export async function updateStaffRole(email: string, role: "CEO" | "Employee"): Promise<boolean> {
  const staff = getLocalCollection<StaffUser>("nexlify_staff");
  const idx = staff.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    staff[idx].role = role;
    setLocalCollection("nexlify_staff", staff);

    if (isFirebaseEnabled && db) {
      try {
        // Find by email in firestore
        const querySnapshot = await getDocs(collection(db, "staff_users"));
        let firestoreId = null;
        querySnapshot.forEach((doc) => {
          if (doc.data().email.toLowerCase() === email.toLowerCase()) {
            firestoreId = doc.id;
          }
        });
        if (firestoreId) {
          await updateDoc(doc(db, "staff_users", firestoreId), { role });
        }
      } catch (e) {
        console.error("Firebase staff role update error:", e);
        handleFirestoreError(e, OperationType.UPDATE, "staff_users");
      }
    }
    return true;
  }
  return false;
}

export async function registerStaffUser(email: string, password: string, name: string, role: "CEO" | "Employee"): Promise<StaffUser | string> {
  const emailLower = email.trim().toLowerCase();
  const staff = getLocalCollection<StaffUser>("nexlify_staff");
  
  if (staff.some(s => s.email.toLowerCase() === emailLower)) {
    return "Staff user with this email address already exists.";
  }

  const newStaff: StaffUser = {
    id: `staff-${Math.random().toString(36).substr(2, 9)}`,
    name,
    email: emailLower,
    role,
    createdAt: new Date().toISOString()
  };

  staff.push(newStaff);
  setLocalCollection("nexlify_staff", staff);

  // Store password locally (securely in standard mock format for auth fallback)
  const authMapStr = localStorage.getItem("nexlify_auth_passwords") || "{}";
  const authMap = JSON.parse(authMapStr);
  authMap[emailLower] = password;
  localStorage.setItem("nexlify_auth_passwords", JSON.stringify(authMap));

  if (isFirebaseEnabled && db) {
    try {
      await addDoc(collection(db, "staff_users"), {
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        createdAt: Timestamp.now()
      });
    } catch (e) {
      console.error("Firebase staff save error:", e);
      handleFirestoreError(e, OperationType.CREATE, "staff_users");
    }
  }

  return newStaff;
}

export async function loginStaffUser(email: string, password: string): Promise<StaffUser | string> {
  const emailLower = email.trim().toLowerCase();
  
  // Check preset accounts first
  if (emailLower === "ceo@nexlify.com" && password === "ceopassword123") {
    return { id: "staff-1", name: "David Simon", email: "ceo@nexlify.com", role: "CEO", createdAt: new Date().toISOString() };
  }
  if (emailLower === "employee@nexlify.com" && password === "employeepassword123") {
    return { id: "staff-2", name: "Israel Ujah", email: "employee@nexlify.com", role: "Employee", createdAt: new Date().toISOString() };
  }

  // Check locally registered staff
  const staff = getLocalCollection<StaffUser>("nexlify_staff");
  const user = staff.find(s => s.email.toLowerCase() === emailLower);
  if (!user) {
    return "Invalid staff email address or unlisted administrator.";
  }

  // Check stored password
  const authMapStr = localStorage.getItem("nexlify_auth_passwords") || "{}";
  const authMap = JSON.parse(authMapStr);
  const storedPassword = authMap[emailLower];
  
  if (storedPassword === password) {
    return user;
  }

  return "Incorrect password for administrative portal.";
}

// ==================== CMS DYNAMIC WEB OPERATIONS ====================

// 7. SERVICES CMS
export async function getServices(): Promise<Service[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = collection(db, "services");
      const querySnapshot = await getDocs(q);
      const items: Service[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as Service);
      });
      
      const hasAllRequiredServices = SERVICES.every(s => items.some(item => item.id === s.id));
      if (items.length > 0 && hasAllRequiredServices) {
        return items;
      }
      
      // Seed / Re-seed
      for (const item of SERVICES) {
        await setDoc(doc(db, "services", item.id), item);
      }
      return SERVICES;
    } catch (e) {
      console.error("Firebase fetch services error:", e);
      handleFirestoreError(e, OperationType.LIST, "services");
    }
  }
  const local = getLocalCollection<Service>("nexlify_services");
  const hasAllRequiredServicesLocal = SERVICES.every(s => local.some(item => item.id === s.id));
  if (local.length > 0 && hasAllRequiredServicesLocal) {
    return local;
  }
  setLocalCollection("nexlify_services", SERVICES);
  return SERVICES;
}

export async function saveService(service: Service): Promise<Service> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "services", service.id), service);
      return service;
    } catch (e) {
      console.error("Firebase save service error:", e);
      handleFirestoreError(e, OperationType.WRITE, `services/${service.id}`);
    }
  }
  const list = getLocalCollection<Service>("nexlify_services");
  const idx = list.findIndex(s => s.id === service.id);
  if (idx !== -1) {
    list[idx] = service;
  } else {
    list.push(service);
  }
  setLocalCollection("nexlify_services", list);
  return service;
}

export async function deleteService(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "services", id));
      return true;
    } catch (e) {
      console.error("Firebase delete service error:", e);
      handleFirestoreError(e, OperationType.DELETE, `services/${id}`);
    }
  }
  const list = getLocalCollection<Service>("nexlify_services");
  const filtered = list.filter(s => s.id !== id);
  setLocalCollection("nexlify_services", filtered);
  return true;
}

// 8. PROJECTS / PORTFOLIO CMS
export async function getProjects(): Promise<Project[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = collection(db, "projects");
      const querySnapshot = await getDocs(q);
      const items: Project[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as Project);
      });
      if (items.length > 0) {
        return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
      
      // Seed
      for (const item of PROJECTS) {
        await setDoc(doc(db, "projects", item.id), item);
      }
      return PROJECTS;
    } catch (e) {
      console.error("Firebase fetch projects error:", e);
      handleFirestoreError(e, OperationType.LIST, "projects");
    }
  }
  const local = getLocalCollection<Project>("nexlify_projects");
  const merged = local.length > 0 ? local : PROJECTS;
  return [...merged].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function saveProject(project: Project): Promise<Project> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "projects", project.id), project);
      return project;
    } catch (e) {
      console.error("Firebase save project error:", e);
      handleFirestoreError(e, OperationType.WRITE, `projects/${project.id}`);
    }
  }
  const list = getLocalCollection<Project>("nexlify_projects");
  const idx = list.findIndex(p => p.id === project.id);
  if (idx !== -1) {
    list[idx] = project;
  } else {
    list.unshift(project);
  }
  setLocalCollection("nexlify_projects", list);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "projects", id));
      return true;
    } catch (e) {
      console.error("Firebase delete project error:", e);
      handleFirestoreError(e, OperationType.DELETE, `projects/${id}`);
    }
  }
  const list = getLocalCollection<Project>("nexlify_projects");
  const filtered = list.filter(p => p.id !== id);
  setLocalCollection("nexlify_projects", filtered);
  return true;
}

// 9. COURSES / TRAINING CMS
export async function getCourses(): Promise<Course[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = collection(db, "courses");
      const querySnapshot = await getDocs(q);
      const items: Course[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as Course);
      });
      
      const hasAllRequiredCourses = COURSES.every(c => items.some(item => item.id === c.id));
      if (items.length > 0 && hasAllRequiredCourses) {
        return items;
      }
      
      // Seed / Re-seed
      for (const item of COURSES) {
        await setDoc(doc(db, "courses", item.id), item);
      }
      return COURSES;
    } catch (e) {
      console.error("Firebase fetch courses error:", e);
      handleFirestoreError(e, OperationType.LIST, "courses");
    }
  }
  const local = getLocalCollection<Course>("nexlify_courses");
  const hasAllRequiredCoursesLocal = COURSES.every(c => local.some(item => item.id === c.id));
  if (local.length > 0 && hasAllRequiredCoursesLocal) {
    return local;
  }
  setLocalCollection("nexlify_courses", COURSES);
  return COURSES;
}

export async function saveCourse(course: Course): Promise<Course> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "courses", course.id), course);
      return course;
    } catch (e) {
      console.error("Firebase save course error:", e);
      handleFirestoreError(e, OperationType.WRITE, `courses/${course.id}`);
    }
  }
  const list = getLocalCollection<Course>("nexlify_courses");
  const idx = list.findIndex(c => c.id === course.id);
  if (idx !== -1) {
    list[idx] = course;
  } else {
    list.push(course);
  }
  setLocalCollection("nexlify_courses", list);
  return course;
}

export async function deleteCourse(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "courses", id));
      return true;
    } catch (e) {
      console.error("Firebase delete course error:", e);
      handleFirestoreError(e, OperationType.DELETE, `courses/${id}`);
    }
  }
  const list = getLocalCollection<Course>("nexlify_courses");
  const filtered = list.filter(c => c.id !== id);
  setLocalCollection("nexlify_courses", filtered);
  return true;
}

// 10. BLOGS / INSIGHTS CMS
export async function getBlogs(): Promise<BlogPost[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = collection(db, "blogs");
      const querySnapshot = await getDocs(q);
      const items: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as BlogPost);
      });
      if (items.length > 0) return items;
      
      // Seed
      for (const item of BLOGS) {
        await setDoc(doc(db, "blogs", item.id), item);
      }
      return BLOGS;
    } catch (e) {
      console.error("Firebase fetch blogs error:", e);
      handleFirestoreError(e, OperationType.LIST, "blogs");
    }
  }
  const local = getLocalCollection<BlogPost>("nexlify_blogs");
  return local.length > 0 ? local : BLOGS;
}

export async function saveBlog(blog: BlogPost): Promise<BlogPost> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "blogs", blog.id), blog);
      return blog;
    } catch (e) {
      console.error("Firebase save blog error:", e);
      handleFirestoreError(e, OperationType.WRITE, `blogs/${blog.id}`);
    }
  }
  const list = getLocalCollection<BlogPost>("nexlify_blogs");
  const idx = list.findIndex(b => b.id === blog.id);
  if (idx !== -1) {
    list[idx] = blog;
  } else {
    list.push(blog);
  }
  setLocalCollection("nexlify_blogs", list);
  return blog;
}

export async function deleteBlog(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "blogs", id));
      return true;
    } catch (e) {
      console.error("Firebase delete blog error:", e);
      handleFirestoreError(e, OperationType.DELETE, `blogs/${id}`);
    }
  }
  const list = getLocalCollection<BlogPost>("nexlify_blogs");
  const filtered = list.filter(b => b.id !== id);
  setLocalCollection("nexlify_blogs", filtered);
  return true;
}

// 11. JOBS / CAREERS CMS
export async function getJobs(): Promise<JobOpening[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = collection(db, "jobs");
      const querySnapshot = await getDocs(q);
      const items: JobOpening[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as JobOpening);
      });
      if (items.length > 0) return items;
      
      // Seed
      for (const item of JOBS) {
        await setDoc(doc(db, "jobs", item.id), item);
      }
      return JOBS;
    } catch (e) {
      console.error("Firebase fetch jobs error:", e);
      handleFirestoreError(e, OperationType.LIST, "jobs");
    }
  }
  const local = getLocalCollection<JobOpening>("nexlify_jobs");
  return local.length > 0 ? local : JOBS;
}

export async function saveJob(job: JobOpening): Promise<JobOpening> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "jobs", job.id), job);
      return job;
    } catch (e) {
      console.error("Firebase save job error:", e);
      handleFirestoreError(e, OperationType.WRITE, `jobs/${job.id}`);
    }
  }
  const list = getLocalCollection<JobOpening>("nexlify_jobs");
  const idx = list.findIndex(j => j.id === job.id);
  if (idx !== -1) {
    list[idx] = job;
  } else {
    list.push(job);
  }
  setLocalCollection("nexlify_jobs", list);
  return job;
}

export async function deleteJob(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "jobs", id));
      return true;
    } catch (e) {
      console.error("Firebase delete job error:", e);
      handleFirestoreError(e, OperationType.DELETE, `jobs/${id}`);
    }
  }
  const list = getLocalCollection<JobOpening>("nexlify_jobs");
  const filtered = list.filter(j => j.id !== id);
  setLocalCollection("nexlify_jobs", filtered);
  return true;
}

// 12. ABOUT PAGE & TEAM CMS
export async function getAboutPageData(): Promise<AboutPageData> {
  if (isFirebaseEnabled && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "about"));
      let data: AboutPageData | null = null;
      querySnapshot.forEach((doc) => {
        if (doc.id === "page") {
          data = doc.data() as AboutPageData;
        }
      });
      if (data) return data;
      
      // Seed
      await setDoc(doc(db, "about", "page"), DEFAULT_ABOUT_PAGE);
      return DEFAULT_ABOUT_PAGE;
    } catch (e) {
      console.error("Firebase fetch about error:", e);
      handleFirestoreError(e, OperationType.GET, "about/page");
    }
  }
  try {
    const raw = localStorage.getItem("nexlify_about_page");
    return raw ? JSON.parse(raw) : DEFAULT_ABOUT_PAGE;
  } catch {
    return DEFAULT_ABOUT_PAGE;
  }
}

export async function saveAboutPageData(data: AboutPageData): Promise<AboutPageData> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "about", "page"), data);
      return data;
    } catch (e) {
      console.error("Firebase save about error:", e);
      handleFirestoreError(e, OperationType.WRITE, "about/page");
    }
  }
  localStorage.setItem("nexlify_about_page", JSON.stringify(data));
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isFirebaseEnabled && db) {
    try {
      const q = collection(db, "team_members");
      const querySnapshot = await getDocs(q);
      const items: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as TeamMember);
      });
      if (items.length > 0) return items;
      
      // Seed
      for (const item of TEAM) {
        await setDoc(doc(db, "team_members", item.name.replace(/\s+/g, "_")), item);
      }
      return TEAM;
    } catch (e) {
      console.error("Firebase fetch team error:", e);
      handleFirestoreError(e, OperationType.LIST, "team_members");
    }
  }
  const local = getLocalCollection<TeamMember>("nexlify_team");
  return local.length > 0 ? local : TEAM;
}

export async function saveTeamMember(member: TeamMember): Promise<TeamMember> {
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, "team_members", member.name.replace(/\s+/g, "_")), member);
      return member;
    } catch (e) {
      console.error("Firebase save team error:", e);
      handleFirestoreError(e, OperationType.WRITE, `team_members/${member.name.replace(/\s+/g, "_")}`);
    }
  }
  const list = getLocalCollection<TeamMember>("nexlify_team");
  const idx = list.findIndex(t => t.name.toLowerCase() === member.name.toLowerCase());
  if (idx !== -1) {
    list[idx] = member;
  } else {
    list.push(member);
  }
  setLocalCollection("nexlify_team", list);
  return member;
}

export async function deleteTeamMember(name: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await deleteDoc(doc(db, "team_members", name.replace(/\s+/g, "_")));
      return true;
    } catch (e) {
      console.error("Firebase delete team error:", e);
      handleFirestoreError(e, OperationType.DELETE, `team_members/${name.replace(/\s+/g, "_")}`);
    }
  }
  const list = getLocalCollection<TeamMember>("nexlify_team");
  const filtered = list.filter(t => t.name.toLowerCase() !== name.toLowerCase());
  setLocalCollection("nexlify_team", filtered);
  return true;
}

