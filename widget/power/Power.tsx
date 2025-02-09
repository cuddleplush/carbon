import { Gdk, Astal, App, Gtk } from "astal/gtk4"
import { execAsync } from "astal"

import { Bash, hideWindows } from "../../lib/"

function clicked(cmd: string, exec: string) {
	App.toggle_window(`power`);
	execAsync(["bash", "-c", `~/.config/astal/carbon-tsx-gtk4/bin/dialog.tsx -a ${cmd}`])
		.then((out) => out === "yes" ? Bash(exec) : print("no"))
		.catch((err) => console.error(err))
}

function powerItem(icon: string, cmd: string, exec: string): JSX.Element {
	return <button
		cssClasses={["power-btn"]}
		label={icon}
		onClicked={() => clicked(cmd, exec)} >
	</button>
}

function powerBox(): JSX.Element {
	return <Gtk.ScrolledWindow
		vscrollbarPolicy={Gtk.PolicyType.NEVER}
		hscrollbarPolicy={Gtk.PolicyType.NEVER}>
		<centerbox>
			{powerItem("󰿅", "Logout", "hyprctl dispatch exit")}
			{powerItem("󰐥", "Shutdown", "fctl poweroff")}
			{powerItem("󰜉", "Reboot", "fctl reboot")}
		</centerbox>
	</Gtk.ScrolledWindow>
}

export default function(): JSX.Element {
	return <window
		visible={false}
		name={"power"}
		namespace={"carbon-power"}
		anchor={Astal.WindowAnchor.NONE}
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.EXCLUSIVE}
		layer={Astal.Layer.OVERLAY}
		application={App}
		onKeyPressed={(_, keyval) => {
			if (keyval === Gdk.KEY_Escape) {
				hideWindows()
			}
		}} >
		{powerBox()}
	</window>
}
