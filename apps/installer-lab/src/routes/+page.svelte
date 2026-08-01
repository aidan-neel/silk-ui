<script lang="ts">
    import { onMount } from 'svelte';
    import BrandMark from '@sivir-ui/svelte/brand-mark';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Card from '@sivir-ui/svelte/components/card';
    import { Progress } from '@sivir-ui/svelte/components/progress';
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import {
        isActivePhase,
        type InstallPath,
        type RunPhase,
        type RunSnapshot,
        type RunSource
    } from '$lib/run-types';
    import type { ManualPlan, TerminalSnapshot } from '$lib/terminal-types';

    type LabMode = 'automatic' | 'manual';

    const emptySnapshot: RunSnapshot = {
        id: null,
        phase: 'idle',
        source: 'local',
        installPath: 'cli',
        startedAt: null,
        finishedAt: null,
        elapsedMs: 0,
        componentCount: 0,
        version: null,
        previewUrl: null,
        previewPid: null,
        activeCommand: null,
        failure: null
    };

    const phases: RunPhase[] = [
        'cleaning',
        'scaffolding',
        'resolving-artifact',
        'installing',
        'generating',
        'checking',
        'building',
        'starting',
        'ready'
    ];
    const developerSamples = [
        {
            title: 'Component usage',
            language: 'Svelte',
            code: `\u003Cscript lang="ts">
\timport { Button } from '@sivir-ui/svelte/components/button';
\n\tfunction saveChanges() {
\t\t// Persist the form.
\t}
\u003C/script>
\n<Button variant="primary" onclick={saveChanges}>
\tSave changes
</Button>`
        },
        {
            title: 'Public interface',
            language: 'TypeScript',
            code: `type ButtonProps = {
\thref?: string;
\tvariant?: ButtonVariant;
\tsize?: 'sm' | 'md' | 'lg' | 'icon';
\tonclick?: () => void;
} & Partial<HTMLButtonAttributes | HTMLAnchorAttributes>;`
        },
        {
            title: 'CSS entrypoint',
            language: 'CSS',
            code: `@import '@sivir-ui/svelte/ui.css';
@source '../lib/**/*.{svelte,ts}';
\n.settings-card {
\tpadding: var(--card-padding);
\tborder-radius: var(--radius-lg);
\tbackground: var(--card-bg);
\tbox-shadow: var(--card-shadow);
}`
        }
    ] as const;
    const emptyTerminal: TerminalSnapshot = {
        cwd: '',
        running: false,
        preparing: false,
        activeCommand: null,
        startedAt: null,
        finishedAt: null,
        exitCode: null,
        signal: null,
        prepared: false,
        source: null,
        installPath: null
    };

    let snapshot: RunSnapshot = $state(emptySnapshot);
    let mode: LabMode = $state('automatic');
    let source: RunSource = $state('local');
    let installPath: InstallPath = $state('cli');
    let log = $state('');
    let submitting = $state(false);
    let requestError = $state<string | null>(null);
    let now = $state(Date.now());
    let terminal = $state(emptyTerminal);
    let terminalLog = $state('');
    let terminalInput = $state('');
    let terminalInputElement = $state<HTMLInputElement>();
    let terminalEnd = $state<HTMLSpanElement>();
    let manualPlan = $state<ManualPlan | null>(null);
    let planLoading = $state(false);
    let planRequest = 0;
    let preparationRequest: string | null = null;

    const active = $derived(isActivePhase(snapshot.phase));
    const terminalBusy = $derived(terminal.running || terminal.preparing);
    const controlsDisabled = $derived(active || submitting || terminalBusy);
    const terminalReady = $derived(
        terminal.prepared && terminal.source === source && terminal.installPath === installPath
    );
    const elapsedMs = $derived(
        snapshot.startedAt
            ? (snapshot.finishedAt ? Date.parse(snapshot.finishedAt) : now) -
                  Date.parse(snapshot.startedAt)
            : snapshot.elapsedMs
    );
    const elapsed = $derived(formatElapsed(elapsedMs));
    const statusLabel = $derived(phaseLabel(snapshot.phase));
    const progress = $derived.by(() => {
        if (snapshot.phase === 'idle') return 0;
        if (snapshot.phase === 'ready') return 100;
        const effectivePhase = snapshot.failure?.phase ?? snapshot.phase;
        const index = phases.indexOf(effectivePhase);
        return index < 0 ? 0 : Math.round(((index + 1) / phases.length) * 100);
    });
    const badgeVariant = $derived(
        snapshot.phase === 'ready'
            ? 'success'
            : snapshot.phase === 'failed'
              ? 'error'
              : snapshot.phase === 'cancelled'
                ? 'warning'
                : active
                  ? 'info'
                  : 'secondary'
    );
    const terminalStatus = $derived(
        terminal.preparing
            ? 'Preparing empty app'
            : terminal.running
              ? 'Running'
              : terminal.exitCode === 0
                ? 'Last command passed'
                : terminal.exitCode !== null || terminal.signal
                  ? 'Last command stopped'
                  : 'Ready'
    );
    const terminalBadgeVariant = $derived(
        terminal.preparing
            ? 'info'
            : terminal.running
              ? 'info'
              : terminal.exitCode === 0
                ? 'success'
                : terminal.exitCode !== null || terminal.signal
                  ? 'error'
                  : 'secondary'
    );

    $effect(() => {
        if (mode !== 'manual') return;
        const request = ++planRequest;
        planLoading = true;
        void fetch(
            `/api/terminal/plan?source=${encodeURIComponent(source)}&installPath=${encodeURIComponent(installPath)}`
        )
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text());
                return response.json() as Promise<{ plan: ManualPlan }>;
            })
            .then((data) => {
                if (request === planRequest) manualPlan = data.plan;
            })
            .catch((error) => {
                if (request === planRequest)
                    requestError = error instanceof Error ? error.message : String(error);
            })
            .finally(() => {
                if (request === planRequest) planLoading = false;
            });
    });

    $effect(() => {
        if (mode !== 'manual') return;
        const key = `${source}:${installPath}`;
        if (terminalReady || terminalBusy || preparationRequest === key) return;
        preparationRequest = key;
        void prepareTerminal(false);
    });

    $effect(() => {
        terminalLog;
        terminalEnd?.scrollIntoView({ block: 'nearest' });
    });

    onMount(() => {
        let disposed = false;
        void fetch('/api/run')
            .then((response) => response.json())
            .then((data: { snapshot: RunSnapshot }) => {
                if (disposed) return;
                snapshot = data.snapshot;
                source = data.snapshot.source;
                installPath = data.snapshot.installPath;
            });

        const events = new EventSource('/api/run/events');
        events.addEventListener('snapshot', (event) => {
            snapshot = JSON.parse((event as MessageEvent).data) as RunSnapshot;
        });
        void fetch('/api/terminal')
            .then((response) => response.json())
            .then((data: { snapshot: TerminalSnapshot }) => {
                if (!disposed) terminal = data.snapshot;
            });
        const terminalEvents = new EventSource('/api/terminal/events');
        terminalEvents.addEventListener('snapshot', (event) => {
            terminal = JSON.parse((event as MessageEvent).data) as TerminalSnapshot;
        });
        terminalEvents.addEventListener('log', (event) => {
            const data = JSON.parse((event as MessageEvent).data) as { chunk: string };
            terminalLog += data.chunk;
        });
        terminalEvents.addEventListener('clear', () => {
            terminalLog = '';
        });
        events.addEventListener('log', (event) => {
            const data = JSON.parse((event as MessageEvent).data) as { chunk: string };
            log += data.chunk;
        });
        const ticker = window.setInterval(() => (now = Date.now()), 250);
        return () => {
            disposed = true;
            events.close();
            terminalEvents.close();
            window.clearInterval(ticker);
        };
    });

    function formatElapsed(milliseconds: number) {
        const seconds = Math.max(0, milliseconds) / 1000;
        if (seconds < 60) return `${seconds.toFixed(1)}s`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${(seconds % 60).toFixed(0).padStart(2, '0')}s`;
    }

    function phaseLabel(phase: RunPhase) {
        return {
            idle: 'Ready to run',
            cleaning: 'Cleaning workspace',
            scaffolding: 'Creating SvelteKit app',
            'resolving-artifact': 'Packing Sivir',
            installing: 'Installing components',
            generating: 'Generating examples',
            checking: 'Checking types',
            building: 'Building app',
            starting: 'Verifying preview',
            ready: 'Ready',
            failed: 'Failed',
            cancelled: 'Cancelled'
        }[phase];
    }

    async function createRun() {
        submitting = true;
        requestError = null;
        log = '';
        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ source, installPath })
            });
            if (!response.ok) throw new Error(await response.text());
            const data = (await response.json()) as { snapshot: RunSnapshot };
            snapshot = data.snapshot;
        } catch (error) {
            requestError = error instanceof Error ? error.message : String(error);
        } finally {
            submitting = false;
        }
    }

    async function cancelRun() {
        requestError = null;
        const response = await fetch('/api/run/cancel', { method: 'POST' });
        if (!response.ok) requestError = await response.text();
    }

    function selectManualCommand(command: string) {
        terminalInput = command;
        queueMicrotask(() => terminalInputElement?.focus());
    }

    async function executeTerminal() {
        const command = terminalInput.trim();
        if (!command || terminalBusy) return;
        requestError = null;
        try {
            const response = await fetch('/api/terminal', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ command })
            });
            if (!response.ok) throw new Error(await response.text());
            terminalInput = '';
        } catch (error) {
            requestError = error instanceof Error ? error.message : String(error);
        }
    }

    async function cancelTerminal() {
        requestError = null;
        try {
            const response = await fetch('/api/terminal/cancel', { method: 'POST' });
            if (!response.ok) throw new Error(await response.text());
        } catch (error) {
            requestError = error instanceof Error ? error.message : String(error);
        }
    }

    async function prepareTerminal(force: boolean) {
        requestError = null;
        try {
            const response = await fetch('/api/terminal/reset', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ source, installPath })
            });
            if (!response.ok) throw new Error(await response.text());
            const data = (await response.json()) as { snapshot: TerminalSnapshot };
            terminal = data.snapshot;
        } catch (error) {
            requestError = error instanceof Error ? error.message : String(error);
            if (!force) preparationRequest = null;
        }
    }
</script>

<svelte:head>
    <title>Sivir UI · Installer lab</title>
    <meta name="description" content="Test Sivir UI installation paths in a disposable app." />
</svelte:head>

<main class="lab">
    <div class="wordmark" aria-label="Sivir UI installer lab">
        <BrandMark size={32} />
        <span>Sivir UI</span>
        <Badge variant="secondary">Installer lab</Badge>
    </div>

    <div class="lab-workspace">
        <div class="lab-runner">
            <Card.Root variant="panel" class="controls">
                <div class="control-row">
                    <span class="control-label">Mode</span>
                    <div class="button-group">
                        <Button
                            variant={mode === 'automatic' ? 'secondary' : 'ghost'}
                            size="sm"
                            disabled={terminalBusy}
                            onclick={() => (mode = 'automatic')}>Automatic</Button
                        >
                        <Button
                            variant={mode === 'manual' ? 'secondary' : 'ghost'}
                            size="sm"
                            disabled={active}
                            onclick={() => (mode = 'manual')}>Manual terminal</Button
                        >
                    </div>
                </div>

                <div class="control-row">
                    <span class="control-label">Source</span>
                    <div class="button-group">
                        <Button
                            variant={source === 'local' ? 'secondary' : 'ghost'}
                            size="sm"
                            disabled={controlsDisabled}
                            onclick={() => (source = 'local')}>Local working tree</Button
                        >
                        <Button
                            variant={source === 'npm' ? 'secondary' : 'ghost'}
                            size="sm"
                            disabled={controlsDisabled}
                            onclick={() => (source = 'npm')}>npm latest</Button
                        >
                    </div>
                </div>

                <div class="control-row">
                    <span class="control-label">Install</span>
                    <div class="button-group">
                        <Button
                            variant={installPath === 'cli' ? 'secondary' : 'ghost'}
                            size="sm"
                            disabled={controlsDisabled}
                            onclick={() => (installPath = 'cli')}>CLI source-copy</Button
                        >
                        <Button
                            variant={installPath === 'package' ? 'secondary' : 'ghost'}
                            size="sm"
                            disabled={controlsDisabled}
                            onclick={() => (installPath = 'package')}>Package imports</Button
                        >
                    </div>
                </div>

                <div class="run-action">
                    {#if mode === 'manual'}
                        <span class="manual-summary">
                            {terminal.preparing
                                ? 'Preparing empty app…'
                                : terminalReady
                                  ? `${manualPlan?.steps.length ?? 0} commands · app ready`
                                  : planLoading
                                    ? 'Loading guide…'
                                    : 'App preparation required'}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={terminalBusy}
                            onclick={() => prepareTerminal(true)}>Recreate app</Button
                        >
                    {:else if active}
                        <Button variant="destructive" onclick={cancelRun}>Cancel</Button>
                    {:else}
                        <Button onclick={createRun} disabled={submitting}>
                            {submitting ? 'Starting…' : 'Create fresh app'}
                        </Button>
                    {/if}
                </div>
            </Card.Root>

            {#if requestError}
                <Alert.Root variant="error">
                    <Alert.Title>Request failed</Alert.Title>
                    <Alert.Description>{requestError}</Alert.Description>
                </Alert.Root>
            {/if}

            {#if mode === 'automatic'}
                <section class="status" aria-live="polite">
                    <div class="status-line">
                        <Badge variant={badgeVariant}>{statusLabel}</Badge>
                        <span class="run-meta tabular">{elapsed}</span>
                        {#if snapshot.version}<span class="run-meta">v{snapshot.version}</span>{/if}
                        {#if snapshot.componentCount}<span class="run-meta"
                                >{snapshot.componentCount} components</span
                            >{/if}
                    </div>
                    <Progress
                        value={progress}
                        indeterminate={active && snapshot.phase === 'cleaning'}
                    />
                </section>

                {#if snapshot.failure}
                    <Alert.Root variant="error">
                        <Alert.Title>{phaseLabel(snapshot.failure.phase)}</Alert.Title>
                        <Alert.Description>{snapshot.failure.message}</Alert.Description>
                        {#if snapshot.failure.command}
                            <code class="failure-command">
                                {snapshot.failure.command.bin}
                                {snapshot.failure.command.args.join(' ')}
                            </code>
                        {/if}
                    </Alert.Root>
                {/if}

                <Card.Root variant="panel" class="log-panel">
                    <ScrollArea class="log-scroll">
                        <pre>{log || '$ Waiting for a run…'}</pre>
                    </ScrollArea>
                </Card.Root>

                {#if snapshot.phase === 'ready' && snapshot.previewUrl}
                    <div class="preview-actions">
                        <span>Consumer preview</span>
                        <Button
                            variant="outline"
                            size="sm"
                            href={snapshot.previewUrl}
                            target="_blank"
                        >
                            Open in new tab
                        </Button>
                    </div>
                    <Card.Root variant="panel" class="preview-panel">
                        <iframe src={snapshot.previewUrl} title="Generated Sivir consumer preview"
                        ></iframe>
                    </Card.Root>
                {/if}
            {:else}
                <section class="manual-layout">
                    <div class="manual-heading">
                        <div>
                            <span class="manual-title">Command guide</span>
                            <span class="manual-description"
                                >App setup is automatic. Choose a Sivir command, then run it.</span
                            >
                        </div>
                        <code>{manualPlan?.workspace ?? 'Preparing workspace…'}</code>
                    </div>

                    <Card.Root variant="panel" class="guide-panel">
                        <ScrollArea class="guide-scroll">
                            <ol class="guide-list">
                                {#each manualPlan?.steps ?? [] as step, index (step.id)}
                                    <li>
                                        <Button
                                            variant="ghost"
                                            class="guide-step"
                                            disabled={!terminalReady || terminalBusy}
                                            onclick={() => selectManualCommand(step.command)}
                                        >
                                            <span class="step-index tabular"
                                                >{String(index + 1).padStart(2, '0')}</span
                                            >
                                            <span class="step-copy">
                                                <span class="step-title">{step.title}</span>
                                                <span class="step-description"
                                                    >{step.description}</span
                                                >
                                                <code>{step.command}</code>
                                            </span>
                                        </Button>
                                    </li>
                                {/each}
                            </ol>
                        </ScrollArea>
                    </Card.Root>

                    <div class="terminal-heading">
                        <div class="terminal-status" aria-live="polite">
                            <span>Terminal</span>
                            <Badge variant={terminalBadgeVariant}>{terminalStatus}</Badge>
                        </div>
                        <code title={terminal.cwd}>{terminal.cwd || 'Preparing…'}</code>
                    </div>
                    <Card.Root variant="panel" class="terminal-panel">
                        <ScrollArea class="terminal-scroll">
                            <pre>{terminalLog ||
                                    (terminal.preparing
                                        ? 'Preparing the empty Svelte app…'
                                        : 'Manual terminal ready. Choose a command above or type your own.')}</pre>
                            <span bind:this={terminalEnd}></span>
                        </ScrollArea>
                        <form
                            class="terminal-form"
                            onsubmit={(event) => {
                                event.preventDefault();
                                void executeTerminal();
                            }}
                        >
                            <span class="terminal-prompt" aria-hidden="true">$</span>
                            <Input
                                bind:element={terminalInputElement}
                                bind:value={terminalInput}
                                class="terminal-input"
                                placeholder="Type one command…"
                                aria-label="Manual terminal command"
                                autocomplete="off"
                                spellcheck="false"
                                disabled={!terminalReady || terminalBusy}
                            />
                            {#if terminalBusy}
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onclick={cancelTerminal}>Cancel</Button
                                >
                            {:else}
                                <Button type="submit" size="sm" disabled={!terminalInput.trim()}
                                    >Run</Button
                                >
                            {/if}
                        </form>
                    </Card.Root>
                </section>
            {/if}
        </div>

        <aside class="developer-preview" aria-labelledby="developer-preview-title">
            <div class="developer-preview-heading">
                <div>
                    <h2 id="developer-preview-title">Developer view</h2>
                    <p>
                        Representative source, contracts, and styling surfaces from the published
                        package.
                    </p>
                </div>
                <Badge variant="secondary">@sivir-ui/svelte</Badge>
            </div>
            <div class="developer-sample-grid">
                {#each developerSamples as sample (sample.title)}
                    <Card.Root variant="panel" class="developer-sample">
                        <div class="developer-sample-heading">
                            <span>{sample.title}</span>
                            <code>{sample.language}</code>
                        </div>
                        <pre><code>{sample.code}</code></pre>
                    </Card.Root>
                {/each}
            </div>
        </aside>
    </div>
</main>
