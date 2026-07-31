<script lang="ts">
	import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

	const text =
		'This text fades in word by word. Use response streaming to make an AI answer feel immediate while preserving the layout of the surrounding message.';
</script>

<div class="w-full max-w-xl">
	<ResponseStream textStream={text} mode="fade" fadeDuration={250} segmentDelay={10} />
</div>
