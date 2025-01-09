import { Gtk, Gdk, Astal, App } from "astal/gtk3"
import { execAsync } from "astal"
import { bash, hideWindows } from "../../lib/utils"

function clicked(cmd: string, exec: string) {
	App.toggle_window(`power`);
	execAsync(["bash", "-c", `~/.config/astal/carbon/bin/dialog.tsx -a ${cmd}`])
		.then((out) => out === "yes" ? bash(exec) : print("no"))
		.catch((err) => console.error(err))
}

function powerItem(icon: string, cmd: string, exec: string): JSX.Element {
	return <button
		className={"power-btn"}
		label={icon}
		onClicked={() => clicked(cmd, exec)} >
	</button>
}

function powerBox(): JSX.Element {
	return <scrollable
		vscroll={Gtk.PolicyType.NEVER}
		hscroll={Gtk.PolicyType.NEVER}>
		<centerbox
			spacing={8}>
			{powerItem("󰿅", "Logout", "hyprctl dispatch exit")}
			{powerItem("󰐥", "Shutdown", "fctl poweroff")}
			{powerItem("󰜉", "Reboot", "fctl reboot")}
		</centerbox>
	</scrollable>
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
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				hideWindows()
			}
		}} >
		{powerBox()}
	</window>
}
