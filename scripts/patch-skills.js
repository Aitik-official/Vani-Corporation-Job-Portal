const fs = require('fs');
let code = fs.readFileSync('src/app/(student)/student/profile/page.tsx', 'utf8');

const target = `        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add new skill (e.g. Next.js, Docker, MongoDB) and press Enter"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
          >
            + Add Skill
          </button>
        </div>`;

const replacement = `        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add new skill (e.g. Next.js, Docker, MongoDB) and press Enter"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
          >
            + Add Skill
          </button>
        </div>

        {/* In-Demand Skill Suggestions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Suggested:</span>
          </span>
          {["Docker", "Tailwind CSS", "TypeScript", "PostgreSQL", "Next.js", "Redis", "Git", "REST APIs", "AWS"].map((sugg) => {
            const alreadyHas = skillsList.includes(sugg);
            if (alreadyHas) return null;
            return (
              <button
                key={sugg}
                type="button"
                onClick={() => setSkillsList([...skillsList, sugg])}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 hover:border-emerald-300 dark:border-slate-700 text-[11px] font-semibold transition"
              >
                + {sugg}
              </button>
            );
          })}
        </div>`;

// Normalize crlf
const normalize = (s) => s.replace(/\r\n/g, '\n');
const normalizedCode = normalize(code);
const normalizedTarget = normalize(target);
const normalizedReplacement = normalize(replacement);

if (normalizedCode.includes(normalizedTarget)) {
  const result = normalizedCode.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync('src/app/(student)/student/profile/page.tsx', result, 'utf8');
  console.log('Skill suggestions injected successfully');
} else {
  console.log('Target not found');
}

