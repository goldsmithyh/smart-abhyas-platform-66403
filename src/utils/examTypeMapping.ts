// utils/examTypeMapping.ts

// Zero-width + whitespace normalize
const normalize = (s?: string) =>
  (s || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // ZWJ/ZWNJ/FEFF
    .trim();

// काही वेळा टायपो/स्पेसिंग/वेरिएंट्स असतात, म्हणून synonyms
const CHAPTERWISE_VARIANTS = [
  "प्रकरणानुसार परीक्षा",
  "प्रकरणानुसार  परीक्षा",
  "प्रकरण नुसार परीक्षा",
  "प्रकरणनुसार परीक्षा",
  "प्रकरणनिहाय परीक्षा",
  "Chapterwise Test",
  "chapter",
];

const equalsAny = (input: string, variants: string[]) => {
  const n = normalize(input);
  return variants.some((v) => normalize(v) === n);
};

export const getExamTypeDisplayName = (dbName: string, standardCode?: string): string => {
  const name = normalize(dbName);
  const std = normalize(standardCode);

  // DEBUG (हवे असल्यास uncomment करा):
  // console.log("[examTypeMapping] in:", dbName, "std:", standardCode);

  // ✅ 12th साठी विशेष rename
  if (std === "12th" && equalsAny(name, CHAPTERWISE_VARIANTS)) {
    return "फेब्रुवारी / मार्च 2023";
  }

  // ✅ इतर सामान्य mappings (गरजेनुसार ठेवा/काढा)
  const map: Record<string, string> = {
    [normalize("अंतर्गत मूल्यमापन परीक्षा")]: "फेब्रुवारी / मार्च 2022",
    unit1: "Unit Test 1",
    unit2: "Unit Test 2",
    term1: "Term 1 Exam",
    term2: "Term 2 Exam",
    prelim1: "Prelim Exam 1",
    prelim2: "Prelim Exam 2",
    prelim3: "Prelim Exam 3",
    internal: "Internal Assessment",
    chapter: "Chapterwise Test",
  };

  return map[name] || dbName; // map मध्ये नसेल तर original दाखवा
};
