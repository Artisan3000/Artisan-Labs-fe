export const businessConfig = {
  foundedYear: 2017,
  verifiedClientCount: 5000,
  phone: {
    display: "(833) 750-2760",
    e164: "+1-833-750-2760",
  },
  address: {
    street: "331 East 81st Street",
    locality: "New York",
    region: "NY",
    postalCode: "10028",
    country: "US",
  },
  hours: {
    weekdays: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "11:00",
      closes: "19:00",
      display: "11:00 AM - 7:00 PM",
    },
    saturday: "Closed",
    sunday: "Appointment Only",
  },
  policies: {
    walkIns:
      "Walk-ins are always welcome to sit and wait for the next appointment, however booking ahead guarantees your time in the chair is reserved. You can also join our online wait list for a same-day standby appointment.",
    colorServices:
      "No. We're not offering any color services at our shop, however we can make referrals upon request.",
  },
} as const;

export const services = [
  {
    id: "clipper-and-scissor-cut",
    name: "Clipper and scissor cut",
    price: "$65+",
    description:
      "A classic shape built with clipper control, scissor detail, and a clean finish tailored to your hair and routine.",
  },
  {
    id: "beard-trim",
    name: "Beard trim",
    price: "$45+",
    description:
      "A precision trim that balances length, cleans the outline, and creates a polished beard shape.",
  },
  {
    id: "buzz-cut",
    name: "Buzz cut",
    price: "$55+",
    description:
      "An evenly dialed-in, low-maintenance cut with careful attention to the hairline and finish.",
  },
  {
    id: "hair-and-beard-combo",
    name: "Hair and beard combo",
    price: "$100+",
    description:
      "A complete appointment that coordinates your haircut, beard shape, and outline for one cohesive result.",
  },
  {
    id: "scissor-only-cut",
    name: "Scissor-only cut",
    price: "$75+",
    description:
      "A tailored scissor cut for clients who want controlled length, natural movement, and a softer silhouette.",
  },
  {
    id: "childrens-haircut",
    name: "Children's haircut",
    price: "$55+",
    description:
      "A patient, comfortable haircut experience designed for younger clients and their individual needs.",
  },
] as const;

export type ServiceId = (typeof services)[number]["id"];

export function formatAddress() {
  const { street, locality, region, postalCode } = businessConfig.address;
  return `${street}, ${locality}, ${region} ${postalCode}`;
}
