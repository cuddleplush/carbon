import { Variable, App } from "astal"
import { applyStyle } from "./utils";

export const substitutes = {
    "org.gnome.Calendar": "Calendar",
    "footclient": "foot",
    "org.gnome.Polari": "Polari",
    "launcher": "Lunar Client",
    "org.prismlauncher.PrismLauncher": "Prism Launcher",
    "com.obsproject.Studio": "OBS",
    "org.corectrl.CoreCtrl": "CoreCtrl",
    "org.telegram.desktop": "Telegram",
    "dev.zed.Zed": "Zed",
};

export default {
    keyboardID: "hs6209-usb-dongle",
    wsNum: 5,
	player: "cider",
	playerPos: "end"
};

export const barFloat = Variable(false)
export const barSplit = Variable(false)
export const darkMode = Variable(true)

barSplit.subscribe((value: boolean) => {
	applyStyle(value, darkMode.get())
})

darkMode.subscribe((value: boolean) => {
	applyStyle(barSplit.get(), value)
})
