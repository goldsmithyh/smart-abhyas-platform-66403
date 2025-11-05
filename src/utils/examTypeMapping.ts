// utils/examTypeMapping.ts

/**
 * Converts database exam type names to user-friendly display names.
 * Handles special replacements for specific standards (like 12th).
 *
 * Example:
 *  - For 12th std: "प्रकरणानुसार परीक्षा" → "फेब्रुवारी / मार्च 2023"
 *  - For all: "अंतर्गत मूल्यमापन परीक्षा" → "फेब्रुवारी / मार्च 2022"
 *
 * @param dbName - Exam type name from database (Marathi text)
 * @param standardCode - Standard code ("10th", "11th", "12th")
 * @returns Display name for dropdown
 */
export const getExamTypeDisplayName = (dbName: string, standardCode?: string): string => {
  if (!dbName) return "";

  // ✅ 12th साठी विशेष बदल
  if (standardCode === "12th" && dbName.trim() === "प्रकरणानुसार परीक्षा") {
    return "फेब्रुवारी / मार्च 2023";
  }

  // ✅ इतर सामान्य नावांचे friendly replacements
  const nameMap: Record<string, string> = {
    "अंतर्गत मूल्यमापन परीक्षा": "फेब्रुवारी / मार्च 2022",
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

  // 🔍 If name found in map → return it; else return as-is
  return nameMap[dbName] || dbName;
};
