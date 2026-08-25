export type FoundationImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export type Activation = {
  id: string;
  number: string;
  year: string;
  date: string;
  title: string;
  treatment: "expanded" | "standard" | "standard-small" | "sparse";
  location?: string;
  collaborators: string[];
  participantCount?: string;
  activities: string[];
  summary: string;
  images: FoundationImage[];
};

export const openingImage: FoundationImage = {
  src: "/images/foundation/2021-11-bronx-academy/launch-group-vintage-shirts.webp",
  width: 1616,
  height: 1080,
  alt: "Group of students and adults holding vintage T-shirts in a school library.",
  caption:
    "Students and adult participants with vintage T-shirts during the Bronx Academy launch, November 2021.",
};

export const methodology = [
  {
    number: "01",
    heading: "Care, first.",
    body: "The Foundation begins with practical care: free haircuts for low-income public schools, grooming support, and hygiene products. The setting is personal and immediate, creating space for a wider conversation about wellness and what comes next.",
  },
  {
    number: "02",
    heading: "A private practice of self-care.",
    body: "Journaling and individualized support bring reflection into the program alongside grooming and hygiene. Wellness is treated as something practiced, discussed, and carried into daily life.",
  },
  {
    number: "03",
    heading: "From individual care to the room.",
    body: "Group empowerment and career-building sessions move the work from individual support into shared discussion. Students encounter different ways of working across business and creative fields.",
  },
  {
    number: "04",
    heading: "Work, made visible.",
    body: "Activations connect career conversation to practical activity: entrepreneurship, finance, grooming-product development, and business and product exposure. The subjects change; professional experience is brought within view.",
  },
];

export const surveyEvidence = [
  {
    value: "40%",
    statement: "aspire to become an entrepreneur, artist, or freelancer.",
  },
  {
    value: "90%",
    statement:
      "are interested in personal wellness and have a self-care routine.",
  },
  {
    value: "100%",
    statement: "help their families with physical and mental support.",
  },
];

