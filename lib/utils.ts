import { execAsync } from "astal"
import { App } from "astal/gtk3"

// Ugly helper to run things from bash
export function bash(cmd: string): void {
execAsync(["bash", "-c", `${cmd} &`])
    .then((out) => console.log(out))
    .catch((err) => console.error(err))
}

export function hideWindows():void {
	const staticWindows = [
		"bar",
		"desktop",
	]
	for (const window of App.get_windows()) {
		if (!staticWindows.includes(window.name)) {
			App.get_window(window.name)!.hide()
		}
	}

}
