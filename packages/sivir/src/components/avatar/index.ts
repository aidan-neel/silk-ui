import type { Snippet } from 'svelte';
import type { HTMLImgAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './avatar.svelte';
import Image from './avatar-image.svelte';
import Fallback from './avatar-fallback.svelte';

export type AvatarProps = {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	shape?: 'circle' | 'square';
	children?: Snippet;
} & DefaultProps;

export type AvatarImageProps = {
	src?: string;
	alt?: string;
} & DefaultProps &
	HTMLImgAttributes;

export type AvatarFallbackProps = {
	children?: Snippet;
} & DefaultProps;

export { Root, Image, Fallback };
