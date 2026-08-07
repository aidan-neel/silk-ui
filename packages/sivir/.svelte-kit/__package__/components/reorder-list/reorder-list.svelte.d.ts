import type { ReorderListProps } from '.';
declare function $$render<T>(): {
    props: ReorderListProps<T>;
    exports: {};
    bindings: 'items';
    slots: {};
    events: {};
};
declare class __sveltets_Render<T> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): 'items';
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T>(
        options: import('svelte').ComponentConstructorOptions<
            ReturnType<__sveltets_Render<T>['props']>
        >
    ): import('svelte').SvelteComponent<
        ReturnType<__sveltets_Render<T>['props']>,
        ReturnType<__sveltets_Render<T>['events']>,
        ReturnType<__sveltets_Render<T>['slots']>
    > & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T>(
        internal: unknown,
        props: ReturnType<__sveltets_Render<T>['props']> & {}
    ): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const ReorderList: $$IsomorphicComponent;
type ReorderList<T> = InstanceType<typeof ReorderList<T>>;
export default ReorderList;
