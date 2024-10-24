import { Gtk, Astal, App } from "astal/gtk3"
import { easyAsync } from "../../utils"

function powerItem(icon: string, exec: string) {
	return <button
		className={"power-btn"}
		label={icon}
		onClicked={() => easyAsync(exec)} >
	</button>
}

function powerBox() {
	return <scrollable
		vscroll={Gtk.PolicyType.NEVER}
		hscroll={Gtk.PolicyType.NEVER}>
		<centerbox
			spacing={8}>
			{powerItem("󰿅", "hyprctl dispatch exit")}
			{powerItem("󰐥", "fctl poweroff")}
			{powerItem("󰜉", "fctl reboot")}
		</centerbox>
	</scrollable>
}

export default function power() {
	return <window
		visible={false}
		name={"power"}
		anchor={Astal.WindowAnchor.NONE}
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.EXCLUSIVE}
		layer={Astal.Layer.OVERLAY}
		application={App} >
		{powerBox()}
	</window>
}
