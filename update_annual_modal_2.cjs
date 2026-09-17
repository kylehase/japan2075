const fs = require('fs');

let content = fs.readFileSync('src/components/AnnualPolicyModal.tsx', 'utf8');

// TFR
content = content.replace(
  "TFR {ord.tfrDelta > 0 ? '+' : ''}{ord.tfrDelta}",
  "EST. TFR {ord.tfrDelta > 0 ? '+' : ''}{ord.tfrDelta}"
);

// HOPE
content = content.replace(
  "<Sparkles size={10} /> HOPE {ord.hopeIndexDelta > 0 ? '+' : ''}{ord.hopeIndexDelta}",
  "<Sparkles size={10} /> EST. HOPE {ord.hopeIndexDelta > 0 ? '+' : ''}{ord.hopeIndexDelta}"
);

// TFR Impact -> Est. TFR Impact
content = content.replace(
  "{language === 'en' ? 'TFR Impact' : '出生率影響'}",
  "{language === 'en' ? 'Est. TFR Impact' : '予想出生率影響'}"
);

// Hope Impact -> Est. Hope Impact
content = content.replace(
  "{language === 'en' ? 'Hope Impact' : '希望指数影響'}",
  "{language === 'en' ? 'Est. Hope Impact' : '予想希望指数影響'}"
);

fs.writeFileSync('src/components/AnnualPolicyModal.tsx', content, 'utf8');
