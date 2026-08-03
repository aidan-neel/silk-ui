<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import { onMount } from 'svelte';

    let elapsedTenths = $state(21);
    let elapsed = $derived(`${(elapsedTenths / 10).toFixed(1)}s`);

    onMount(() => {
        const id = setInterval(() => {
            elapsedTenths += 1;
        }, 100);
        return () => clearInterval(id);
    });
</script>

<div class="flex w-full max-w-xl flex-col gap-3">
    <Tool.Root name="2 customer records" state="complete" duration="1.2s">
        <Tool.Item name="Grep" detail="cus_4f81" kind="search" />
        <Tool.Item name="Read" detail="refund status" kind="read" />
    </Tool.Root>
    <Tool.Root name="1 recipient" state="running" duration={elapsed}>
        <Tool.Item name="Bash" detail="send resolution email" />
    </Tool.Root>
</div>
