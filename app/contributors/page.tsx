"use client";

import { useTranslation } from "@/lib/i18n";
import { usePageTitle } from "@/components/PageTitle";
import contributors from "@/data/contributors.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faTwitch, faXTwitter, faDiscord, faKoFi } from "@fortawesome/free-brands-svg-icons";
import { 
  faMedal,
  faPiggyBank,
  faVideo,
  faCode,
  faFlask,
  faPalette,
  faBookAtlas,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";

interface Contributor {
  name: string;
  image: string;
  badges: string[];
  youtube?: string;
  twitch?: string;
  twitter?: string;
  specialIcon?: string;
}

const BADGE_ICONS: Record<string, any> = {
  "contributors.badges.donator": faMedal,
  "contributors.badges.topdonator": faPiggyBank,
  "contributors.badges.contentcreator": faVideo,
  "contributors.badges.moddev": faCode,
  "contributors.badges.modtester": faFlask,
  "contributors.badges.modartist": faPalette,
  "contributors.badges.modguide": faBookAtlas,
  "contributors.badges.modlocpl": faLanguage,
  "contributors.badges.modloczh": faLanguage,
};

const BADGE_COLORS: Record<string, string> = {
  "contributors.badges.donator": "#ef4444",
  "contributors.badges.topdonator": "#278a45",
  "contributors.badges.contentcreator": "#3b82f6",
  "contributors.badges.moddev": "#f9a20c",
  "contributors.badges.modtester": "#fe45d6",
  "contributors.badges.modartist": "#a855f7",
  "contributors.badges.modguide": "#10b981",
  "contributors.badges.modlocpl": "#378b9a",
  "contributors.badges.modloczh": "#378b9a",
};

function getBadgeColor(badgeKey: string): string {
  return BADGE_COLORS[badgeKey] || "#6b7280";
}

function getBadgeIcon(badgeKey: string): any {
  return BADGE_ICONS[badgeKey] || faMedal;
}

export default function ContributorsPage() {
  const { t } = useTranslation();
  usePageTitle(t("pages.contributors.title"));

  return (
    <div className="bg-zinc-300 dark:bg-zinc-800 text-zinc-900 dark:text-white min-h-screen">
      <div className="max-w-full pt-14"></div>

      {/* TITLE SECTION */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <h1 className="text-4xl font-bold text-center mb-3">
          {t("contributors.title")}
        </h1>
        <p className="text-center text-zinc-700 dark:text-zinc-300 mb-4">
          {t("contributors.description")}
        </p>

        <div className="w-full h-[2px] bg-zinc-400 dark:bg-zinc-600 mb-4" />

        {/* CTA TEXT */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          {t("contributors.cta")}
        </p>

        {/* BUTTONS */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://discord.gg/jjNr4Vvutn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 hover:scale-105 text-white rounded-lg transition font-bold"
          >
            <FontAwesomeIcon icon={faDiscord} />
            {t("footer.discord")}
          </a>

          <a
            href="https://ko-fi.com/kynoox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 hover:scale-105 text-white rounded-lg transition font-bold"
          >
            <FontAwesomeIcon icon={faKoFi} />
            {t("footer.kofi")}
          </a>
        </div>
      </div>

      <div className="w-full h-1 bg-zinc-700/20 dark:bg-white/20" />

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 font-bold m-6 select-none drop-shadow-md">
        {contributors.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-40">
            <h2 className="text-xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">
              {t("contributors.nocontributors")}
            </h2>
          </div>
        ) : (
          contributors.map((contributor: Contributor, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-3 flex flex-col items-center gap-3 shadow-sm dark:shadow-none h-full"
            >
              {/* ICON/AVATAR */}
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-700">
                  <img
                    src={contributor.image}
                    alt={contributor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-left font-semibold text-lg text-zinc-900 dark:text-white">
                      {contributor.name}
                    </h2>
                    {contributor.specialIcon && (
                      <img
                        src={contributor.specialIcon}
                        alt="special icon"
                        className="w-6 h-6"
                      />
                    )}
                    {(contributor.youtube || contributor.twitch || contributor.twitter) && (
                      <span className="text-zinc-900 dark:text-zinc-100">|</span>
                    )}
                    {contributor.youtube && (
                      <a
                        href={contributor.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black dark:text-white hover:opacity-80 transition"
                      >
                        <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
                      </a>
                    )}
                    {contributor.twitch && (
                      <a
                        href={contributor.twitch}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black dark:text-white hover:opacity-80 transition"
                      >
                        <FontAwesomeIcon icon={faTwitch} className="w-6 h-6" />
                      </a>
                    )}
                    {contributor.twitter && (
                      <a
                        href={contributor.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black dark:text-white hover:opacity-80 transition"
                      >
                        <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* BADGES */}
              <div className="flex items-center gap-2 flex-wrap justify-start w-full max-h-16 overflow-hidden">
                {contributor.badges.map((badgeKey, badgeIndex) => (
                  <span
                    key={badgeIndex}
                    className="px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 flex-shrink-0"
                    style={{ backgroundColor: getBadgeColor(badgeKey) }}
                  >
                    <FontAwesomeIcon icon={getBadgeIcon(badgeKey)} className="w-3 h-3" />
                    {t(badgeKey)}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
