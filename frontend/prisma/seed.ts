import {
  Applicability,
  PrismaClient,
  ResourceKind,
  ResourceDocumentType,
} from "@prisma/client";

const prisma = new PrismaClient();

const checklistGroups = [
  {
    slug: "employment-requirements",
    title: "Employment requirements",
    subtitle: "Paperwork first — the shop can’t schedule you without it.",
    sortOrder: 10,
    items: [
      ["form-i9-process", "Form I-9 process", Applicability.W2],
      ["w2-tax-documentation", "Federal and state tax documentation", Applicability.W2],
      ["form-w9", "Form W-9", Applicability.CONTRACTOR_1099],
      ["direct-deposit-setup", "Direct deposit setup", Applicability.ALL],
      ["emergency-contact", "Emergency contact information", Applicability.ALL],
      ["employment-acknowledgments", "Required employment acknowledgments", Applicability.W2],
      ["license-verification", "License or certification verification (where applicable)", Applicability.ALL],
    ] as const,
  },
  {
    slug: "shop-setup",
    title: "Shop setup",
    subtitle: "Getting you visible, reachable, and on the schedule.",
    sortOrder: 20,
    items: [
      ["complete-profile", "Complete your employee profile", Applicability.ALL],
      ["professional-headshot", "Upload or schedule a professional headshot", Applicability.ALL],
      ["confirm-contact-information", "Confirm contact information", Applicability.ALL],
      ["confirm-work-availability", "Confirm work availability", Applicability.ALL],
      ["dress-appearance-standards", "Review dress and appearance standards", Applicability.ALL],
      ["scheduling-system-access", "Receive scheduling-system access", Applicability.ALL],
      ["communication-system-access", "Receive required communication or system access", Applicability.ALL],
      ["know-resource-library", "Know where shop resources and reference documents live", Applicability.ALL],
    ] as const,
  },
  {
    slug: "required-meetings",
    title: "Required meetings",
    subtitle: "Tracked automatically from your meeting journey.",
    sortOrder: 30,
    items: [] as const,
  },
  {
    slug: "external-training-access",
    title: "External training access",
    subtitle: "Access and orientation — not training completion.",
    sortOrder: 40,
    items: [
      ["training-platform-access", "Receive training-platform access", Applicability.ALL],
      ["confirm-training-login", "Confirm your login works", Applicability.ALL],
      ["open-training-platform", "Open the training platform", Applicability.ALL],
      ["future-training-location", "Acknowledge where future training will take place", Applicability.ALL],
    ] as const,
  },
];

const meetings = [
  ["handbook-meeting", "Handbook Meeting", "Review the employee handbook, workplace expectations, policies, culture, and important procedures.", 45, 10, false],
  ["front-desk-standards", "Front Desk & Concierge Standards", "Learn the shop’s guest-service and hospitality expectations.", 45, 20, false],
  ["assistant-stylist-program", "Assistant Stylist Program", "Learn the structure, mentorship, milestones, and expectations of the Assistant Stylist Program.", 45, 30, true],
  ["artisan-continued-development", "Artisan Continued Development", "Learn how ongoing education works and how to access the separate training platform.", 30, 40, false],
] as const;

