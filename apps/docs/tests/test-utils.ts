export function required<T>(value: T | null | undefined, message = 'Expected value to exist'): T {
    if (value == null) {
        throw new Error(message);
    }

    return value;
}

export function queryRequired<T extends Element = HTMLElement>(
    parent: ParentNode,
    selector: string
): T {
    return required(
        parent.querySelector<T>(selector),
        `Expected to find an element matching "${selector}"`
    );
}
