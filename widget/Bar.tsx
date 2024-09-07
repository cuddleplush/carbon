import { App, Astal, Gtk } from "astal"
import { Date } from "./mods/date"
import { Launcher } from "./mods/launcher"
import { Workspaces } from "./mods/workspaces"

function Start(monitor: number) {
	return <box
		spacing={8}
		halign={Gtk.Align.START} >
			<Launcher />
			{Workspaces(monitor)}
		</box>
}

function Center() {
	return <box 
		spacing={8}
		halign={Gtk.Align.CENTER} >
		</box>
}

function End() {
	return <box
		spacing={8}
		halign={Gtk.Align.END} >
			<Date />
		</box>
}

export default function Bar(monitor: number) {
	return <window
		className="Bar"
		monitor={monitor}
		exclusivity={Astal.Exclusivity.EXCLUSIVE}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.LEFT
			| Astal.WindowAnchor.RIGHT}
		application={App}>
			<centerbox>
				{Start(monitor)}
				{Center()}
				{End()}
			</centerbox>
		</window>
}
