const fs = require('fs');
let code = fs.readFileSync('src/app/(student)/student/profile/page.tsx', 'utf8');

const target = `      {/* 11. CAREER PROFILE & PERSONAL DETAILS (Split 50/50 Card) */}`;

const replacement = `      {/* FLOATING ACTION BAR: Always reachable Save & Completeness Pill */}
      <div className="fixed bottom-6 right-6 lg:left-72 lg:right-12 z-20 flex items-center justify-between p-3.5 sm:px-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center font-extrabold text-xs shrink-0">
            {completeness}%
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Profile Readiness Score</div>
            <div className="text-[11px] text-slate-500">Keep profile updated to match recruiter algorithms</div>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-violet-600/20 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save All Details"}</span>
        </button>
      </div>

      {/* 11. CAREER PROFILE & PERSONAL DETAILS (Split 50/50 Card) */}`;

const normalize = (s) => s.replace(/\r\n/g, '\n');
const normalizedCode = normalize(code);
const normalizedTarget = normalize(target);
const normalizedReplacement = normalize(replacement);

if (normalizedCode.includes(normalizedTarget)) {
  const result = normalizedCode.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync('src/app/(student)/student/profile/page.tsx', result, 'utf8');
  console.log('Floating bar injected successfully');
} else {
  console.log('Target not found for floating bar');
}

