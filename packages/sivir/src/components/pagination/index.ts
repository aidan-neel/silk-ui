import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Pagination from './pagination.svelte';

export type PaginationProps = {
    page?: number;
    total: number;
    siblings?: number;
    onPageChange?: (page: number) => void;
} & DefaultProps;

export { Pagination };
export default Pagination;
