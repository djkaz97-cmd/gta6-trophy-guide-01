// Spoiler: hides story-trophy names & descriptions until earned.
export function isMasked(trophy, earned, spoiler) {
  return !!spoiler && trophy.kind === 'story' && !earned.has(trophy.name);
}
