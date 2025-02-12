/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Variable } from "astal"

import { bash } from "."

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
export const barSplit = Variable(false)
export const nightLight = Variable(false)

export const debug = Variable(false)

// We listen for changes in these variables and perfrom
// the changes in our shell
barSplit.subscribe((value: boolean) => {
	// If the bar is split, it should also be floating
	value === true ? barFloat.set(true) : barFloat.set(false)
})

barFloat.subscribe((value: boolean) => {
	// If the bar is not floating, it should not be split
	if (value === false) { barSplit.set(false) }
})

nightLight.subscribe((value: boolean) => {
	value === true ? bash("hyprshade on blue-light-filter")
				   : bash("hyprshade off")
})
