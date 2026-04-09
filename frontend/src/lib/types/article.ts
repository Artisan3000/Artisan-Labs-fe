export type Article = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  source: string;

  image?: {
    url: string;
    altText: string | null;
  } | null;

  authorV2?: {
    name: string;
  } | null;
};
