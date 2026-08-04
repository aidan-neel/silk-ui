<script lang="ts">
import { SkeletonSwap } from '@sivir-ui/svelte/components/skeleton';

let { ready = false }: { ready?: boolean } = $props();
</script>

<SkeletonSwap {ready} delay={20} minVisible={40} lines={2} label="Profile">
    <p>Loaded profile</p>
</SkeletonSwap>
