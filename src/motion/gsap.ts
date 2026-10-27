import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registered once for the whole app; every section imports gsap from here.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
