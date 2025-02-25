import { Variable, exec } from "astal"
import { Gtk, Gdk } from "astal/gtk3"
import { bash } from "../../../lib"

export function header(): JSX.Element {
	const uptime = Variable("").poll(1000, ["bash", "-c", "uptime -p | tail -c +4"])
	const who = exec(`bash -c "whoami"`) + " • " + exec(`bash -c "hostname"`)

	return <box className={"control-header-container"}>
		<box
			className={"control-header"} >
			<button
				label={'(\\ /)\n( . .)\nc(")(")'}
				onHover={(self) => self.label = '(\\ /)\n( ^ ^)\nc(")(")'}
				onHoverLost={(self) => self.label = '(\\ /)\n( . .)\nc(")(")'}>
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
				className={"control-icon-button"}
				hexpand
				vexpand
				onClicked={() => bash("foot -e nvim ~/.config/astal/carbon")} />
			<button
				label={""}
				className={"control-icon-button"}
				hexpand
				vexpand
				onButtonPressEvent={(_, event) => {
					if (event.get_button()[1] === Gdk.BUTTON_PRIMARY) {
						bash("rofi-wall.sh")
					} else {
						bash("wpmgr next")
					}
				}}>
			</button>
		</box>
	</box>
}
