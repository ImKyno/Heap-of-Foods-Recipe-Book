"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { getAssetPath } from "@/lib/paths";
import { useRouter, usePathname } from "next/navigation";
import SkeletonImage from "@/components/SkeletonImage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";

import recipes from "@/data/recipes_cookpot.json";
import recipes_warly from "@/data/recipes_cookpot_warly.json";
import recipes_seasonal from "@/data/recipes_cookpot_seasonal.json";
import recipes_jar from "@/data/recipes_cookpot_jar.json";
import recipes_keg from "@/data/recipes_cookpot_keg.json";

type SourceKeys = "cookpot" | "warly" | "jar" | "keg" | "seasonal";

interface RecipeType {
  name: string;
  health?: number;
  hunger?: number;
  sanity?: number;
  temperature?: number | null;
  temperatureDuration?: number | null;
  debuff?: boolean;
  foodtype?: string;

  prefix: string;
  icon: string;
  source: SourceKeys;
}

interface FoodTypeProps {
  type: string;
  t: (key: string) => string;
}

const NEW_RECIPES = [
  { name: "cavetubertea", source: "cookpot" as const },
  { name: "mandrakepie", source: "cookpot" as const },
  { name: "rainparfait", source: "cookpot" as const },
  { name: "midnightfeast", source: "cookpot" as const },
  { name: "mandrakebaobuns", source: "warly" as const },
  { name: "mandrakebeer", source: "keg" as const },
  { name: "juice_cavetuber", source: "keg" as const },
  { name: "juice_cavetuber_blooming", source: "keg" as const },
  { name: "pickles_cavetuber", source: "jar" as const },
  { name: "pickles_cavetuber_blooming", source: "jar" as const },
];

