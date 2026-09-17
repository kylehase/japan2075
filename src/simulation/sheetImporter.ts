import { Ordinance, MacroEvent, MacroEventChoice, OrdinanceCategory } from '../types/game';
import { INITIAL_ORDINANCES } from './constants';
import { MILESTONE_EVENTS, STOCHASTIC_EXTERNALITIES } from './events';
import { EXPANDED_EXTERNALITIES } from './expandedEvents';

export interface RowError {
  sheet: 'Ordinances' | 'Policies' | 'Externalities';
  rowNumber: number;
  id?: string;
  reason: string;
}

export const MIN_RECOMMENDED_POLICIES = 10;
export const MIN_RECOMMENDED_EVENTS = 5;

export interface ContentAssessment {
  isBelowPolicyThreshold: boolean;
  isBelowEventThreshold: boolean;
  isAugmented: boolean;
  status: 'optimal' | 'low_content' | 'fallback_defaults';
  warningMessageEn?: string;
  warningMessageJa?: string;
}

export interface SyncResult {
  success: boolean;
  sourceUrl?: string;
  policiesLoaded: number;
  policiesOverwritten: number;
  policiesNew: number;
  eventsLoaded: number;
  eventsOverwritten: number;
  eventsNew: number;
  errors: RowError[];
  parsedOrdinances: Ordinance[];
  parsedEvents: MacroEvent[];
  assessment: ContentAssessment;
  timestamp: number;
}

/**
 * Robust RFC 4180 CSV parser that handles quoted strings, escaped quotes, and newlines inside quotes.
 */
