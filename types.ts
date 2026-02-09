export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
}

export interface ReservationDetails {
  id?: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  timestamp?: any;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface AmbienceItem {
  id: string;
  url: string;
  title: string;
  type: 'image' | 'video' | 'youtube';
}

export interface SiteSettings {
  logoUrl?: string;
  faviconUrl?: string;
  siteTitle?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  storyTitle?: string;
  storySubtitle?: string;
  storyDescription?: string;
  storyPoint1Title?: string;
  storyPoint1Desc?: string;
  storyPoint2Title?: string;
  storyPoint2Desc?: string;
  footerAddress?: string;
  footerHours?: string;
  footerCopyright?: string;
  footerTagline?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  geminiApiKey?: string;
}
