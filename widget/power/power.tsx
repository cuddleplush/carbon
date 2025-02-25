import { Gdk, Astal, App, Gtk } from "astal/gtk3"
import { execAsync } from "astal"

import { bash, hideWindows } from "../../lib/"

function clicked(cmd: string, exec: string) {
	App.toggle_window(`power`);
	execAsync(["bash", "-c", `${SRC}/bin/dialog.tsx -a ${cmd}`])
		.then((out) => out === "yes" ? bash(exec) : print(out))
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
		className={"power-box"}
		vscroll={Gtk.PolicyType.NEVER}
		hscroll={Gtk.PolicyType.NEVER}>
		<box>
			{powerItem("logout", "Logout", "hyprctl dispatch exit")}
			{powerItem("shutdown", "Shutdown", "fctl poweroff")}
			{powerItem("reboot", "Reboot", "fctl reboot")}
		</box>
	</scrollable>
}

export default function(): JSX.Element {
	return <window
		visible={false}
		name={"power"}
		namespace={"carbon-power"}
		anchor={Astal.WindowAnchor.BOTTOM}
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.EXCLUSIVE}
		layer={Astal.Layer.OVERLAY}
		margin={-5}
		application={App}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				hideWindows()
			}
		}} >
		{powerBox()}
	</window>
}
