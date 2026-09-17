const fs = require('fs');

const content = fs.readFileSync('src/simulation/demographics.ts', 'utf8');

const helperCode = `
function applyVariance(value: number, variance: number = 0.15): number {
  return value * (1 - variance + (Math.random() * variance * 2));
}
`;

let newContent = content.replace(
  'export function simulateDemographicStep',
  helperCode + '\nexport function simulateDemographicStep'
);

newContent = newContent.replace(
  'policyTFRDelta += ord.tfrDelta;',
  'policyTFRDelta += applyVariance(ord.tfrDelta, 0.20); // 20% variance on TFR impact'
);

newContent = newContent.replace(
  'ordHopeDelta += ord.hopeIndexDelta;',
  'ordHopeDelta += applyVariance(ord.hopeIndexDelta, 0.25); // 25% variance on Hope impact'
);

fs.writeFileSync('src/simulation/demographics.ts', newContent, 'utf8');
