<script lang="ts">
    import Building from '@lucide/svelte/icons/building';
    import MapPin from '@lucide/svelte/icons/map-pin';
    import Users from '@lucide/svelte/icons/users';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as HoverCard from '@sivir-ui/svelte/components/hover-card';
</script>

<div class="flex items-center justify-center">
    <div class="text-[0.92rem] text-foreground-muted">
        Reviewed by
        <HoverCard.Root>
            <HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
            <HoverCard.Content class="w-60">
                <div class="flex flex-col gap-3">
                    <!-- Header: Avatar + Name -->
                    <div class="flex items-center gap-3">
                        <Avatar.Root size="md">
                            <Avatar.Fallback>AN</Avatar.Fallback>
                        </Avatar.Root>
                        <div class="flex flex-col">
                            <HoverCard.Title class="text-base">Aidan Neel</HoverCard.Title>
                            <p class="text-sm text-foreground-muted">@aidan-neel</p>
                        </div>
                    </div>

                    <!-- Bio -->
                    <HoverCard.Description class="text-sm leading-relaxed text-pretty">
                        Building Sivir, a themeable Svelte component library. Type-driven design &
                        animation polish.
                    </HoverCard.Description>

                    <!-- Meta: Location & Company -->
                    <div class="flex flex-col gap-1 text-xs text-foreground-muted">
                        <div class="flex items-center gap-1.5">
                            <MapPin size={14} />
                            <span>Seattle, WA</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <Building size={14} />
                            <span>Sivir Labs</span>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="flex items-center gap-1 text-xs text-foreground-muted py-1">
                        <Users size={14} />
                        <span>1.2k followers · 89 following</span>
                    </div>

                    <!-- Follow Button -->
                    <Button variant="secondary" size="sm" class="w-full">Follow</Button>
                </div>
            </HoverCard.Content>
        </HoverCard.Root>
        3 days ago.
    </div>
</div>
