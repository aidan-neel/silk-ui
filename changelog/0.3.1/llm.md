## Traveling highlight off

`chrome.travelingHighlight: false` still mounts `.sivir-item-highlight` and positions it on the active item. It only disables the slide: the fill snaps instead of interpolating. Do not hide the highlight or skip the `travelingHighlight` action when the flag is off. The emitted token remains `--sivir-traveling-highlight: none`.
