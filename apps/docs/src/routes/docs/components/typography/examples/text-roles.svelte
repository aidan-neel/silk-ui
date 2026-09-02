<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
</script>

<div class="flex w-full max-w-xl flex-col gap-5">
    <Typography.Text variant="lead">
        Lead text introduces a page or a significant section.
    </Typography.Text>
    <Typography.Text variant="body">
        Body text carries longer explanations at a comfortable reading size and rhythm.
    </Typography.Text>
    <Typography.Text variant="supporting">
        Supporting text adds quieter instructions, context, or qualifications.
    </Typography.Text>
    <Typography.Text variant="body">
        Use <Typography.InlineCode>InlineCode</Typography.InlineCode> for commands, paths, and short
        identifiers within prose.
    </Typography.Text>
</div>