const resources = [
  {
    slug: "shop-documents",
    title: "Shop documents",
    description: "Core documents and standards for working at Artisan.",
    applicability: Applicability.ALL,
    sortOrder: 10,
    content: { eyebrow: "Shop", intro: "Policies, standards and forms you can read any time.", sections: [] },
    // The prototype's handbook and dress files contain worksheet placeholder
    // bytes, so they must not be presented as real shop documents.
    documents: [],
  },
  {
    slug: "new-york-1099-resources",
    title: "1099 Resources — New York",
    description: "Reference links for independent contractors working in New York.",
    applicability: Applicability.CONTRACTOR_1099,
    sortOrder: 20,
    content: {
      eyebrow: "1099 · New York",
      introduction: "First principles for tracking income, tracking expenses, and filing taxes as a 1099 worker in New York. Optional reference material only—not legal or tax advice.",
      sections: [
        { heading: "The number that matters", body: "Track gross receipts, ordinary business expenses, and net profit separately. Keep contemporaneous records rather than reconstructing them at filing time." },
        { heading: "Build a repeatable cadence", body: "Record cash and tips daily, reconcile monthly, review estimated payments quarterly, and reconcile tax forms against your own totals annually." },
        { heading: "When to get professional help", body: "Ask a qualified tax professional about multi-state work, classification questions, agency notices, employees or subcontractors, and major income changes." },
      ],
    },
    documents: [
      {
        slug: "irs-gig-economy-tax-center",
        title: "IRS Gig Economy Tax Center",
        description: "The IRS’s current starting point for gig-economy tax guidance.",
        type: ResourceDocumentType.EXTERNAL_LINK,
        kind: ResourceKind.REFERENCE,
        externalUrl: "https://www.irs.gov/businesses/gig-economy-tax-center",
        isRequired: false,
        sortOrder: 30,
      },
      {
        slug: "ny-freelance-isnt-free",
        title: "NYSDOL — Freelance Isn’t Free Act",
        description: "Official guidance, including the model Freelance Worker Agreement.",
        type: ResourceDocumentType.EXTERNAL_LINK,
        kind: ResourceKind.REFERENCE,
        externalUrl: "https://dol.ny.gov/freelance-isnt-free-act",
        isRequired: false,
        sortOrder: 40,
      },
    ],
  },
  {
    slug: "health-sanitation",
    title: "Health & sanitation",
    description: "Official health, safety, and sanitation references.",
    applicability: Applicability.ALL,
    sortOrder: 30,
    content: { eyebrow: "Health", intro: "Sanitation standards and the state’s own guidance.", sections: [] },
    documents: [
      {
        slug: "nys-barbering",
        title: "NYS Division of Licensing — barbering",
        description: "Licensing, renewal and the state’s sanitation requirements.",
        type: ResourceDocumentType.EXTERNAL_LINK,
        kind: ResourceKind.REFERENCE,
        externalUrl: "https://dos.ny.gov/barber",
        isRequired: false,
        sortOrder: 20,
      },
    ],
  },
] as const;

async function seed() {
  await prisma.$transaction(async (tx) => {
    // Superseded seed rows are hidden rather than deleted so existing employee
    // history remains intact across repeatable seed runs.
    await tx.checklistItem.updateMany({ data: { isActive: false } });
    await tx.checklistGroup.updateMany({ data: { isActive: false } });
    await tx.meeting.updateMany({ data: { isActive: false } });
    // Uploaded resources are Admin-owned content. A repeat seed must never
    // unpublish or otherwise mutate them; only the stable seed slugs below
    // are managed by this script.
    await tx.resourceCategory.updateMany({ data: { isPublished: false } });

    for (const group of checklistGroups) {
      const savedGroup = await tx.checklistGroup.upsert({
        where: { slug: group.slug },
        update: {
          title: group.title,
          subtitle: group.subtitle,
          sortOrder: group.sortOrder,
          isActive: true,
        },
        create: {
          slug: group.slug,
          title: group.title,
          subtitle: group.subtitle,
          sortOrder: group.sortOrder,
        },
      });
      for (const [index, [slug, label, applicability]] of group.items.entries()) {
        await tx.checklistItem.upsert({
          where: { slug },
          update: { groupId: savedGroup.id, label, applicability, sortOrder: (index + 1) * 10, isActive: true },
          create: { groupId: savedGroup.id, slug, label, applicability, sortOrder: (index + 1) * 10 },
        });
      }
    }

    for (const [slug, title, description, durationMinutes, sortOrder, requiresAssistantStylist] of meetings) {
      await tx.meeting.upsert({
        where: { slug },
        update: { title, description, durationMinutes, sortOrder, requiresAssistantStylist, isActive: true },
        create: { slug, title, description, durationMinutes, sortOrder, requiresAssistantStylist },
      });
    }

    for (const category of resources) {
      const savedCategory = await tx.resourceCategory.upsert({
        where: { slug: category.slug },
        update: {
          title: category.title,
          description: category.description,
          applicability: category.applicability,
          sortOrder: category.sortOrder,
          articleContent: category.content,
          isPublished: true,
        },
        create: {
          slug: category.slug,
          title: category.title,
          description: category.description,
          applicability: category.applicability,
          sortOrder: category.sortOrder,
          articleContent: category.content,
          isPublished: true,
        },
      });
      for (const document of category.documents) {
        await tx.resourceDocument.upsert({
          where: { slug: document.slug },
          update: { ...document, categoryId: savedCategory.id, version: 1, isPublished: true },
          create: { ...document, categoryId: savedCategory.id, version: 1, isPublished: true },
        });
      }
    }
  });
}

seed()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
