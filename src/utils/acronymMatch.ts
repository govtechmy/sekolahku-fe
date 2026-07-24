/**
 * Acronym / initialism matching for compact search queries.
 *
 * Users often search a school by squashing its name into an acronym, e.g.
 * "smkpp8" for "SMK Putrajaya Presint 8". After tokenising the corpus
 * (`jenisLabel` + `namaSekolah`) the word list becomes:
 *
 *   ["smk", "sekolah", "menengah", "kebangsaan", "putrajaya", "presint", "8"]
 *
 * and "smkpp8" decomposes as the type code "smk" + first letters of
 * "putrajaya"/"presint" + the number "8" (or, equivalently, the initials
 * s-m-k of "sekolah menengah kebangsaan"). The regular token pipeline can't
 * catch this because the characters are glued together with no separators.
 *
 * The matcher walks the query left-to-right and, for each word in order, may
 * consume a matching prefix of the remaining query. Words that don't match the
 * current position are skipped. It uses memoised backtracking (not a greedy
 * pass) so it never misses a valid segmentation.
 */

/**
 * Try to match `query` against an ordered `words` list as an acronym.
 *
 * Returns the maximum number of words that can contribute to a full match of
 * the query, or -1 if the query cannot be fully consumed.
 *
 * Preferring the maximum word count biases toward "spread out" matches (using
 * one letter from many words) over collapsing into a single long prefix, which
 * is the more natural reading of an acronym.
 */
export function matchAcronym(query: string, words: string[]): number {
  const q = query.toLowerCase();
  const n = q.length;
  if (n === 0) return -1;
  const m = words.length;
  if (m === 0) return -1;

  // memo[qi * (m + 1) + wi] holds the best (max) word count for the subproblem
  // "consume q[qi:] using words[wi:]", or undefined when not yet computed.
  const memo = new Map<number, number>();

  const solve = (qi: number, wi: number): number => {
    if (qi === n) return 0; // whole query consumed
    if (wi === m) return -1; // ran out of words with query left over

    const key = qi * (m + 1) + wi;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    // Option 1: skip this word entirely.
    let best = solve(qi, wi + 1);

    // Option 2: consume a prefix of words[wi] that matches q at qi.
    const w = words[wi];
    const maxL = Math.min(w.length, n - qi);
    let l = 0;
    while (l < maxL && q[qi + l] === w[l]) {
      l++;
      const sub = solve(qi + l, wi + 1);
      if (sub >= 0 && sub + 1 > best) best = sub + 1;
    }

    memo.set(key, best);
    return best;
  };

  return solve(0, 0);
}

/**
 * Split a school label/name into lowercase word tokens suitable for acronym
 * matching. Parentheses, punctuation and whitespace are all separators so that
 * "PRESINT 8(1)" yields ["presint", "8", "1"].
 */
export function toAcronymWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s()./,\-–—]+/)
    .filter(Boolean);
}

/**
 * School-specific acronym match. Requires the query to BEGIN with the school
 * type code (words[0], e.g. "smk" / "sk" / "sjkc") — full or partial prefix —
 * then the REMAINDER must be an acronym over the name words (words[1..]).
 *
 * This is deliberately stricter than {@link matchAcronym}: it stops plain name
 * words from matching by scattering letters across unrelated words. For
 * example "meru" must NOT match "SMK menengah RUsila" (me+ru) or
 * "SMK menengah Raja tun Uda" (me+r+u) — those aren't real acronyms.
 *
 * The corpus word list is expected to be `toAcronymWords(`${jenisLabel}
 * ${namaSekolah}`)`, so words[0] is the type code.
 *
 * @returns Number of NAME words consumed after the type code (>= 1 for a real
 *          "type + initials" acronym like "smkpp8"), or -1 if not an acronym.
 */
export function matchSchoolAcronym(query: string, words: string[]): number {
  const q = query.toLowerCase();
  if (words.length === 0 || q.length === 0) return -1;

  // 1) Consume a leading prefix that matches the type code (words[0]).
  const type = words[0];
  const maxK = Math.min(type.length, q.length);
  let k = 0;
  while (k < maxK && q[k] === type[k]) k++;
  if (k === 0) return -1; // query must start with the type code
  if (k >= q.length) return -1; // just the type code → not an acronym

  // 2) The rest must be an acronym over the remaining (name) words.
  const remainder = q.slice(k);
  return matchAcronym(remainder, words.slice(1));
}

export interface AcronymOptions {
  /** Minimum query length before acronym matching is attempted. Default 4. */
  minQueryLength?: number;
  /** Minimum number of words that must contribute to the match. Default 2. */
  minWords?: number;
}

/**
 * Convenience predicate: is `query` a compact, space-less acronym that matches
 * the given word list under the configured thresholds?
 *
 * The thresholds suppress noise from very short or single-word queries (those
 * are already handled well by prefix / fuzzy search).
 */
export function isAcronymMatch(
  query: string,
  words: string[],
  opts: AcronymOptions = {},
): boolean {
  const { minQueryLength = 4, minWords = 2 } = opts;
  const q = query.trim().toLowerCase();
  if (q.length < minQueryLength) return false;
  if (/\s/.test(q)) return false;
  return matchAcronym(q, words) >= minWords;
}
