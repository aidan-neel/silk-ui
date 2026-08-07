<script module lang="ts">
    const ERROR_THEME_COLOR = '#dc2626'; // token-lint-disable-line no-literal-color: browser theme-color fallback
    let errorThemeCount = 0;
    let savedThemeColors: Array<{ element: HTMLMetaElement; content: string | null }> | undefined;
    let createdThemeColor: HTMLMetaElement | undefined;

    function applyErrorThemeColor() {
        if (errorThemeCount++ > 0) {
            return;
        }

        const themeColors = Array.from(
            document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
        );
        if (themeColors.length === 0) {
            createdThemeColor = document.createElement('meta');
            createdThemeColor.name = 'theme-color';
            document.head.append(createdThemeColor);
            themeColors.push(createdThemeColor);
        }
        savedThemeColors = themeColors.map((element) => ({
            element,
            content: element.getAttribute('content')
        }));
        for (const { element } of savedThemeColors) {
            element.content = ERROR_THEME_COLOR;
        }
    }

    function restoreThemeColor() {
        if (--errorThemeCount > 0) {
            return;
        }
        for (const { element, content } of savedThemeColors ?? []) {
            if (content === null) {
                element.removeAttribute('content');
            } else {
                element.content = content;
            }
        }
        createdThemeColor?.remove();
        createdThemeColor = undefined;
        savedThemeColors = undefined;
    }
</script>

<script lang="ts">
    import type { ModalProps, ModalState } from '.';
    import { setModalContext } from './context.svelte';

    let {
        open = $bindable(false),
        error = false,
        orientation = 'horizontal',
        children
    }: ModalProps = $props();
    const id = $props.id();

    const modalState = $state<ModalState>({
        open,
        error: false,
        orientation: 'horizontal'
    });
    const modalContext = $state({
        id,
        contentId: `modal-${id}`,
        returnFocusEl: undefined as HTMLElement | undefined,
        state: modalState
    });
    let syncedOpen = $state(open);
    let wasOpen = $state(false);
    setModalContext(modalContext);

    $effect.pre(() => {
        if (
            modalState.open &&
            !wasOpen &&
            typeof document !== 'undefined' &&
            document.activeElement instanceof HTMLElement &&
            document.activeElement !== document.body
        ) {
            modalContext.returnFocusEl = document.activeElement;
        }
        wasOpen = modalState.open;
    });

    $effect(() => {
        modalState.error = error;
        modalState.orientation = orientation;
        if (open !== syncedOpen) {
            syncedOpen = open;
            modalState.open = open;
        }
    });

    $effect(() => {
        if (modalState.open !== syncedOpen) {
            syncedOpen = modalState.open;
            open = modalState.open;
        }
    });

    $effect(() => {
        if (!error || !modalState.open || typeof document === 'undefined') {
            return;
        }
        applyErrorThemeColor();
        return restoreThemeColor;
    });
</script>

{@render children?.()}
