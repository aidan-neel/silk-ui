<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';

    let email = $state('');
    let workspaceSlug = $state('');
    let emailInput = $state<HTMLInputElement>();
    let workspaceSlugInput = $state<HTMLInputElement>();
    let emailTouched = $state(false);
    let workspaceSlugTouched = $state(false);
    let submitted = $state(false);
    const errorInputClass =
        'border-[color-mix(in_srgb,var(--color-error)_70%,transparent)] shadow-[0_0_0_calc(var(--border-size)*2)_color-mix(in_srgb,var(--color-error)_25%,transparent)]';

    function emailValidationMessage(
        value: string,
        input: HTMLInputElement | undefined,
        isTouched: boolean
    ): string {
        if (!isTouched) {
            return '';
        }

        if (value.trim() === '') {
            return 'Enter an email address.';
        }

        if (!input?.validity.valid) {
            return 'Enter a valid email address.';
        }

        return '';
    }

    function workspaceSlugValidationMessage(
        value: string,
        input: HTMLInputElement | undefined,
        isTouched: boolean
    ): string {
        if (!isTouched) {
            return '';
        }

        if (value.trim() === '') {
            return 'Enter a workspace slug.';
        }

        if (!input?.validity.valid) {
            return 'Use lowercase letters, numbers, and hyphens only.';
        }

        return '';
    }

    function validate(event: SubmitEvent) {
        event.preventDefault();
        emailTouched = true;
        workspaceSlugTouched = true;
        submitted = true;
    }

    let emailError = $derived(emailValidationMessage(email, emailInput, emailTouched));
    let workspaceSlugError = $derived(
        workspaceSlugValidationMessage(workspaceSlug, workspaceSlugInput, workspaceSlugTouched)
    );
    let isValid = $derived(submitted && !emailError && !workspaceSlugError);
</script>

<form class="w-full max-w-md space-y-4" novalidate onsubmit={validate}>
    <div class="space-y-1.5">
        <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            bind:value={email}
            bind:element={emailInput}
            onblur={() => {
                emailTouched = true;
            }}
            aria-invalid={emailError ? 'true' : undefined}
            aria-describedby={emailError ? 'email-error email-description' : 'email-description'}
            aria-errormessage={emailError ? 'email-error' : undefined}
            class={emailError ? errorInputClass : undefined}
        />
        <div
            data-state={emailError ? 'error' : undefined}
            class="-mt-1.5 max-h-0 overflow-hidden opacity-0 transition-[margin,max-height,opacity] [transition-duration:220ms] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:mt-0 data-[state=error]:max-h-24 data-[state=error]:opacity-100"
        >
            <p
                id="email-error"
                class="text-sm font-medium text-error"
                role={emailError ? 'alert' : undefined}
                aria-hidden={emailError ? undefined : 'true'}
            >
                {emailError}
            </p>
        </div>
        <p
            id="email-description"
            class="text-foreground-muted [font-size:var(--font-size-body,16px)]"
        >
            We'll use this to send workspace invites.
        </p>
    </div>

    <div class="space-y-1.5">
        <Input
            label="Workspace slug"
            placeholder="acme-design"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            bind:value={workspaceSlug}
            bind:element={workspaceSlugInput}
            onblur={() => {
                workspaceSlugTouched = true;
            }}
            aria-invalid={workspaceSlugError ? 'true' : undefined}
            aria-describedby={workspaceSlugError
                ? 'workspace-slug-error workspace-slug-description'
                : 'workspace-slug-description'}
            aria-errormessage={workspaceSlugError ? 'workspace-slug-error' : undefined}
            class={workspaceSlugError ? errorInputClass : undefined}
        />
        <div
            data-state={workspaceSlugError ? 'error' : undefined}
            class="-mt-1.5 max-h-0 overflow-hidden opacity-0 transition-[margin,max-height,opacity] [transition-duration:220ms] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:mt-0 data-[state=error]:max-h-24 data-[state=error]:opacity-100"
        >
            <p
                id="workspace-slug-error"
                class="text-sm font-medium text-error"
                role={workspaceSlugError ? 'alert' : undefined}
                aria-hidden={workspaceSlugError ? undefined : 'true'}
            >
                {workspaceSlugError}
            </p>
        </div>
        <p
            id="workspace-slug-description"
            class="text-foreground-muted [font-size:var(--font-size-body,16px)]"
        >
            Lowercase letters, numbers, and hyphens only.
        </p>
    </div>

    <div class="flex items-center gap-3">
        <Button type="submit" size="sm">Validate fields</Button>
        {#if isValid}
            <p class="text-sm text-success" role="status">Both fields are valid.</p>
        {/if}
    </div>
</form>
