"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { getAssetPath } from "@/lib/paths";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function RandomTips() {
  const { t } = useTranslation();
  const tipDuration = 10000;

  const tips = useMemo(() => {
    const list: string[] = [];

    for (let i = 1; ; i++) {
      const key = `randomtips.tip${i}`;
      const value = t(key);

      if (value === key) {
        break;
      }

      list.push(value);
    }

    return list;
  }, [t]);

  const [history, setHistory] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(tips.length, 1)),
  );

  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  function getRandomIndex(exclude?: number) {
    if (tips.length <= 1) {
      return 0;
    }

    let newIndex = exclude ?? currentIndex;

    while (newIndex === (exclude ?? currentIndex)) {
      newIndex = Math.floor(Math.random() * tips.length);
    }

    return newIndex;
  }

  function getNewRandomTip() {
    const newIndex = getRandomIndex();

    setSlideDirection("right");

    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex(newIndex);
  }

  function getPreviousTip() {
    if (history.length === 0) return;

    setSlideDirection("left");

    const previous = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(previous);
  }

  // Changes every 10 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex(getRandomIndex(currentIndex));
    }, tipDuration); // 10000

    return () => clearInterval(interval);
  }, [currentIndex]);

  if (tips.length === 0) {
    return null;
  }

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = tipDuration;
    const intervalMs = 50;

    setProgress(100);

    const startedAt = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;

      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* TITLE */}
      <div className="flex items-center gap-3">
        <img
          src={getAssetPath("/icons/misc/icon_tips.png")}
          className="w-15 h-15 sm:w-20 sm:h-20 object-contain drop-shadow-md"
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white drop-shadow-md">
          {t("randomtips.title")}
        </h1>
      </div>

      {/* TIP BOX */}
      <div
        className="
        w-full max-w-2xl
        min-h-[170px]
        bg-zinc-100 dark:bg-zinc-900
        rounded-2xl
        px-5 py-4
        shadow-md
        flex flex-col
        items-center
        justify-center
        mt-1
        mb-4
        "
      >
        {/* TOP CONTENT */}
        <div className="flex flex-col items-center w-full">
          {/* TIP NUMBER */}
          <span
            key={`tip-number-${currentIndex}`}
            className={`
            mb-2
            text-base sm:text-lg
            font-extrabold
            tracking-[0.2em]
            uppercase
            text-zinc-500 dark:text-zinc-400
            drop-shadow-sm
            ${slideDirection === "right" ? "tip-slide-right" : "tip-slide-left"}
            `}
          >
            {t("randomtips.number")}
            {currentIndex + 1}
          </span>

          {/* TIP TEXT */}
          <div className="relative w-full overflow-hidden">
            <p
              key={currentIndex}
              className={`
              font-semibold
              text-center
              text-sm sm:text-base
              text-zinc-700 dark:text-zinc-300
              leading-relaxed
              ${slideDirection === "right" ? "tip-slide-right" : "tip-slide-left"}
              `}
            >
              {tips[currentIndex]}
            </p>
          </div>
        </div>

        {/* TIMER BAR */}
        <div className="w-1/2 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden mt-6">
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

      {/* BUTTONS */}
      <div className="flex items-center gap-3">
        <button
          onClick={getPreviousTip}
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
          disabled:hover:text-zinc-400
          "
        >
          <TopEffect
            tooltip={t("randomtips.previous")}
            value={
              <FontAwesomeIcon
                icon={faCircleChevronLeft}
                className={history.length === 0 ? "opacity-30" : ""}
              />
            }
          />
        </button>

        <button
          onClick={getNewRandomTip}
          className="
          group
          text-3xl
          text-zinc-700
          dark:text-zinc-200
          hover:text-black
          dark:hover:text-white
          transition
          hover:scale-110
          "
        >
          <TopEffect
            tooltip={t("randomtips.next")}
            value={<FontAwesomeIcon icon={faCircleChevronRight} />}
          />
        </button>
      </div>
    </div>
  );
}

function TopEffect({ value, tooltip }: any) {
  return (
    <div className="relative flex items-center justify-center">
      {value}

      <div
        className="
          absolute bottom-full mb-2 left-1/2 -translate-x-1/2
          opacity-0 invisible
          transition-all duration-150
          pointer-events-none

          group-hover:opacity-100
          group-hover:visible

          bg-black text-white
          dark:bg-white dark:text-black
          text-xs
          px-3 py-1
          rounded-lg
          shadow-lg
          z-50
          whitespace-nowrap
        "
      >
        {tooltip}
      </div>
    </div>
  );
}