export function parseCsvText(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // ignore carriage return
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Flush remaining
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Extracts Google Sheets document ID from any standard Google Sheets URL.
 */
export function extractGoogleSheetId(url: string): string | null {
  const trimmed = url.trim();
  // Match standard URL pattern
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];

  // Match raw ID pattern
  if (/^[a-zA-Z0-9-_]{20,80}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export const DEFAULT_GOOGLE_SHEET_ID = '14MM8J2Yo0dBM_9F3eBc_BuOW_B8nTJhIkgMrFEUxePU';
export const DEFAULT_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/14MM8J2Yo0dBM_9F3eBc_BuOW_B8nTJhIkgMrFEUxePU/template/preview';

const VALID_CATEGORIES: Set<string> = new Set([
  'family',
  'labor',
  'immigration',
  'technology',
  'automation',
  'tech',
  'fiscal',
]);

function normalizeCategory(raw: string): OrdinanceCategory {
  const lower = raw.toLowerCase().trim();
  if (lower === 'automation' || lower === 'tech') return 'technology';
  return lower as OrdinanceCategory;
}

/**
 * Parses Policies/Ordinances CSV rows into valid Ordinance objects, skipping incomplete rows.
 * When baseOrdinances is empty, the result contains strictly the ordinances from the sheet.
 */
export function parsePoliciesCsv(
  rows: string[][],
  baseOrdinances: Ordinance[] = []
): {
  ordinances: Ordinance[];
  overwrittenCount: number;
  newCount: number;
  errors: RowError[];
} {
  const errors: RowError[] = [];
  if (rows.length < 2) {
    return { ordinances: baseOrdinances, overwrittenCount: 0, newCount: 0, errors };
  }

  // Header indexing - strip trailing asterisks, trim and snake_case
  const headers = rows[0].map((h) =>
    h
      .replace(/\*+/g, '')
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, '_')
  );
  const getCol = (row: string[], colName: string): string => {
    const idx = headers.indexOf(colName);
    return idx >= 0 && idx < row.length ? row[idx] : '';
  };

  const baseMap = new Map<string, Ordinance>();
  for (const ord of baseOrdinances) {
    baseMap.set(ord.id, { ...ord });
  }

  let overwrittenCount = 0;
  let newCount = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rowNumber = r + 1; // 1-based human row index

    const id = getCol(row, 'id');
    if (!id) {
      errors.push({
        sheet: 'Policies',
        rowNumber,
        reason: "Missing required 'id' field.",
      });
      continue;
    }

    const rawCategory = getCol(row, 'category').toLowerCase().trim();
    if (!VALID_CATEGORIES.has(rawCategory)) {
      errors.push({
        sheet: 'Ordinances',
        rowNumber,
        id,
        reason: `Invalid or missing category '${getCol(row, 'category')}'. Must be one of: family, labor, immigration, technology, fiscal.`,
      });
      continue;
    }
    const category = normalizeCategory(rawCategory);

    const nameEn = getCol(row, 'name_en') || getCol(row, 'name');
    const nameJa = getCol(row, 'name_ja') || nameEn;
    if (!nameEn && !nameJa) {
      errors.push({
        sheet: 'Policies',
        rowNumber,
        id,
        reason: "Missing required policy name (both 'name_en' and 'name_ja' are blank).",
      });
      continue;
    }

    const rawCost = getCol(row, 'annual_cost_billion').replace(/,/g, '').trim();
    if (rawCost === '' || isNaN(Number(rawCost))) {
      errors.push({
        sheet: 'Ordinances',
        rowNumber,
        id,
        reason: `Invalid or missing 'annual_cost_billion' (found: '${rawCost}'). Must be a numeric value.`,
      });
      continue;
    }

    const parseNum = (val: string, def = 0): number => {
      const sanitized = val.replace(/,/g, '').trim();
      const n = Number(sanitized);
      return isNaN(n) || sanitized === '' ? def : n;
    };

    const annualCostBillion = Number(rawCost);
    const tfrDelta = parseNum(getCol(row, 'tfr_delta'));
    const hopeIndexDelta = parseNum(getCol(row, 'youth_hope_delta')) || parseNum(getCol(row, 'hope_delta'));
    const productivityDelta = parseNum(getCol(row, 'productivity_delta'));
    const seniorApprovalDelta = parseNum(getCol(row, 'senior_approval_delta'));
    const youthApprovalDelta = parseNum(getCol(row, 'youth_approval_delta'));
    const unlockedYear = parseNum(getCol(row, 'unlocked_year'), 2025);
    const supersedesId = getCol(row, 'supersedes_id') || undefined;
    const rawConflicts = getCol(row, 'conflicts_with') || getCol(row, 'incompatible_with') || getCol(row, 'conflicting_ids') || getCol(row, 'mutually_exclusive_with');
    const conflictsWith = rawConflicts
      ? rawConflicts.split(/[;,|]/).map((s) => s.trim()).filter(Boolean)
      : [];

    const combinedReplaces = [
      ...(supersedesId ? [supersedesId] : []),
      ...conflictsWith,
    ].filter((val, idx, arr) => arr.indexOf(val) === idx);

    const descEn = getCol(row, 'description_en') || `${nameEn} policy enactment.`;
    const descJa = getCol(row, 'description_ja') || descEn;

    const existing = baseMap.get(id);
    if (existing) {
      overwrittenCount++;
    } else {
      newCount++;
    }

    const impactEn = getCol(row, 'impact_summary_en') || `TFR: ${tfrDelta >= 0 ? '+' : ''}${tfrDelta.toFixed(2)}, Cost: ¥${annualCostBillion}B`;
    const impactJa = getCol(row, 'impact_summary_ja') || `TFR: ${tfrDelta >= 0 ? '+' : ''}${tfrDelta.toFixed(2)}、年間費用: ${annualCostBillion}億円`;

    const parsedOrd: Ordinance = {
      id,
      category,
      name: {
        en: nameEn || nameJa,
        ja: nameJa || nameEn,
      },
      description: {
        en: descEn,
        ja: descJa,
      },
      impactSummary: {
        en: impactEn,
        ja: impactJa,
      },
      annualCostBillion,
      tfrDelta,
      hopeIndexDelta,
      productivityDelta,
      seniorApprovalDelta,
      youthApprovalDelta,
      unlockedYear,
      active: existing ? existing.active : false,
      replaces: combinedReplaces.length > 0 ? combinedReplaces : undefined,
    };

    baseMap.set(id, parsedOrd);
  }

  return {
    ordinances: Array.from(baseMap.values()),
    overwrittenCount,
    newCount,
    errors,
  };
}

