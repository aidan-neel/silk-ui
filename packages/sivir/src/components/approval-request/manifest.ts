import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'approval-request',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Modal permission prompt for reviewing and resolving agent tool execution requests.',
    role: 'alertdialog',
    files: [
        'components/approval-request/approval-request.svelte',
        'components/approval-request/approval-request-cancel.svelte',
        'components/approval-request/approval-request-confirm.svelte',
        'components/approval-request/approval-request-content.svelte',
        'components/approval-request/approval-request-description.svelte',
        'components/approval-request/approval-request-details.svelte',
        'components/approval-request/approval-request-footer.svelte',
        'components/approval-request/approval-request-header.svelte',
        'components/approval-request/approval-request-icon.svelte',
        'components/approval-request/approval-request-risk.svelte',
        'components/approval-request/approval-request-status.svelte',
        'components/approval-request/approval-request-title.svelte',
        'components/approval-request/context.svelte.ts',
        'components/approval-request/index.ts',
        'components/approval-request/manifest.ts'
    ],
    components: ['alert-dialog', 'badge'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