export const activations: Activation[] = [
  {
    id: "bronx-academy-launch",
    number: "01",
    year: "2021",
    date: "November 2021",
    title: "Bronx Academy Launch",
    treatment: "expanded",
    location: "Bronx Academy",
    collaborators: ["Entrepreneurship guest speakers"],
    participantCount: "Approximately 18 students",
    activities: [
      "Entrepreneurship conversations",
      "Grooming and haircuts",
      "Grooming kits and vintage T-shirts",
    ],
    summary:
      "The first documented activation brought approximately 18 students together at Bronx Academy for entrepreneurship conversations, grooming, and a distribution of grooming kits and vintage T-shirts.",
    images: [
      {
        src: "/images/foundation/2021-11-bronx-academy/student-haircut.webp",
        width: 1616,
        height: 1080,
        alt: "Barber cutting a student's hair at a grooming station in a school room.",
        caption:
          "A grooming session during the first documented Bronx Academy activation.",
      },
      {
        src: "/images/foundation/2021-11-bronx-academy/guest-speaker-circle.webp",
        width: 1600,
        height: 1069,
        alt: "Adult guest speaker addressing students seated in a circle.",
        caption:
          "A guest speaker in conversation with students during the launch activation.",
      },
      {
        src: "/images/foundation/2021-11-bronx-academy/haircut-detail.webp",
        width: 1200,
        height: 802,
        alt: "Close view of a barber's hands shaping a student's haircut.",
        caption: "Detail from a haircut during the November 2021 activation.",
      },
    ],
  },
  {
    id: "bronx-academy-spring",
    number: "02",
    year: "2022",
    date: "Spring 2022",
    title: "Bronx Academy, Spring 2022",
    treatment: "sparse",
    location: "Bronx Academy High School",
    collaborators: [
      "Marketing executives",
      "Painter and sculptor",
      "Clothing designer",
    ],
    participantCount: "Approximately 18 students",
    activities: ["Creative and career conversation", "Launch-style giveaway"],
    summary:
      "A second Bronx Academy activation brought approximately 18 students into conversation with marketing executives, a painter and sculptor, and a clothing designer, followed by a giveaway similar to the 2021 launch.",
    images: [],
  },
  {
    id: "finance-collective-focus",
    number: "03",
    year: "2022",
    date: "June 2022",
    title: "Finance, Grooming, and Collective Focus",
    treatment: "standard-small",
    collaborators: ["Finance coach Chad Wellington", "Collective Focus"],
    participantCount:
      "Approximately 12 middle schoolers and several high school students",
    activities: ["Finance coaching", "Group discussion", "Grooming"],
    summary:
      "Chad Wellington joined approximately 12 middle schoolers and several high school students for finance coaching, alongside group discussion and grooming activity documented with Collective Focus.",
    images: [
      {
        src: "/images/foundation/2022-06-finance/student-haircut-portrait.webp",
        width: 1600,
        height: 2133,
        alt: "Student shown in profile after a haircut.",
        caption:
          "Grooming activity documented during the June 2022 finance session.",
      },
      {
        src: "/images/foundation/2022-06-finance/discussion-circle.webp",
        width: 542,
        height: 723,
        alt: "Students and adults seated in a discussion circle inside a classroom.",
        caption:
          "Students and adults gathered in a discussion circle during the June 2022 activation.",
      },
      {
        src: "/images/foundation/2022-06-finance/collective-focus-context.webp",
        width: 542,
        height: 723,
        alt: "Two adults seated behind a table with a Collective Focus banner.",
        caption:
          "Collective Focus context documented during the June 2022 activation.",
      },
    ],
  },
  {
    id: "harrys-mental-health",
    number: "04",
    year: "2023",
    date: "March 2023",
    title: "Harry's Mental Health Collaboration",
    treatment: "expanded",
    collaborators: ["Harry's"],
    participantCount: "Approximately 15 students",
    activities: [
      "Grooming-product development",
      "Barbering",
      "Presentation and product distribution",
    ],
    summary:
      "Approximately 15 students took part in a Harry's Mental Health collaboration centered on grooming-product development, barbering, presentation, and hands-on group activity.",
    images: [
      {
        src: "/images/foundation/2023-03-harrys/product-design-workshop.webp",
        width: 2400,
        height: 1800,
        alt: "Students gathered around a table and screen during a grooming-product activity.",
        caption:
          "Students gathered around a digital grooming-product exercise during the Harry's collaboration.",
      },
      {
        src: "/images/foundation/2023-03-harrys/active-barbering.webp",
        width: 1800,
        height: 2400,
        alt: "Barber working closely on a student's haircut during a school session.",
        caption: "Barbering during the Harry's collaboration, March 2023.",
      },
      {
        src: "/images/foundation/2023-03-harrys/harrys-products-portrait.webp",
        width: 1600,
        height: 2133,
        alt: "Student seated beside a barber with Harry's grooming products displayed nearby.",
        caption:
          "A student and barber with Harry's grooming products during the March 2023 collaboration.",
      },
      {
        src: "/images/foundation/2023-03-harrys/group-presentation.webp",
        width: 2000,
        height: 1500,
        alt: "Presenter speaking to students seated in rows during a community presentation.",
        caption: "A group presentation during the March 2023 activation.",
      },
    ],
  },
  {
    id: "all-kings",
    number: "05",
    year: "2023",
    date: "November 2023",
    title: "All Kings Foundation Collaboration",
    treatment: "standard",
    collaborators: ["All Kings Foundation"],
    activities: ["Grooming", "Community activity", "Multiple barber stations"],
    summary:
      "The November 2023 collaboration with All Kings Foundation brought grooming and community activity together across multiple barber stations.",
    images: [
      {
        src: "/images/foundation/2023-11-all-kings/room-activity.webp",
        width: 2400,
        height: 1800,
        alt: "Community discussion and barbering activity taking place in the same school room.",
        caption:
          "Community discussion and grooming activity during the All Kings Foundation collaboration, November 2023.",
      },
      {
        src: "/images/foundation/2023-11-all-kings/multiple-grooming-stations.webp",
        width: 1800,
        height: 2400,
        alt: "Several barbers working at grooming stations in the same school room.",
        caption:
          "Multiple grooming stations operating during the All Kings Foundation collaboration, November 2023.",
      },
    ],
  },
  {
    id: "ripe-finance",
    number: "06",
    year: "2024",
    date: "June 2024",
    title: "Ripe: Product, Business, and Finance",
    treatment: "expanded",
    collaborators: [
      "Mike Evans, identified in the source record as founder of Ripe",
      "Chase Wellington, finance presentation",
    ],
    activities: [
      "Ripe product and business presentation",
      "Finance presentation",
      "Hands-on currency exercise",
    ],
    summary:
      "The source record identifies Mike Evans as founder of Ripe in connection with a Ripe presentation and associates Chase Wellington with a finance presentation. The visible record documents Ripe branding, presentation activity, and a hands-on currency exercise.",
    images: [
      {
        src: "/images/foundation/2024-06-ripe/ripe-presentation.webp",
        width: 2400,
        height: 1800,
        alt: "Presenter holding a Ripe T-shirt while speaking to seated students.",
        caption:
          "A Ripe presentation with students during the June 2024 activation.",
      },
      {
        src: "/images/foundation/2024-06-ripe/finance-presentation.webp",
        width: 2000,
        height: 1500,
        alt: "Presenter standing beside students holding play currency during a finance activity.",
        caption:
          "A finance presentation and currency exercise during the June 2024 activation.",
      },
      {
        src: "/images/foundation/2024-06-ripe/currency-exercise.webp",
        width: 1600,
        height: 2133,
        alt: "Participants gathered around a table holding play currency during a finance exercise.",
        caption:
          "Participants working with play currency during a hands-on finance exercise, June 2024.",
      },
    ],
  },
  {
    id: "career-day",
    number: "07",
    year: "2025",
    date: "May 2025",
    title: "Career Day",
    treatment: "sparse",
    collaborators: [],
    activities: ["Career Day"],
    summary:
      "The supplied chronology records a May 2025 Career Day with Daniel Diaz, identified there as a Senior Account Executive at Google. The record does not establish Google as a sponsor or organizational partner.",
    images: [],
  },
];

export const collaboratorRows = [
  {
    name: "Chad Wellington",
    date: "June 2022",
    contribution: "Finance coaching",
  },
  {
    name: "Collective Focus",
    date: "June 2022",
    contribution: "Activation documented with Collective Focus",
  },
  {
    name: "Harry's",
    date: "March 2023",
    contribution: "Mental Health collaboration and grooming-product development",
  },
  {
    name: "All Kings Foundation",
    date: "November 2023",
    contribution: "Grooming and community collaboration",
  },
  {
    name: "Mike Evans / Ripe",
    date: "June 2024",
    contribution: "Product and business presentation; source record identifies Evans as founder of Ripe",
  },
  {
    name: "Chase Wellington",
    date: "June 2024",
    contribution: "Finance presentation",
  },
];

export const involvementRoutes = [
  "For schools",
  "For speakers and mentors",
  "For community partners",
  "For product partners and supporters",
];
