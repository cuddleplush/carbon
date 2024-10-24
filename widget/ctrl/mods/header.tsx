import { Variable, exec } from "astal"
import { Gtk } from "astal/gtk3"
import { easyAsync } from "../../../utils"

export function header() {
	const uptime = Variable("").poll(1000, ["bash", "-c", "uptime -p | tail -c +4"])
	const kver = exec(`bash -c "uname -r | cut -d "-" -f1"`)
	const who = exec(`bash -c "whoami"`) + " • " + exec(`bash -c "hostname"`)

	return <box
		spacing={8} >
		<box
			className={"ctrl-header"} >
			<icon
				className={"pic"}
				icon={`${SRC}/assets/pfp.jpg`}
				iconSize={400} >
			</icon>
			<box
				vertical={true}
				valign={Gtk.Align.CENTER} >
				<label label={who + " • " + kver} />
				<label label={uptime()} />
			</box>
		</box>

		<box
			spacing={8}
			vertical={true} >
			<button
				label={""}
				className={"wp-btn"}
				onClicked={() => easyAsync("rofi-wall.sh")} />
			<button
				label={"󰒓"}
				className={"wp-btn"}
				onClicked={() => easyAsync("foot -e nvim ~/.config/ags/astal")} />
		</box>
	</box>
}