export default function NewlyAddedRecipes() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const ROTATION_MS = 10000;

  const allRecipes = [
    ...recipes.map((r) => ({
      ...r,
      prefix: "recipes",
      icon: "foods_cookpot",
      source: "cookpot" as const,
    })),

    ...recipes_warly.map((r) => ({
      ...r,
      prefix: "recipes_warly",
      icon: "foods_cookpot_warly",
      source: "warly" as const,
    })),

    ...recipes_seasonal.map((r) => ({
      ...r,
      prefix: "recipes_seasonal",
      icon: "foods_cookpot_seasonal",
      source: "seasonal" as const,
    })),

    ...recipes_jar.map((r) => ({
      ...r,
      prefix: "recipes_jar",
      icon: "foods_cookpot_jar",
      source: "jar" as const,
    })),

    ...recipes_keg.map((r) => ({
      ...r,
      prefix: "recipes_keg",
      icon: "foods_cookpot_keg",
      source: "keg" as const,
    })),
  ];

  const SOURCE_INFO = {
    cookpot: {
      icon: getAssetPath("/icons/misc/icon_cookpot.png"),
      name: t("main.cookpot"),
      page: "/recipes_cookpot",
    },

    warly: {
      icon: getAssetPath("/icons/misc/icon_cookpot_warly.png"),
      name: t("main.cookpot_warly"),
      page: "/recipes_warly",
    },

    seasonal: {
      icon: getAssetPath("/icons/misc/icon_cookpot_seasonal.png"),
      name: t("main.cookpot_seasonal"),
      page: "/recipes_seasonal",
    },

    jar: {
      icon: getAssetPath("/icons/misc/icon_cookpot_jar.png"),
      name: t("main.cookpot_jar"),
      page: "/recipes_jar",
    },

    keg: {
      icon: getAssetPath("/icons/misc/icon_cookpot_keg.png"),
      name: t("main.cookpot_keg"),
      page: "/recipes_keg",
    },
  } as const;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [progress, setProgress] = useState(100);

  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  const recipeRef = NEW_RECIPES[currentIndex];

  const recipe = allRecipes.find(
    (r) => r.name === recipeRef.name && r.source === recipeRef.source,
  );

  if (!recipe) {
    return null;
  }

  const source = SOURCE_INFO[recipe.source];

  function nextRecipe() {
    setSlideDirection("right");

    setHistory((prev) => [...prev, currentIndex]);

    setCurrentIndex((prev) => (prev >= NEW_RECIPES.length - 1 ? 0 : prev + 1));
  }

  function previousRecipe() {
    if (history.length === 0) {
      return;
    }

    setSlideDirection("left");

    const previous = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(previous);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection("right");

      setHistory((prev) => [...prev, currentIndex]);

      setCurrentIndex((prev) =>
        prev >= NEW_RECIPES.length - 1 ? 0 : prev + 1,
      );
    }, ROTATION_MS);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const intervalMs = 50;

    setProgress(100);

    const startedAt = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;

      const remaining = Math.max(0, 100 - (elapsed / ROTATION_MS) * 100);

      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [currentIndex]);

  function formatTemperature(
    temperature: number,
    temperatureDuration: number | null,
  ) {
    if (temperature == null || temperatureDuration == null) return "";

    const sign = temperature > 0 ? "+" : temperature < 0 ? "-" : "";
    const tempValue = Math.abs(temperature);
    const seconds = temperatureDuration;

    let timeString = "";

    if (seconds <= 60) timeString = `${seconds} ${t("time.seconds")}`;
    else if (seconds < 480) timeString = `${seconds / 60} ${t("time.minutes")}`;
    else timeString = t("time.oneday");

    return `${sign}${tempValue} ${t("time.for")} ${timeString}`;
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white text-center drop-shadow-md">
        {t("pages.home.newlyadded.title")}
      </h1>

      <div className="max-w-4xl sm:max-w-4xl text-center text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed px-2 whitespace-pre-line">
        <p className="font-semibold">
          {t("pages.home.newlyadded.desc")}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 flex flex-col gap-4 w-full max-w-4xl sm:max-w-2xl shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div
            key={`image-${recipe.name}`}
            className={
              slideDirection === "right" ? "tip-slide-right" : "tip-slide-left"
            }
          >
            <SkeletonImage
              src={getAssetPath(`/${recipe.icon}/${recipe.name}.png`)}
              className="w-24 h-24 sm:w-35 sm:h-35 flex-shrink-0 sm:ml-10"
              skeletonClassName="rounded-xl"
            />
          </div>

          <div className="flex flex-col flex-1 gap-4 items-center text-center">
            <div className="flex flex-col gap-1 items-center">
              <h2
                key={`title-${recipe.name}`}
                className={`
            text-xl sm:text-2xl font-bold
            ${slideDirection === "right" ? "tip-slide-right" : "tip-slide-left"}
          `}
              >
                {t(`${recipe.prefix}.${recipe.name}`)}
              </h2>

              <div
                key={`source-${recipe.name}`}
                className={`
            flex items-center gap-2
            ${slideDirection === "right" ? "tip-slide-right" : "tip-slide-left"}
          `}
              >
                <img
                  src={source.icon}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />

                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {source.name}
                </span>

                <button
                  onClick={() => {
                    const page = source.page;

                    if (pathname !== page) {
                      router.push(`${page}?recipe=${recipe.name}`);
                    } else {
                      const element = document.getElementById(
                        `recipe-${recipe.name}`,
                      );

                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }
                  }}
                  className="ml-2 bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                >
                  {t("pages.home.daily.details")}
                </button>
              </div>
            </div>
            <div className="flex justify-center flex-wrap">
              <Stat
                icon={getAssetPath("/icons/cooking/icon_health.png")}
                value={recipe.health}
                tooltip={t("tooltips.health")}
                isStatus
              />
              <Stat
                icon={getAssetPath("/icons/cooking/icon_hunger.png")}
                value={recipe.hunger}
                tooltip={t("tooltips.hunger")}
                isStatus
              />
              <Stat
                icon={getAssetPath("/icons/cooking/icon_sanity.png")}
                value={recipe.sanity}
                tooltip={t("tooltips.sanity")}
                isStatus
              />
            </div>

            <div className="flex gap-2 flex-wrap font-bold justify-center">
              {recipe.foodtype && <FoodType type={recipe.foodtype} t={t} />}
              {recipe.temperature != null && (
                <TopEffect
                  icon={getAssetPath(
                    recipe.temperature > 0
                      ? "/icons/cooking/icon_temperature_hot.png"
                      : "/icons/cooking/icon_temperature_cold.png",
                  )}
                  value={formatTemperature(
                    recipe.temperature,
                    recipe.temperatureDuration ?? 0,
                  )}
                  tooltip={t("tooltips.temperature")}
                />
              )}
              {recipe.debuff && (
                <TopEffect
                  icon={getAssetPath("/icons/cooking/icon_debuff.png")}
                  value={t(`recipes_debuff.${recipe.name}`)}
                  tooltip={t("tooltips.debuff")}
                />
              )}
              {recipe.characterfood &&
                (Array.isArray(recipe.characterfood)
                  ? recipe.characterfood
                  : [recipe.characterfood]
                ).map((char) => (
                  <TopEffect
                    key={char}
                    icon={getAssetPath(
                      `/icons/characters/character_${char}.png`,
                    )}
                    value={t(`characterfood.${char}`)}
                    tooltip={t("tooltips.characterfood")}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* TIMER BAR */}
        <div className="flex justify-center">
          <div className="w-80 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="
        h-full
        bg-zinc-700 dark:bg-zinc-200
        transition-[width]
        duration-75
        ease-linear
        rounded-full
      "
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-3">
        <button
          onClick={previousRecipe}
          disabled={history.length === 0}
          className="
            group
            text-3xl
            text-zinc-700
            dark:text-zinc-200
            hover:text-zinc-800
            dark:hover:text-white
            transition
            hover:scale-110
          "
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>

        <span className="font-bold text-zinc-600 dark:text-zinc-300">
          {currentIndex + 1}/{NEW_RECIPES.length}
        </span>

        <button
          onClick={nextRecipe}
          className="
            text-3xl
            text-zinc-700
            dark:text-zinc-200
            hover:text-black
            dark:hover:text-white
            transition
            hover:scale-110
          "
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  bonus = 0,
  tooltip,
  isStatus = false,
  recipe,
  stat,
}: any) {
  if (value === undefined || value === null) return null;

  let displayValue = value;
  let colorClass = "text-zinc-900 dark:text-white";

  if (isStatus) {
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      if (numericValue > 0) {
        displayValue = `+${numericValue}`;
        colorClass = "text-green-500";
      } else if (numericValue < 0) {
        displayValue = `-${Math.abs(numericValue)}`;
        colorClass = "text-red-500";
      } else {
        displayValue = "0";
      }
    }
  }

  const extrasMap: Record<number, Set<string>> = {};

  const addExtra = (val: number, char: string) => {
    if (!extrasMap[val]) extrasMap[val] = new Set();
    extrasMap[val].add(char);
  };

  if (stat === "hunger" && recipe?.characterfood) {
    const charValue = (recipe.hunger ?? 0) + 15;
    addExtra(charValue, recipe.characterfood);
  }

  if (recipe?.monsterfood) {
    const monsterValue = recipe[`monster${stat}`];

    if (monsterValue && monsterValue !== value) {
      addExtra(monsterValue, "webber");
      addExtra(monsterValue, "wortox");
    }
  }

  if (recipe?.mermfood) {
    const mermValue = recipe[`merm${stat}`];

    if (mermValue && mermValue !== value) {
      addExtra(mermValue, "wurt");
    }
  }

  const extraValues = Object.entries(extrasMap).map(([value, chars]) => ({
    value: Number(value),
    characters: Array.from(chars),
  }));

  return (
    <div className="relative group flex items-center gap-2 min-w-[70px] sm:min-w-[100px] justify-center">
      <img src={icon} className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />

      <div className="flex flex-col items-center leading-tight">
        <span className={`text-base font-semibold ${colorClass}`}>
          {displayValue}

          {bonus > 0 && (
            <span className="text-sm ml-1 text-zinc-900 dark:text-white">
              (<span className="text-green-500">+{bonus}</span>)
            </span>
          )}
        </span>

        {extraValues.map((extra, i) => (
          <span
            key={i}
            className="flex items-center text-xs text-zinc-600 dark:text-zinc-400"
          >
            (
            <span className="text-green-500 font-semibold">
              {extra.value > 0 ? `+${extra.value}` : extra.value}
            </span>
            {extra.characters.map((char) => (
              <img
                key={char}
                src={getAssetPath(`/icons/characters/character_${char}.png`)}
                className="w-5 h-5"
              />
            ))}
            )
          </span>
        ))}
      </div>

      <div
        className="
        absolute bottom-full mb-2
        left-1/2 -translate-x-1/2
        hidden group-hover:block
        bg-black text-white dark:bg-white dark:text-black
        text-xs font-semibold
        px-3 py-1 rounded whitespace-nowrap
        shadow-lg z-50 pointer-events-none
      "
      >
        {tooltip}
      </div>
    </div>
  );
}

function FoodType({ type, t }: FoodTypeProps) {
  return (
    <div className="relative group flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs tracking-wide cursor-default">
      <img
        src={getAssetPath("/icons/cooking/icon_foodtype.png")}
        className="w-5 h-5 object-contain"
      />

      <span className="text-zinc-900 dark:text-white">
        {t(`foodtypes.${type}`)}
      </span>

      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 rounded whitespace-nowrap shadow-lg z-50 pointer-events-none">
        {t("tooltips.foodtype")}
      </div>
    </div>
  );
}

function TopEffect({ icon, value, tooltip }: any) {
  return (
    <div className="relative flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs tracking-wide group cursor-default">
      <img src={icon} className="w-5 h-5 object-contain" />

      <span className="text-zinc-900 dark:text-white">{value}</span>

      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs dark:bg-white dark:text-black px-3 py-1 rounded shadow-lg z-50 whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  );
}
