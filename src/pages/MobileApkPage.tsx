import React, { useEffect, useMemo, useState } from "react";
import { Download, Palette, Smartphone, Wrench } from "lucide-react";
import ResponsiblePlay from "../components/ResponsiblePlay";
import type { Reunion } from "../lib/types";

interface Props {
  reunions: Reunion[];
}

type ThemeChoice = "emeraude" | "nuit" | "or";

const THEMES: Record<ThemeChoice, { bg: string; card: string; accent: string; label: string }> = {
  emeraude: { bg: "#04180f", card: "#0b3222", accent: "#fbbf24", label: "Émeraude & Or (défaut)" },
  nuit: { bg: "#0b1220", card: "#162032", accent: "#38bdf8", label: "Nuit & Ciel" },
  or: { bg: "#1a1405", card: "#2d2410", accent: "#facc15", label: "Or & Bois" },
};

const STORAGE_THEME = "partants-pmu-mobile-theme";
const STORAGE_NAME = "partants-pmu-mobile-name";

export default function MobileApkPage({ reunions }: Props) {
  const safeReunions = Array.isArray(reunions) ? reunions : [];
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    try {
      const raw = String(localStorage.getItem(STORAGE_THEME) || "");
      if (raw === "nuit" || raw === "or" || raw === "emeraude") return raw;
    } catch {
      /* stockage indisponible */
    }
    return "emeraude";
  });
  const [appName, setAppName] = useState(() => {
    try {
      return String(localStorage.getItem(STORAGE_NAME) || "Partants PMU");
    } catch {
      return "Partants PMU";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME, String(theme));
    } catch {
      /* stockage optionnel */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NAME, String(appName || "Partants PMU"));
    } catch {
      /* stockage optionnel */
    }
  }, [appName]);

  const colors = useMemo(() => THEMES[theme] || THEMES.emeraude, [theme]);
  const previewReunion = safeReunions[0];
  const previewCourse = previewReunion?.courses?.[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 py-5 pb-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">APK & AAB · NOVA Studio</p>
        <h1 className="text-2xl font-black text-white">App Mobile — prévisualisation réelle</h1>
        <p className="mt-1 text-sm leading-relaxed text-emerald-100/80">
          Cet onglet affiche l'application telle qu'elle sera empaquetée. Changez le fond, le nom et l'accent, puis
          générez l'APK / l'AAB depuis le bouton Publier de l'atelier. L'historique passe maintenant jusqu'à 5 ans.
        </p>
      </header>

      <section className="rounded-3xl border border-emerald-800 bg-[#0b3222] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-5 w-5 text-amber-300" />
          <h2 className="font-black text-white">Personnalisation instantanée</h2>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-emerald-100">Nom affiché sur le téléphone</span>
          <input
            value={appName}
            onChange={(e) => setAppName(String(e.target.value ?? ""))}
            placeholder="Partants PMU"
            className="min-h-11 rounded-xl border border-emerald-800 bg-[#062214] px-3 text-emerald-50 outline-none"
          />
        </label>

        <div className="mt-4">
          <p className="text-sm font-semibold text-emerald-100">Fond & accent</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(THEMES) as ThemeChoice[]).map((key) => {
              const active = theme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  className={`min-h-14 rounded-2xl border px-3 text-left text-sm font-bold ${
                    active ? "border-amber-400 bg-amber-400 text-[#062214]" : "border-emerald-800 bg-[#062214] text-emerald-50"
                  }`}
                >
                  {THEMES[key].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-200/70">
          <Wrench className="h-4 w-4 text-amber-300" />
          Astuce : le fond choisi s'applique à l'aperçu ci-dessous et sera conservé sur cet appareil.
        </div>
      </section>

      <section
        className="overflow-hidden rounded-[2rem] border border-white/10 shadow-xl"
        style={{ background: colors.bg }}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "rgba(0,0,0,0.22)" }}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-black"
            style={{ background: colors.accent, color: colors.bg }}
          >
            P
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.accent }}>
              Aperçu réel
            </p>
            <p className="font-black text-white">{String(appName || "Partants PMU").slice(0, 28)}</p>
          </div>
          <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white">
            {safeReunions.length} réunions
          </span>
        </div>

        <div className="grid gap-3 p-4">
          <div className="rounded-2xl p-3" style={{ background: colors.card }}>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.accent }}>
              Aujourd'hui · {previewReunion ? String(previewReunion.hippodrome?.libelleCourt || "Hippodrome") : "Programme"}
            </p>
            <p className="font-bold text-white">
              {previewCourse ? String(previewCourse.libelle || `Course ${previewCourse.numOrdre}`) : "Aperçu identique à l'APK"}
            </p>
            <p className="text-sm text-white/70">
              Top 8 du pronostic, arrivée, favoris / outsiders / tocards, et historique 1 mois · 3 mois · 1 an · 5 ans.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MiniPreview label="Programme" value="R1 · C1" color={colors.accent} />
            <MiniPreview label="Partants" value="8+" color={colors.accent} />
            <MiniPreview label="Historique" value="Top 8" color={colors.accent} />
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-3 text-sm text-white/80">
            <Smartphone className="h-5 w-5" style={{ color: colors.accent }} />
            Glissez les onglets en bas : tout est déjà en HashRouter pour Android.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-800 bg-[#0b3222] p-4">
        <h3 className="font-black text-white">Générer l'APK et l'AAB</h3>
        <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-sm leading-relaxed text-emerald-50/90">
          <li>Touchez Publier dans l'atelier NOVA, laissez le build finir (dist/assets/index.js).</li>
          <li>Utilisez le panneau Export Android de l'atelier pour récupérer l'APK de test et l'AAB Play Store.</li>
          <li>Si Vercel affiche un écran noir, vérifiez que la sortie pointe bien sur dist et que /api/pmu répond.</li>
        </ol>
        <a
          href="#/"
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold"
          style={{ background: colors.accent, color: colors.bg }}
        >
          <Download className="h-4 w-4" /> Revenir au programme
        </a>
      </section>

      <ResponsiblePlay />
    </div>
  );
}

function MiniPreview({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-black/20 px-3 py-3">
      <p className="text-[11px] uppercase tracking-wide text-white/60">{label}</p>
      <p className="font-black" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
