import React, { useMemo } from 'react';
import { GameState } from '../types/game';
import { Radio } from 'lucide-react';

interface MarqueeTickerProps {
  gameState: GameState;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ gameState }) => {
  const { demographics, economy, currentYear, language } = gameState;

  const headlines = useMemo(() => {
    const list: { en: string; ja: string }[] = [];

    // Demographic headlines
    if (demographics.tfr >= 1.60) {
      list.push({
        en: '🍼 TOKYO MATERNITY WARDS REPORT RECORD NEWBORN REGISTRATIONS: "MIRACLE COMEBACK FOR JAPANESE FAMILIES!"',
        ja: '🍼 都内産科病棟で新生児の出生届が急増：「日本の子育て奇跡のV字回復へ！」',
      });
    } else if (demographics.lowFertilityTrapActive) {
      list.push({
        en: '⚠️ IPSS WARNS: "LOW FERTILITY TRAP ENTRENCHED AMONG YOUTH AS MARRIAGE COSTS EXCEED SAVINGS"',
        ja: '⚠️ 社人研警告：「若者の将来不安深刻化、低出生力トラップが長期固定化の危機」',
      });
    } else {
      list.push({
        en: `📉 ANNUAL POPULATION CONTRACTION REPORTED AT ${Math.abs(Math.round(demographics.naturalChange / 1000))}K CITIZENS PER YEAR`,
        ja: `📉 国内自然減少数は年間${Math.abs(Math.round(demographics.naturalChange / 1000))}万人ペースを記録`,
      });
    }

    // Fiscal / Economic headlines
    if (economy.debtToGDP >= 320) {
      list.push({
        en: '🚨 TOKYO FINANCIAL EXCHANGE TENSE AS 10-YEAR JGB YIELDS HIT MULTI-DECADE HIGHS AMID SOVEREIGN DEBT JITTER',
        ja: '🚨 東京債券市場緊迫：国債利回りが急上昇、財政健全化への抜本策を求める声高まる',
      });
    } else if (economy.debtToGDP <= 240) {
      list.push({
        en: '📈 MAJOR RATING AGENCIES UPGRADE JAPAN SOVEREIGN OUTLOOK CITING PRUDENT REVENUE-BALANCED FAMILY BUDGETING',
        ja: '📈 国際格付け機関、日本のソブリン格付け見通しを上方修正「社会保障の持続可能性高まる」',
      });
    }

    // Technological & Regional headlines
    if (economy.roboticsLaborEquivalents >= 2.0) {
      list.push({
        en: '🤖 AUTONOMOUS HARVEST DRONES & AGRI-ROBOTS BOOST RICE PRODUCTION ACROSS RURAL PREFECTURES BY 34%',
        ja: '🤖 自動収穫ドローンとスマート農業の普及により、過疎地域の農業生産量が34%急増',
      });
    }

    // Silver democracy / cultural headlines
    list.push({
      en: `🗳️ NATIONAL OPINION POLL: CABINET APPROVAL AT ${gameState.cabinetApproval.toFixed(1)}% • SENIOR VOTER TURNOUT ESTIMATED AT 80%`,
      ja: `🗳️ 全国世論調査：内閣支持率${gameState.cabinetApproval.toFixed(1)}% • 65歳以上の投票参加率は80%超を維持`,
    });

    list.push({
      en: '🌸 REGIONAL BULLET TRAIN PASSENGERS SURGE AS YOUNG TELEWORK FAMILIES MIGRATE TO SUBURBAN GREEN HUBS',
      ja: '🌸 新幹線通勤とサテライトオフィスの連携で、地方への子育て世代移住が過去最多に',
    });

    return list;
  }, [demographics, economy, gameState.cabinetApproval]);

  const marqueeText = headlines.map(h => language === 'en' ? h.en : h.ja).join('  ■■■  ');

  return (
    <div className="w-full bg-black border-y border-slate-950 px-2 py-1 flex items-center gap-2 overflow-hidden text-xs z-20 shadow-inner">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold uppercase tracking-wider text-[10px] shrink-0 font-digital animate-pulse">
        <Radio size={12} />
        <span>NEWSFLASH</span>
      </div>
      <div className="overflow-hidden whitespace-nowrap flex-1 relative">
        <div className="animate-marquee-smooth font-mono-tech text-emerald-400 tracking-wider text-xs font-semibold">
          {marqueeText}
        </div>
      </div>
      <div className="text-[10px] text-slate-500 font-mono-tech shrink-0 hidden sm:block">
        PRESS WIRE LIVE • {currentYear}
      </div>
    </div>
  );
};
