import { bind } from "astal"
import { App, Astal, Gtk, Gdk } from "astal/gtk4"

import Launcher	  from "./modules/ControlMenuButton"
import Workspaces from "./modules/Workspaces"
import Taskbar    from "./modules/Taskbar"
import Player     from "./modules/MprisStatus"
import SysTray 	  from "./modules/Tray"
import Mute 	  from "./modules/MuteIndicator"
import Lang 	  from "./modules/Language"
import Date 	  from "./modules/DateTime"
import NotifBell  from "./modules/NotificationBell"

import { barFloat, barSplit } from "../../lib/vars"

function leftModules(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <box
		spacing={8}
		halign={Gtk.Align.START} >
			<Launcher/>
			{Workspaces(gdkmonitor)}
			{Taskbar(gdkmonitor)}
	</box>
}

function centerModules(): JSX.Element {
	return <box 
		spacing={8}
		halign={Gtk.Align.CENTER} >
		{/* The Player module should be in the center if the bar is split*/}
		{bind(barSplit).as((value) => value === true
			? <Player/>
			: <box/>)}
	</box>
}

function rightModules(): JSX.Element {
	return <box
		spacing={8}
		halign={Gtk.Align.END} >
		{/* The Player module should be on the right if the bar is not split*/}
		{bind(barSplit).as((value) => value === false
			? <Player/>
			: <box/>)}
		<SysTray/>
		<Mute/>
		<Lang/>
		<Date/>
		<NotifBell/>
	</box>
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <window
		visible
		name={"bar"}
		cssClasses={["bar"]}
		gdkmonitor={gdkmonitor}
		// Dynamically change the margins if bar is floating
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
