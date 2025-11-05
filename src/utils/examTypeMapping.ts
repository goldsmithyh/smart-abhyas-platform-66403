// Map database exam type names to display names
export const getExamTypeDisplayName = (dbName: string): string => {
  const nameMap: { [key: string]: string } = {
    'अंतर्गत मूल्यमापन परीक्षा': 'फेब्रुवारी / मार्च 2022',
    'प्रकरणानुसार परीक्षा': 'फेब्रुवारी / मार्च 2023'
  };
  
  return nameMap[dbName] || dbName;
};
