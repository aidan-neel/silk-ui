<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';

    let {
        onRoot = () => {},
        onSocial = () => {},
        onTwitter = () => {},
        onEmail = () => {}
    }: {
        onRoot?: () => void;
        onSocial?: () => void;
        onTwitter?: () => void;
        onEmail?: () => void;
    } = $props();
</script>

<!--
  Cone of nested points:
    Root
    └─ Share
       ├─ Social
       │  └─ Twitter
       └─ Email
-->
<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <span data-testid="dd-trigger">Open menu</span>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Item callback={onRoot}>
            <span data-testid="dd-root-item">Root item</span>
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
                <span data-testid="dd-share">Share</span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                        <span data-testid="dd-social">Social</span>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                        <DropdownMenu.Item callback={onTwitter}>
                            <span data-testid="dd-twitter">Twitter</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Item callback={onSocial}>
                    <span data-testid="dd-social-leaf">Social leaf</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item callback={onEmail}>
                    <span data-testid="dd-email">Email</span>
                </DropdownMenu.Item>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
                <span data-testid="dd-more">More</span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
                <DropdownMenu.Item>
                    <span data-testid="dd-more-item">More item</span>
                </DropdownMenu.Item>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    </DropdownMenu.Content>
</DropdownMenu.Root>
