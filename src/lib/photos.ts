/*
 * Stock photos from Unsplash (free licence), stored in /public/photos.
 * Swap a file and its entry here to replace it with a real Brado photo.
 */

export type SitePhoto = {
  src: string;
  width: number;
  height: number;
  /** CSS object-position, so cropped frames keep the subject in view */
  focus: string;
  source: string;
  alt: { el: string; en: string };
};

export const SITE_PHOTOS = {
  hero: {
    src: "/photos/hero.jpg",
    width: 1800,
    height: 1200,
    focus: "42% 40%",
    source: "https://unsplash.com/photos/two-smiling-women-doing-yoga-pose-tj27cwu86Wk",
    alt: {
      el: "Δύο γυναίκες χαμογελούν και κάνουν high five στη μέση της προπόνησης",
      en: "Two women smiling and high-fiving mid-workout",
    },
  },
  welcomeLight: {
    src: "/photos/welcome-light.jpg",
    width: 1400,
    height: 933,
    focus: "50% 35%",
    source: "https://unsplash.com/photos/people-practicing-yoga-in-a-studio-OV3PU7FD6Fc",
    alt: {
      el: "Μικρή ομάδα προπονείται στο ζεστό απογευματινό φως",
      en: "A small group training in warm afternoon light",
    },
  },
  welcomeStretch: {
    src: "/photos/welcome-stretch.jpg",
    width: 1000,
    height: 563,
    focus: "58% 50%",
    source: "https://unsplash.com/photos/woman-stretching-on-yoga-mat-indoors-vcIsLI9doQM",
    alt: {
      el: "Γυναίκα κάνει διατάσεις σε ήρεμο χώρο με φυτά",
      en: "A woman stretching in a calm room with plants",
    },
  },
  momentCoach: {
    src: "/photos/moment-coach.jpg",
    width: 1100,
    height: 734,
    focus: "55% 30%",
    source: "https://unsplash.com/photos/woman-performs-exercise-with-trainer-at-gym-cCJQzTPkoFg",
    alt: {
      el: "Προπονητής δίπλα σε αθλήτρια που χαμογελάει",
      en: "A coach beside a smiling athlete",
    },
  },
  momentClass: {
    src: "/photos/moment-class.jpg",
    width: 1100,
    height: 629,
    focus: "52% 50%",
    source: "https://unsplash.com/photos/women-practicing-yoga-in-a-bright-studio-VvPNGs05z-8",
    alt: {
      el: "Μικρή ομάδα σε φωτεινό χώρο με μεγάλα παράθυρα",
      en: "A small group in a bright room with tall windows",
    },
  },
  momentShore: {
    src: "/photos/moment-shore.jpg",
    width: 1100,
    height: 619,
    focus: "45% 60%",
    source: "https://unsplash.com/photos/a-beach-with-blue-water-and-a-city-on-the-other-side-XdT0H4kvNEM",
    alt: {
      el: "Η ακτή του Πειραιά από ψηλά",
      en: "The Piraeus coastline from above",
    },
  },
  harbour: {
    src: "/photos/harbour.jpg",
    width: 2400,
    height: 1350,
    focus: "50% 55%",
    source: "https://unsplash.com/photos/a-city-next-to-a-body-of-water-ZnwqRX6DIMM",
    alt: {
      el: "Το λιμάνι του Πειραιά και η πόλη πάνω από τη θάλασσα",
      en: "Piraeus harbour and the city above the sea",
    },
  },
} satisfies Record<string, SitePhoto>;
