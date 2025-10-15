"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "@/app/shop/page.module.css";

export default function ShopControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "LATEST";

  const setSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("after"); // reset pagination when sort changes
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.shopSettings}>
      {/* Sort */}
      <div className={styles.shopSettingsCat}>
        <h1>Sort</h1>
        <button
          className={currentSort === "LATEST" ? styles.activeControl : ""}
          onClick={() => setSort("LATEST")}
        >
          Latest Arrivals
        </button>
        <button
          className={currentSort === "PRICE_HIGH" ? styles.activeControl : ""}
          onClick={() => setSort("PRICE_HIGH")}
        >
          Price: High to Low
        </button>
        <button
          className={currentSort === "PRICE_LOW" ? styles.activeControl : ""}
          onClick={() => setSort("PRICE_LOW")}
        >
          Price: Low to High
        </button>
        <button
          className={currentSort === "ALPHA" ? styles.activeControl : ""}
          onClick={() => setSort("ALPHA")}
        >
          Alphabetical
        </button>
        <button
          className={currentSort === "OLDEST" ? styles.activeControl : ""}
          onClick={() => setSort("OLDEST")}
        >
          Oldest First
        </button>
      </div>

      {/* Filter (navigate to other collection routes) */}
      <div className={styles.shopSettingsCol}>
        <h1>Filter</h1>
        <Link href="/shop/all">All</Link>
        <Link href="/shop/wardrobe">Clothing</Link>
        <Link href="/shop/tools">Tools</Link>
        <Link href="/shop/grooming">Grooming</Link>
        <Link href="/shop/sale">Sale</Link>
      </div>
    </div>
  );
}
