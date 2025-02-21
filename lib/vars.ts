/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Variable } from "astal"

import { bash, style } from "."

// Settings
export default {
    keyboardID: "hs6209-usb-dongle",
	player: "cider",
};

// These variables control various states of our shell,
// such as specific style aspects or overlays.
// These can change at runtime
export const dummyVar = Variable(false)
export const barFloat = Variable(false)
export const barBorders = Variable(false)
export const barSpacers = Variable(false)
export const nightLight = Variable(false)

barBorders.subscribe((value: boolean) => {
	style(value, false)
})

barSpacers.subscribe((value: boolean) => {
	style(false, value)
})

barFloat.subscribe((value: boolean) => {
	// If the bar is not floating, it should not be split
	if (value === false) { barBorders.set(false) }
})

nightLight.subscribe((value: boolean) => {
	value === true ? bash("hyprshade on blue-light-filter")
				   : bash("hyprshade off")
})