/**
 * Parses Externalities CSV rows into valid MacroEvent objects, skipping incomplete rows.
 * When baseEvents is empty, the result contains strictly the events from the sheet.
 */
export function parseExternalitiesCsv(
  rows: string[][],
  baseEvents: MacroEvent[] = []
): {
  events: MacroEvent[];
  overwrittenCount: number;
  newCount: number;
  errors: RowError[];
} {
  const errors: RowError[] = [];
  if (rows.length < 2) {
    return { events: baseEvents, overwrittenCount: 0, newCount: 0, errors };
  }

  const headers = rows[0].map((h) =>
    h
      .replace(/\*+/g, '')
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, '_')
  );
  const getCol = (row: string[], colName: string): string => {
    const idx = headers.indexOf(colName);
    return idx >= 0 && idx < row.length ? row[idx] : '';
  };

  const baseMap = new Map<string, MacroEvent>();
  for (const evt of baseEvents) {
    baseMap.set(evt.id, { ...evt });
  }

  let overwrittenCount = 0;
  let newCount = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rowNumber = r + 1;

    const id = getCol(row, 'ext_id') || getCol(row, 'event_id') || getCol(row, 'id');
    if (!id) {
      errors.push({
        sheet: 'Externalities',
        rowNumber,
        reason: "Missing required 'ext_id' (or 'event_id') field.",
      });
      continue;
    }

    const titleEn = getCol(row, 'title_en') || getCol(row, 'title');
    const titleJa = getCol(row, 'title_ja') || titleEn;
    if (!titleEn && !titleJa) {
      errors.push({
        sheet: 'Externalities',
        rowNumber,
        id,
        reason: "Missing event title (both 'title_en' and 'title_ja' are blank).",
      });
      continue;
    }

    const c1TitleEn = getCol(row, 'c1_title_en') || getCol(row, 'c1_label_en') || getCol(row, 'c1_title');
    const c1TitleJa = getCol(row, 'c1_title_ja') || c1TitleEn;
    if (!c1TitleEn && !c1TitleJa) {
      errors.push({
        sheet: 'Externalities',
        rowNumber,
        id,
        reason: "Missing required Choice 1 ('c1_title_en' / 'c1_title_ja'). At least one decision choice is required.",
      });
      continue;
    }

    const parseNum = (val: string, def = 0): number => {
      const sanitized = val.replace(/,/g, '').trim();
      const n = Number(sanitized);
      return isNaN(n) || sanitized === '' ? def : n;
    };

    const choices: MacroEventChoice[] = [];

    // Choice 1
    choices.push({
      id: getCol(row, 'c1_id') || 'c1',
      label: {
        en: c1TitleEn || c1TitleJa,
        ja: c1TitleJa || c1TitleEn,
      },
      description: {
        en: getCol(row, 'c1_description_en') || getCol(row, 'c1_desc_en') || c1TitleEn,
        ja: getCol(row, 'c1_description_ja') || getCol(row, 'c1_desc_ja') || c1TitleJa,
      },
      costBillion: parseNum(getCol(row, 'c1_cost_billion')),
      tfrDelta: parseNum(getCol(row, 'c1_tfr_delta')),
      hopeDelta: parseNum(getCol(row, 'c1_hope_delta')),
      productivityDelta: parseNum(getCol(row, 'c1_productivity_delta')),
      approvalDelta: parseNum(getCol(row, 'c1_approval_delta')),
    });

    // Choice 2 (Optional)
    const c2TitleEn = getCol(row, 'c2_title_en') || getCol(row, 'c2_label_en');
    const c2TitleJa = getCol(row, 'c2_title_ja') || c2TitleEn;
    if (c2TitleEn || c2TitleJa) {
      choices.push({
        id: getCol(row, 'c2_id') || 'c2',
        label: {
          en: c2TitleEn || c2TitleJa,
          ja: c2TitleJa || c2TitleEn,
        },
        description: {
          en: getCol(row, 'c2_description_en') || getCol(row, 'c2_desc_en') || c2TitleEn,
          ja: getCol(row, 'c2_description_ja') || getCol(row, 'c2_desc_ja') || c2TitleJa,
        },
        costBillion: parseNum(getCol(row, 'c2_cost_billion')),
        tfrDelta: parseNum(getCol(row, 'c2_tfr_delta')),
        hopeDelta: parseNum(getCol(row, 'c2_hope_delta')),
        productivityDelta: parseNum(getCol(row, 'c2_productivity_delta')),
        approvalDelta: parseNum(getCol(row, 'c2_approval_delta')),
      });
    }

    // Choice 3 (Optional - backward compatibility)
    const c3TitleEn = getCol(row, 'c3_title_en') || getCol(row, 'c3_label_en');
    const c3TitleJa = getCol(row, 'c3_title_ja') || c3TitleEn;
    if (c3TitleEn || c3TitleJa) {
      choices.push({
        id: getCol(row, 'c3_id') || 'c3',
        label: {
          en: c3TitleEn || c3TitleJa,
          ja: c3TitleJa || c3TitleEn,
        },
        description: {
          en: getCol(row, 'c3_description_en') || getCol(row, 'c3_desc_en') || c3TitleEn,
          ja: getCol(row, 'c3_description_ja') || getCol(row, 'c3_desc_ja') || c3TitleJa,
        },
        costBillion: parseNum(getCol(row, 'c3_cost_billion')),
        tfrDelta: parseNum(getCol(row, 'c3_tfr_delta')),
        hopeDelta: parseNum(getCol(row, 'c3_hope_delta')),
        productivityDelta: parseNum(getCol(row, 'c3_productivity_delta')),
        approvalDelta: parseNum(getCol(row, 'c3_approval_delta')),
      });
    }

    const descEn = getCol(row, 'description_en') || titleEn;
    const descJa = getCol(row, 'description_ja') || titleJa;
    const severityRaw = getCol(row, 'severity').toLowerCase();
    const severity: MacroEvent['severity'] = ['info', 'warning', 'disaster', 'miracle'].includes(severityRaw)
      ? (severityRaw as MacroEvent['severity'])
      : 'info';

    const triggerType = getCol(row, 'trigger_type').toLowerCase();
    const yearOrCond = getCol(row, 'year_or_condition').replace(/,/g, '').trim();
    const fixedYear = triggerType === 'fixed_milestone' || (!isNaN(Number(yearOrCond)) && Number(yearOrCond) >= 2025)
      ? Number(yearOrCond)
      : undefined;

    const probRaw = getCol(row, 'probability_per_year').replace(/,/g, '').trim();
    const probability = probRaw && !isNaN(Number(probRaw)) ? Number(probRaw) : 0.15;

    const existing = baseMap.get(id);
    if (existing) {
      overwrittenCount++;
    } else {
      newCount++;
    }

    const parsedEvt: MacroEvent = {
      id,
      title: {
        en: titleEn || titleJa,
        ja: titleJa || titleEn,
      },
      description: {
        en: descEn,
        ja: descJa,
      },
      severity: severity as MacroEvent['severity'],
      year: fixedYear,
      choices,
    };

    baseMap.set(id, parsedEvt);
  }

  return {
    events: Array.from(baseMap.values()),
    overwrittenCount,
    newCount,
    errors,
  };
}

