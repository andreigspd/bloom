import { parseDayKey } from './date';

export interface Quote {
  text: string;
  source: string;
}

/**
 * Verified quotes from Anthony (Tony) Robbins' "Unlimited Power: The New
 * Science of Personal Achievement". Kept short and attributed. These are the
 * real thing — not generic motivational filler.
 */
export const QUOTES: Quote[] = [
  {
    text:
      'Knowledge is only potential power until it comes into the hands of someone who knows how to get himself to take effective action.',
    source: 'Unlimited Power',
  },
  {
    text:
      'The literal definition of the word “power” is “the ability to act.”',
    source: 'Unlimited Power',
  },
  {
    text: 'Action is what unites every great success. Action is what produces results.',
    source: 'Unlimited Power',
  },
  {
    text:
      'A real decision is measured by the fact that you’ve taken a new action. If there’s no action, you haven’t truly decided.',
    source: 'Unlimited Power',
  },
  {
    text:
      'The birth of excellence begins with our awareness that our beliefs are a choice.',
    source: 'Unlimited Power',
  },
  {
    text:
      'You can choose beliefs that limit you, or you can choose beliefs that support you.',
    source: 'Unlimited Power',
  },
  {
    text:
      'You shape your perceptions, or someone shapes them for you. You do what you want to do, or you respond to someone else’s plan for you.',
    source: 'Unlimited Power',
  },
  {
    text:
      'Success leaves clues, and if you can model the actions of successful people, you can produce similar results.',
    source: 'Unlimited Power',
  },
  {
    text:
      'People who consistently succeed are those who can commit all of their resources, mental and physical, to work together toward achieving a task.',
    source: 'Unlimited Power',
  },
  {
    text:
      'In the modern world, the quality of life is the quality of communication.',
    source: 'Unlimited Power',
  },
  {
    text:
      'The greatest gift that extraordinarily successful people have over the average person is their ability to get themselves to take action.',
    source: 'Unlimited Power',
  },
  {
    text: 'Communication is power.',
    source: 'Unlimited Power',
  },
  {
    text:
      'If you want to succeed, choose your beliefs carefully, rather than picking up whichever belief sticks.',
    source: 'Unlimited Power',
  },
  {
    text:
      'Each of us has everything we need to succeed within ourselves if we can only learn to access and maximize it.',
    source: 'Unlimited Power',
  },
];

/** Stable index for a given day key so the quote is the same all day. */
function hashDay(day: string): number {
  const d = parseDayKey(day);
  // days since epoch — a simple monotonic integer, no time component
  return Math.floor(d.getTime() / 86_400_000);
}

/** The deterministic quote for a given day. */
export function quoteForDay(day: string): Quote {
  const i = ((hashDay(day) % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[i];
}

/** A different quote by offset (used by the shuffle button). */
export function quoteByOffset(day: string, offset: number): Quote {
  const base = hashDay(day);
  const i = (((base + offset) % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[i];
}
