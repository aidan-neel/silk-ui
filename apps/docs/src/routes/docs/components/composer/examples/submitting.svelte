<script lang="ts">
    import * as Composer from '@sivir-ui/svelte/components/composer';
</script>

<Composer.Root
    value="Checking the deployment plan..."
    status="submitting"
    onSubmit={() => {}}
    onStop={() => {}}
>
    <Composer.Input aria-label="Submitting prompt" />
    <Composer.Toolbar>
        <Composer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </Composer.Actions>
        <Composer.Submit />
    </Composer.Toolbar>
</Composer.Root>
