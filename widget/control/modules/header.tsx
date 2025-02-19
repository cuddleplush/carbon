import { Variable, exec } from "astal"
import { Gtk, Gdk } from "astal/gtk4"

import { bash } from "../../../lib/"

export function header(): JSX.Element {
	const uptime = Variable("").poll(1000, ["bash", "-c", "uptime -p | tail -c +4"])
	const who = exec(`bash -c "whoami"`) + " • " + exec(`bash -c "hostname"`)

	return <box cssClasses={["control-header-container"]}>
		<box cssClasses={["control-header"]}>
			<button
				label={'(\\ /)\n( . .)\nc(")(")'}
				onHoverEnter={(self) => self.label = '(\\ /)\n( ^ ^)\nc(")(")'}
				onHoverLeave={(self) => self.label = '(\\ /)\n( . .)\nc(")(")'}>
			</button>

			<box
				vertical={true}
				valign={Gtk.Align.CENTER} >
				<label label={who} halign={Gtk.Align.START} />
				<label label={uptime()} halign={Gtk.Align.START} />
			</box>

		</box>
		<box vertical={true} halign={Gtk.Align.END}>
			<button
				label={"󰒓"}
				cssClasses={["control-icon-button"]}
				hexpand
				vexpand
				onClicked={() => bash("foot -e nvim ~/.config/astal/carbon")} />
			<button
				label={""}
				cssClasses={["control-icon-button"]}
				hexpand
				vexpand
				onButtonPressed={(_, buttonval) => {
					if (buttonval.get_button() === Gdk.BUTTON_PRIMARY) {
						bash("rofi-wall.sh")
					} else {
						bash("wpmgr next")
					}
				}}>
			</button>
		</box>
	</box>
}
