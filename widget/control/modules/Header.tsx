import { Variable, exec } from "astal"
import { Gtk, Gdk } from "astal/gtk4"
import { Bash } from "../../../lib/"

export function header(): JSX.Element {
	const uptime = Variable("").poll(1000, ["bash", "-c", "uptime -p | tail -c +4"])
	const who = exec(`bash -c "whoami"`) + " • " + exec(`bash -c "hostname"`)

	return <box
		spacing={8}>
		<box
			cssClasses={["control-header"]}>
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

		<box
			spacing={8}
			vertical={true} >
			<button
				label={"󰒓"}
				cssClasses={["control-icon-button"]}
				onClicked={() => Bash("foot -e nvim ~/.config/astal/carbon")} />
			<button
				label={""}
				cssClasses={["control-icon-button"]}
				onButtonPressed={(_, buttonval) => {
					if (buttonval.get_button() === Gdk.BUTTON_PRIMARY) {
						Bash("rofi-wall.sh")
					} else {
						Bash("wpmgr next")
					}
				}}>
			</button>
		</box>
	</box>
}
