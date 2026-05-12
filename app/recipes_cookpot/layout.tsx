import React, { Suspense, ReactNode } from "react";

// Server-side metadata generation for Open Graph / embeds
export async function generateMetadata({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const recipeParam = Array.isArray(searchParams?.recipe) ? searchParams?.recipe[0] : searchParams?.recipe;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  // Load data on the server
  let recipesList: any[] = [];
  try {
    const mod = await import("@/data/recipes_cookpot.json");
    recipesList = (mod as any).default ?? mod;
  } catch (e) {
    recipesList = [];
  }

  let enLocale: any = {};
  try {
    const loc = await import("@/locales/en");
    enLocale = (loc as any).default ?? loc;
  } catch (e) {
    enLocale = {};
  }

  if (!recipeParam) {
    return {
      title: "Heap of Foods — Crock Pot",
      description: "A complete recipes sheet for the Heap of Foods Mod!",
      openGraph: {
        title: "Heap of Foods — Crock Pot",
        description: "A complete recipes sheet for the Heap of Foods Mod!",
        url: `https://heap-of-foods.com/recipes_cookpot`,
      },
    };
  }

  const recipe = recipesList.find((r: any) => r.name === recipeParam);

  const label = recipe
    ? enLocale.recipes?.[recipe.name] ?? recipe.name
    : recipeParam;

  const desc = recipe
    ? `Recipe ${label} — health ${recipe.health ?? "-"}, hunger ${recipe.hunger ?? "-"}, sanity ${recipe.sanity ?? "-"}`
    : `Recipe ${label} on Heap of Foods`;

  const imageUrl = `https://heap-of-foods.com${basePath}/foods_cookpot/${recipeParam}.png`;

  return {
    title: `${label} — Heap of Foods`,
    description: desc,
    openGraph: {
      title: `${label} — Heap of Foods`,
      description: desc,
      url: `https://heap-of-foods.com/recipes_cookpot?recipe=${encodeURIComponent(recipeParam)}`,
      images: [
        {
          url: imageUrl,
          alt: label,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} — Heap of Foods`,
      description: desc,
      images: [imageUrl],
    },
  };
}

export default function CookpotLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      {children}
    </Suspense>
  );
}
