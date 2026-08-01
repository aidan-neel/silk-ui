import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** Styling merged into Theming for v1. */
export const load: PageLoad = () => {
    redirect(301, '/docs/theming');
};
