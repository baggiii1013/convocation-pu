import { Award, Calendar, GraduationCap, MapPin, University, Users } from "lucide-react";

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#guests", label: "Guests" },
  { href: "#details", label: "Details" },
  { href: "#contact", label: "Contact" },
];

export const stats = [
  {
    value: "35,000+",
    label: "Students",
    description: "Enrolled across 150+ programs",
    icon: Users,
  },
  {
    value: "2,000+",
    label: "Faculty",
    description: "Leading experts and researchers",
    icon: GraduationCap,
  },
  {
    value: "Top 50",
    label: "NIRF Ranking",
    description: "Among private universities in India",
    icon: University,
  },
  {
    value: "100+",
    label: "Awards",
    description: "For academic and research excellence",
    icon: Award,
  },
];

export const schedule = [
  {
    event: "Registration & Kit Collection",
    description: "Collect your convocation kit and register your attendance.",
    time: "10:00 AM",
    icon: GraduationCap,
  },
  {
    event: "Academic Procession",
    description: "The formal procession of faculty and dignitaries.",
    time: "11:00 AM",
    icon: University,
  },
  {
    event: "Guest Speeches",
    description: "Inspiring words from our esteemed VIP guests.",
    time: "12:00 PM",
    icon: Users,
  },
  {
    event: "Awarding of Degrees",
    description: "The moment you've been waiting for!",
    time: "1:00 PM",
    icon: Award,
  },
];

export const vipGuests = [
  {
    name: "Dr. Evelyn Reed",
    title: "Chancellor, Tech University",
    bio: "A visionary in educational technology, Dr. Reed has pioneered several initiatives to integrate AI in learning.",
    image: "/placeholder.svg",
    role: "Chief Guest",
    icon: Award,
  },
  {
    name: "Mr. Samuel Chen",
    title: "CEO, Innovate Inc.",
    bio: "An alumnus of Parul University, Mr. Chen is a celebrated entrepreneur in the tech industry.",
    image: "/placeholder.svg",
    role: "Guest of Honor",
    icon: GraduationCap,
  },
];

export const notes = [
  {
    title: "Dress Code",
    description: "Formal attire is required. Graduates will be provided with academic regalia.",
    icon: GraduationCap,
  },
  {
    title: "Guest Policy",
    description: "Each graduate is allowed to bring up to two guests. Please register them in advance.",
    icon: Users,
  },
  {
    title: "Photography",
    description: "Official photographers will be present. Personal photography is permitted from designated areas.",
    icon: Calendar,
  },
  {
    title: "Parking & Transport",
    description: "Ample parking is available. Shuttle services will run from major points in the city.",
    icon: MapPin,
  },
];
