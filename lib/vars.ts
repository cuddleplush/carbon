import { Variable } from "astal"
import { bash } from "./utils"
import Styler from "./style"

export default {
    keyboardID: "hs6209-usb-dongle",
    wsNum: 5,
	player: "cider",
	playerPos: "center"
};

export const dummyVar = Variable(false)
export const barFloat = Variable(false)
export const barSplit = Variable(false)
export const nightLight = Variable(false)
export const hyprSplit = Variable(true)

barSplit.subscribe((value: boolean) => {
	Styler(value);
	value === true ? barFloat.set(true) : barFloat.set(false)
})

barFloat.subscribe((value: boolean) => {
	if (value === false) { barSplit.set(false) }
})

nightLight.subscribe((value: boolean) => {
	value === true ? bash("hyprshade on blue-light-filter")
				   : bash("hyprshade off")
})
