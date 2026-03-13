"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faGear, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TopHotBar() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/") return null;

  const navLinks = [
    { href: "/recipes_cookpot", icon: "/icons/misc/icon_cookpot.png", label: t("main.cookpot") },
    { href: "/recipes_warly", icon: "/icons/misc/icon_cookpot_warly.png", label: t("main.cookpot_warly") },
    { href: "/recipes_keg", icon: "/icons/misc/icon_cookpot_keg.png", label: t("main.cookpot_keg") },
    { href: "/recipes_jar", icon: "/icons/misc/icon_cookpot_jar.png", label: t("main.cookpot_jar") },
    { href: "/recipes_seasonal", icon: "/icons/misc/icon_cookpot_seasonal.png", label: t("main.cookpot_seasonal") },
    { href: "/ingredients", icon: "/icons/misc/icon_ingredients.png", label: t("main.ingredients") },
  ];

  return (
    <div
      key={locale}
      className="fixed top-0 left-0 w-full z-50 bg-zinc-200 dark:bg-zinc-900 shadow-md flex items-center justify-between p-2">
      <div className="flex items-center">
        <Link href="/">
          <button className="flex items-center gap-2 px-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer drop-shadow-md">
            <FontAwesomeIcon icon={faHouse} className="w-6 h-6" />
          </button>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 drop-shadow-md">
        <Link href="/recipes_cookpot">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer">
            <img src="/icons/misc/icon_cookpot.png" className="w-6 h-6 object-contain"/>
            {t("main.cookpot")}
          </button>
        </Link>

        <Link href="/recipes_warly">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer">
            <img src="/icons/misc/icon_cookpot_warly.png" className="w-6 h-6 object-contain"/>
            {t("main.cookpot_warly")}
          </button>
        </Link>

        {/* NAV LINKS — desktop only */}
        <div className="hidden md:flex items-center justify-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer">
                <img src={link.icon} className="w-6 h-6 object-contain" />
                {link.label}
              </button>
            </Link>
          ))}
        </div>

        {/* RIGHT: SETTINGS + HAMBURGER */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/settings">
            <button className="flex items-center gap-2 px-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer">
              <FontAwesomeIcon icon={faGear} className="w-6 h-6" />
            </button>
          </Link>

          {/* HAMBURGER — mobile only */}
          <button
            className="md:hidden flex items-center gap-2 px-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <Link href="/settings">
          <button className="flex items-center gap-2 px-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition font-bold cursor-pointer drop-shadow-md">
            <FontAwesomeIcon icon={faGear} className="w-6 h-6" />
          </button>
        </Link>
      </div>
    </div>
  );
}

