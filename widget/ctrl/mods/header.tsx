import { Variable, exec } from "astal"
import { Gtk, Gdk } from "astal/gtk3"
import { bash } from "../../../lib/utils"

export function header(): JSX.Element {
	const uptime = Variable("").poll(1000, ["bash", "-c", "uptime -p | tail -c +4"])
	const who = exec(`bash -c "whoami"`) + " • " + exec(`bash -c "hostname"`)

	return <box
		spacing={8} >
		<box
			className={"ctrl-header"} >
			<button
				label={'(\\ /)\n( . .)\nc(")(")'}
				css={"min-height: 70px; padding-left: 6px;"}
				onHover={(self) => self.label = '(\\ /)\n( ^ ^)\nc(")(")'}
				onHoverLost={(self) => self.label = '(\\ /)\n( . .)\nc(")(")'}>
			</button>

			<box
				vertical={true}
				css={"padding-left: 10px;"}
				valign={Gtk.Align.CENTER} >
				<label label={who} halign={Gtk.Align.START} />
				<label label={uptime()} halign={Gtk.Align.START} css={"color: #999999; padding-right: 8px;"} />
			</box>
		</box>

		<box
			spacing={8}
			vertical={true} >
			<button
				label={"󰒓"}
				className={"wp-btn"}
				onClicked={() => bash("foot -e nvim ~/.config/astal/carbon")} />
			<button
				label={""}
				className={"wp-btn"}
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
