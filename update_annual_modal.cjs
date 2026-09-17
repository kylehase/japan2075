const fs = require('fs');

let content = fs.readFileSync('src/components/AnnualPolicyModal.tsx', 'utf8');

// Change the instructions to mention estimates
content = content.replace(
  "Select one new policy to propose in each category.",
  "Select one new policy to propose in each category. Note: Displayed impacts are estimates. Actual results will vary due to real-world economic and social conditions."
);

content = content.replace(
  "各分野から法案を1つ選択してください。",
  "各分野から法案を1つ選択してください。注意：表示されている影響は予測値です。実際の結果は現実の経済・社会状況により変動します。"
);

// Add EST. to Cost
content = content.replace(
  "{ord.annualCostBillion > 0 ? '-' : '+'}{Math.abs(ord.annualCostBillion)}B ¥/YR",
  "EST. {ord.annualCostBillion > 0 ? '-' : '+'}{Math.abs(ord.annualCostBillion)}B ¥/YR"
);

// Add EST. to TFR
content = content.replace(
  "{ord.tfrDelta > 0 ? '+' : ''}{ord.tfrDelta} TFR",
  "EST. {ord.tfrDelta > 0 ? '+' : ''}{ord.tfrDelta} TFR"
);

// Add EST. to Hope
content = content.replace(
  "{ord.hopeIndexDelta > 0 ? '+' : ''}{ord.hopeIndexDelta} HOPE",
  "EST. {ord.hopeIndexDelta > 0 ? '+' : ''}{ord.hopeIndexDelta} HOPE"
);

// Net Fiscal Impact -> Est. Net Fiscal Impact
content = content.replace(
  "{language === 'en' ? 'Net Fiscal Impact' : '純財政影響'}",
  "{language === 'en' ? 'Est. Net Fiscal Impact' : '予想純財政影響'}"
);

// Net TFR Impact -> Est. Net TFR Impact
content = content.replace(
  "{language === 'en' ? 'Net TFR Impact' : '純TFR影響'}",
  "{language === 'en' ? 'Est. Net TFR Impact' : '予想TFR影響'}"
);

fs.writeFileSync('src/components/AnnualPolicyModal.tsx', content, 'utf8');
