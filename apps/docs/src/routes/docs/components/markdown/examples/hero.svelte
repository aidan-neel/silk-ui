<script lang="ts">
import { Markdown } from '@sivir-ui/svelte/components/markdown';

const report = [
    '## Edge cache rollout review',
    '',
    'The canary reduced origin traffic by **38%** while keeping `cache_hit_age` within the expected range. [Open the rollout runbook](https://example.com/runbooks/edge-cache) for the full procedure.',
    '',
    '> Recommendation: continue to 50% traffic, but keep image transforms outside the cache until the key audit is complete.',
    '',
    '### Regional health',
    '',
    '| Region | Hit rate | p95 |',
    '| :--- | ---: | ---: |',
    '| iad1 | 91% | 142 ms |',
    '| fra1 | 88% | 156 ms |',
    '| sin1 | 86% | 171 ms |',
    '',
    '### Rollout tasks',
    '',
    '- [x] Confirm cache headers at the edge',
    '- [x] Compare origin error rates',
    '- [ ] Audit image transformation keys',
    '',
    '```ts',
    'const rollout = await edgeCache.promote({',
    '  traffic: 0.5,',
    "  regions: ['iad1', 'fra1', 'sin1']",
    '});',
    '```'
].join('\n');
</script>

<Markdown
    content={report}
    role="region"
    aria-label="Rendered rollout review"
    tabindex={0}
    class="max-h-[32rem] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-xl)] border border-border bg-panel px-5 py-4 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] sm:px-6 sm:py-5"
/>
