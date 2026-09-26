import { HABIT_COLORS } from '../lib/colors';
import type { HabitColor } from '../lib/types';

/**
 * A single plant drawn in SVG. `stage` runs 0..4:
 *  0 seed (in soil), 1 sprout, 2 young stem, 3 bud, 4 full flower.
 * The plant is drawn in a 60-wide local coordinate space, anchored at the
 * bottom-center (x=30, y=100). Caller positions it via a <g transform>.
 */
export function Plant({
  stage,
  color,
  emoji,
  swayDelay = 0,
}: {
  stage: number;
  color: HabitColor;
  emoji?: string;
  swayDelay?: number;
}) {
  const c = HABIT_COLORS[color];
  const s = Math.max(0, Math.min(4, stage));

  // Height of the stem grows with stage.
  const stemTop = 100 - [6, 26, 50, 68, 78][s];
  const showLeaves = s >= 2;
  const showBud = s === 3;
  const showFlower = s >= 4;

  return (
    <g style={{ transformOrigin: '30px 100px', animation: `sway 4s ease-in-out ${swayDelay}s infinite` }}>
      {/* seed mound / soil bump */}
      {s === 0 && (
        <>
          <ellipse cx="30" cy="98" rx="10" ry="4" fill="#5c3a21" opacity="0.5" />
          <circle cx="30" cy="95" r="3.2" fill="#7c5a3a" />
        </>
      )}

      {s >= 1 && (
        <>
          {/* stem */}
          <path
            d={`M30 100 Q ${30 + (s % 2 ? 4 : -4)} ${(100 + stemTop) / 2} 30 ${stemTop}`}
            stroke={c.flowerDark}
            strokeWidth={s >= 3 ? 3 : 2.2}
            fill="none"
            strokeLinecap="round"
          />

          {/* sprout leaves at base for stage 1 */}
          {s === 1 && (
            <>
              <path d="M30 92 Q 18 86 14 92 Q 22 94 30 92 Z" fill={c.flower} />
              <path d="M30 92 Q 42 86 46 92 Q 38 94 30 92 Z" fill={c.flower} />
            </>
          )}

          {/* mid leaves */}
          {showLeaves && (
            <>
              <path
                d={`M30 ${stemTop + 22} Q 12 ${stemTop + 14} 8 ${stemTop + 24} Q 22 ${stemTop + 26} 30 ${stemTop + 22} Z`}
                fill={c.flower}
              />
              <path
                d={`M30 ${stemTop + 30} Q 48 ${stemTop + 22} 52 ${stemTop + 32} Q 38 ${stemTop + 34} 30 ${stemTop + 30} Z`}
                fill={c.flower}
                opacity="0.9"
              />
            </>
          )}

          {/* bud */}
          {showBud && <circle cx="30" cy={stemTop} r="6" fill={c.flowerDark} />}

          {/* flower head */}
          {showFlower && (
            <g style={{ transformOrigin: `30px ${stemTop}px`, animation: 'bloomPop 600ms ease-out' }}>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="30"
                  cy={stemTop - 8}
                  rx="5"
                  ry="9"
                  fill={c.flower}
                  transform={`rotate(${deg} 30 ${stemTop})`}
                />
              ))}
              <circle cx="30" cy={stemTop} r="5.5" fill="#fde68a" />
              <circle cx="30" cy={stemTop} r="5.5" fill="#f59e0b" opacity="0.25" />
            </g>
          )}
        </>
      )}

      {/* emoji marker floating above a mature plant */}
      {emoji && s >= 3 && (
        <text x="30" y={stemTop - 16} textAnchor="middle" fontSize="12">
          {emoji}
        </text>
      )}
    </g>
  );
}
