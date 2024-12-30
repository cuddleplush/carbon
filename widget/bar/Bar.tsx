import { bind } from "astal"
import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { Date } from "./mods/timedate"
import { Launcher } from "./mods/launcher"
import { Workspaces } from "./mods/workspaces"
import { Lang } from "./mods/language"
import { Mute } from "./mods/mute"
import { SysTray } from "./mods/tray"
import { Taskbar } from "./mods/taskbar"
import { Player } from "./mods/mpris"
import { crypto } from "./mods/crypto"

import { barFloat, barSplit } from "../../vars"
import { getDesktop } from "../../utils"

function leftModules(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <box
		spacing={8}
		halign={Gtk.Align.START} >
			{Launcher(gdkmonitor)}
			{Workspaces(gdkmonitor)}
			{Taskbar(gdkmonitor)}
	</box>
}

function centerModules(): JSX.Element {
	return <box 
		spacing={8}
		halign={Gtk.Align.CENTER} >
		{bind(barSplit).as((value) => value === true
			? <Player/>
			: <box/>)}
	</box>
}

function rightModules(): JSX.Element {
	return <box
		spacing={8}
		halign={Gtk.Align.END} >
		{bind(barSplit).as((value) => value === false
			? <Player/>
			: <box/>)}
		<SysTray/>
		<Mute/>
		{getDesktop() === "hyprland" ? Lang() : null}
		<Date/>
	</box>
}

export default function Bar(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <window
		className="Bar"
		gdkmonitor={gdkmonitor}
		margin={bind(barFloat).as((value) => value ? 8 : 0)}
		margin_bottom={bind(barFloat).as((value) => value ? 0 : 0)}
		exclusivity={Astal.Exclusivity.EXCLUSIVE}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.LEFT
			| Astal.WindowAnchor.RIGHT}
		application={App}>
		<centerbox>
			{leftModules(gdkmonitor)}
			{centerModules()}
			{rightModules()}
		</centerbox>
	</window>
}