/**
 * Fetches and synchronizes live Google Sheets data from public shareable URL.
 * When the Google Sheet is available and readable, it uses ONLY ordinances and events from the sheet.
 */
export async function syncFromGoogleSheetsUrl(
  sheetUrlOrId: string = DEFAULT_GOOGLE_SHEET_ID
): Promise<SyncResult> {
  const sheetId = extractGoogleSheetId(sheetUrlOrId);
  if (!sheetId) {
    throw new Error(
      'Invalid Google Sheets URL or ID. Please ensure the URL looks like: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit'
    );
  }

  const ordinancesUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Ordinances`;
  const fallbackPoliciesUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Policies`;
  const externalitiesUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Externalities`;

  const allErrors: RowError[] = [];
  let policiesLoaded = 0;
  let eventsLoaded = 0;
  let parsedOrdinances: Ordinance[] = [];
  let parsedEvents: MacroEvent[] = [];

  // Fetch Ordinances (with fallback to Policies)
  try {
    let res = await fetch(ordinancesUrl);
    let csvText = '';
    if (res.ok) {
      csvText = await res.text();
    }
    // If Ordinances sheet is not found, try Policies fallback
    if (!res.ok || csvText.includes('<!DOCTYPE html>') || csvText.includes('"status":"error"') || csvText.trim() === '') {
      const fallbackRes = await fetch(fallbackPoliciesUrl);
      if (fallbackRes.ok) {
        const fallbackText = await fallbackRes.text();
        if (!fallbackText.includes('<!DOCTYPE html>') && !fallbackText.includes('"status":"error"')) {
          res = fallbackRes;
          csvText = fallbackText;
        }
      }
    }

    if (!res.ok || csvText.includes('<!DOCTYPE html>') || csvText.includes('google-signin')) {
      throw new Error("Access denied or sheet tab not found: Please ensure the tab is named 'Ordinances' (or 'Policies') and sharing is set to 'Anyone with the link can view'.");
    }

    const rows = parseCsvText(csvText);
    const parsed = parsePoliciesCsv(rows, []); // Purely ordinances from sheet!
    parsedOrdinances = parsed.ordinances;
    policiesLoaded = parsed.ordinances.length;
    allErrors.push(...parsed.errors);
  } catch (err: any) {
    allErrors.push({
      sheet: 'Ordinances',
      rowNumber: 0,
      reason: err.message || 'Could not fetch Ordinances tab.',
    });
  }

  // Fetch Externalities
  try {
    const res = await fetch(externalitiesUrl);
    if (res.ok) {
      const csvText = await res.text();
      if (!csvText.includes('<!DOCTYPE html>') && !csvText.includes('google-signin')) {
        const rows = parseCsvText(csvText);
        const parsed = parseExternalitiesCsv(rows, []); // Purely events from sheet!
        parsedEvents = parsed.events;
        eventsLoaded = parsed.events.length;
        allErrors.push(...parsed.errors);
      }
    }
  } catch (err: any) {
    allErrors.push({
      sheet: 'Externalities',
      rowNumber: 0,
      reason: err.message || 'Could not fetch Externalities tab.',
    });
  }

  const success = policiesLoaded > 0 || eventsLoaded > 0;

  // --- Quality & Lower-Bound Verification ---
  // If the sheet is unreadable or 0 entries loaded, fall back completely to default 2025-2075 baseline.
  if (!success) {
    return {
      success: false,
      sourceUrl: sheetUrlOrId,
      policiesLoaded: 0,
      policiesOverwritten: 0,
      policiesNew: 0,
      eventsLoaded: 0,
      eventsOverwritten: 0,
      eventsNew: 0,
      errors: allErrors,
      parsedOrdinances: INITIAL_ORDINANCES,
      parsedEvents: [...MILESTONE_EVENTS, ...STOCHASTIC_EXTERNALITIES, ...EXPANDED_EXTERNALITIES],
      assessment: {
        isBelowPolicyThreshold: true,
        isBelowEventThreshold: true,
        isAugmented: true,
        status: 'fallback_defaults',
        warningMessageEn: 'Custom sheet could not be read or was empty. Reverted to standard 2025–2075 baseline scenario.',
        warningMessageJa: 'カスタムシートの読込に失敗したかデータが空だったため、標準シナリオ（2025〜2075年）に自動復旧しました。',
      },
      timestamp: Date.now(),
    };
  }

  const isBelowPolicyThreshold = policiesLoaded < MIN_RECOMMENDED_POLICIES;
  const isBelowEventThreshold = eventsLoaded < MIN_RECOMMENDED_EVENTS;

  let finalOrdinances = parsedOrdinances;
  let finalEvents = parsedEvents;
  let isAugmented = false;

  // If ordinances or events are below minimum viable lower bounds (10 policies or 5 events),
  // augment with built-in baseline scenario so the 50-year game loop remains robust and playable,
  // prioritizing custom overrides by matching ID.
  if (isBelowPolicyThreshold) {
    const customMap = new Map<string, Ordinance>(parsedOrdinances.map((o) => [o.id, o]));
    // Add default ordinances that are not already defined in the custom sheet
    for (const defOrd of INITIAL_ORDINANCES) {
      if (!customMap.has(defOrd.id)) {
        customMap.set(defOrd.id, defOrd);
      }
    }
    finalOrdinances = Array.from(customMap.values());
    isAugmented = true;
  }

  if (isBelowEventThreshold) {
    const customEventMap = new Map<string, MacroEvent>(parsedEvents.map((e) => [e.id, e]));
    const allDefaults = [...MILESTONE_EVENTS, ...STOCHASTIC_EXTERNALITIES, ...EXPANDED_EXTERNALITIES];
    for (const defEvt of allDefaults) {
      if (!customEventMap.has(defEvt.id)) {
        customEventMap.set(defEvt.id, defEvt);
      }
    }
    finalEvents = Array.from(customEventMap.values());
    isAugmented = true;
  }

  const status: ContentAssessment['status'] =
    isBelowPolicyThreshold || isBelowEventThreshold ? 'low_content' : 'optimal';

  let warningMessageEn: string | undefined;
  let warningMessageJa: string | undefined;

  if (status === 'low_content') {
    const policyNoticeEn = isBelowPolicyThreshold
      ? `Only ${policiesLoaded}/${MIN_RECOMMENDED_POLICIES} policies found.`
      : '';
    const eventNoticeEn = isBelowEventThreshold
      ? `Only ${eventsLoaded}/${MIN_RECOMMENDED_EVENTS} externalities found.`
      : '';
    warningMessageEn = `Low Content Warning: ${policyNoticeEn} ${eventNoticeEn} Supplemented with standard 2025–2075 scenario to ensure a balanced 50-year simulation.`.trim();

    const policyNoticeJa = isBelowPolicyThreshold
      ? `政策が${policiesLoaded}件（推奨下限${MIN_RECOMMENDED_POLICIES}件未満）です。`
      : '';
    const eventNoticeJa = isBelowEventThreshold
      ? `事象が${eventsLoaded}件（推奨下限${MIN_RECOMMENDED_EVENTS}件未満）です。`
      : '';
    warningMessageJa = `データ件数警告: ${policyNoticeJa} ${eventNoticeJa} 50年間のゲームバランスを維持するため、標準シナリオデータで補完しました。`.trim();
  }

  return {
    success: true,
    sourceUrl: sheetUrlOrId,
    policiesLoaded,
    policiesOverwritten: 0,
    policiesNew: policiesLoaded,
    eventsLoaded,
    eventsOverwritten: 0,
    eventsNew: eventsLoaded,
    errors: allErrors,
    parsedOrdinances: finalOrdinances,
    parsedEvents: finalEvents,
    assessment: {
      isBelowPolicyThreshold,
      isBelowEventThreshold,
      isAugmented,
      status,
      warningMessageEn,
      warningMessageJa,
    },
    timestamp: Date.now(),
  };
}

const STORAGE_KEY = 'japan2075_custom_scenario';

export function saveCustomScenarioToStorage(data: SyncResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to cache custom scenario in localStorage', e);
  }
}

export function loadCustomScenarioFromStorage(): SyncResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read cached custom scenario', e);
  }
  return null;
}

export function clearCustomScenarioStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear cached custom scenario', e);
  }
}



