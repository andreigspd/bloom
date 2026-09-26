import { useMemo } from 'react';
import { HABIT_COLORS } from '../lib/colors';
import type { HabitColor } from '../lib/types';

export interface TreeProps {
  /** overall 0..1 progress — drives the tree's growth stage */
  progress: number;
  /** colors of completed habits — each becomes a blossom on the tree */
  blossomColors?: HabitColor[];
  /** disable idle sway animation (useful for the month minis) */
  animate?: boolean;
  /** seed for deterministic blossom/leaf placement so a given day looks stable */
  seed?: number;
}

// Deterministic pseudo-random generator so a day's tree always looks the same.
function makeRand(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/**
 * A single tree drawn in a 100x100 SVG space, anchored bottom-center (50,100).
 * Growth stages (by progress):
 *   0        bare mound / seed
 *   0..0.25  sapling (thin stem, few leaves)
 *   0.25..0.5 young tree (short trunk, small canopy)
 *   0.5..0.75 growing tree (taller trunk, fuller canopy)
 *   0.75..1  mature tree (full canopy)
 *   1        full bloom (canopy + blossoms)
 */
export function Tree({ progress, blossomColors = [], animate = true, seed = 1 }: TreeProps) {
  const p = Math.max(0, Math.min(1, progress));

  const { trunkTop, canopyR, canopyCy, leaves } = useMemo(() => {
    const rand = makeRand(seed || 1);
    // trunk grows upward as progress increases
    const trunkTop = 92 - p * 46; // y of top of trunk (lower y = taller)
    const canopyCy = trunkTop - (p > 0.15 ? 6 + p * 6 : 0);
    const canopyR = p < 0.15 ? 0 : 10 + p * 22;

    // scatter leaf clusters inside the canopy circle
    const count = Math.round(p * 14);
    const leaves = Array.from({ length: count }, () => {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * canopyR * 0.85;
      return {
        x: 50 + Math.cos(a) * r,
        y: canopyCy + Math.sin(a) * r * 0.9,
        rr: 5 + rand() * 6,
        shade: rand(),
      };
    });
    return { trunkTop, canopyR, canopyCy, leaves };
  }, [p, seed]);

  const blossoms = useMemo(() => {
    if (canopyR <= 0 || blossomColors.length === 0) return [];
    const rand = makeRand((seed || 1) * 7 + 3);
    return blossomColors.map((color) => {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * canopyR * 0.7;
      return {
        color,
        x: 50 + Math.cos(a) * r,
        y: canopyCy + Math.sin(a) * r * 0.9,
      };
    });
  }, [blossomColors, canopyR, canopyCy, seed]);

  const isBare = p <= 0;

  return (
    <g
      style={
        animate
          ? { transformOrigin: '50px 100px', animation: 'sway 5s ease-in-out infinite' }
          : undefined
      }
    >
      {/* ground mound */}
      <ellipse cx="50" cy="96" rx="26" ry="5" fill="#7c5a3a" opacity="0.35" />

      {isBare ? (
        <circle cx="50" cy="92" r="3" fill="#7c5a3a" />
      ) : (
        <>
          {/* trunk */}
          <path
            d={`M46 96 Q 48 ${(96 + trunkTop) / 2} 50 ${trunkTop} Q 52 ${(96 + trunkTop) / 2} 54 96 Z`}
            fill="#6b4423"
          />
          {/* a couple of branches once the tree is taller */}
          {p > 0.5 && (
            <>
              <path
                d={`M50 ${trunkTop + 14} Q 40 ${trunkTop + 8} 34 ${trunkTop + 2}`}
                stroke="#6b4423"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M50 ${trunkTop + 18} Q 61 ${trunkTop + 12} 67 ${trunkTop + 5}`}
                stroke="#6b4423"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* canopy base */}
          {canopyR > 0 && (
            <circle
              cx="50"
              cy={canopyCy}
              r={canopyR}
              fill="#2f9e52"
              opacity="0.35"
            />
          )}

          {/* leaf clusters */}
          {leaves.map((l, i) => (
            <circle
              key={i}
              cx={l.x}
              cy={l.y}
              r={l.rr}
              fill={l.shade > 0.5 ? '#34a85a' : '#2b8f4c'}
            />
          ))}

          {/* blossoms (one per completed habit, in habit color) */}
          {blossoms.map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={3.2}
              fill={HABIT_COLORS[b.color].flower}
              stroke="#ffffff"
              strokeWidth="0.8"
              style={{ transformOrigin: `${b.x}px ${b.y}px`, animation: 'bloomPop 500ms ease-out' }}
            />
          ))}
        </>
      )}
    </g>
  );
}
