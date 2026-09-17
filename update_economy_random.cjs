const fs = require('fs');

const content = fs.readFileSync('src/simulation/economy.ts', 'utf8');

const helperCode = `
function applyVariance(value: number, variance: number = 0.15): number {
  return value * (1 - Math.random() * variance * 2 + variance);
}
// Using the simpler consistent one: return value * (1 - variance + (Math.random() * variance * 2));
function applyVar(value: number, variance: number = 0.15): number {
  return value * (1 - variance + (Math.random() * variance * 2));
}
`;

let newContent = content.replace(
  'export function calculateEconomyAndFiscalSolvency',
  helperCode + '\nexport function calculateEconomyAndFiscalSolvency'
);

newContent = newContent.replace(
  'productivityMultiplier += ord.productivityDelta;',
  'productivityMultiplier += applyVar(ord.productivityDelta, 0.20); // 20% variance on productivity impact'
);

newContent = newContent.replace(
  'expenditureChildcare += ord.annualCostBillion;',
  'expenditureChildcare += applyVar(ord.annualCostBillion, 0.15); // 15% variance on cost prediction'
);

// We should also replace the negative costs in childcare or taxes, wait. Let's see how costs are used.
// "if (ord.annualCostBillion > 0) expenditureChildcare += ord.annualCostBillion;"
// It's applied above. Let's do it precisely.

newContent = newContent.replace(
  'seniorApprovalDelta += ord.seniorApprovalDelta;',
  'seniorApprovalDelta += applyVar(ord.seniorApprovalDelta, 0.20); // 20% variance'
);

newContent = newContent.replace(
  'youthApprovalDelta += ord.youthApprovalDelta;',
  'youthApprovalDelta += applyVar(ord.youthApprovalDelta, 0.20); // 20% variance'
);

fs.writeFileSync('src/simulation/economy.ts', newContent, 'utf8');
