import { bind } from "astal"
import { App, Astal, Gtk, Gdk } from "astal/gtk3"

import ControlButton	from "./modules/controlButton"
import Workspaces 		from "./modules/workspaces"
import Taskbar    		from "./modules/taskbar"
import Player     		from "./modules/mprisStatus"
import SysTray 	  		from "./modules/tray"
import Mute 	 		from "./modules/muteIndicator"
import Lang 	 		from "./modules/language"
import Date 	 		from "./modules/dateTime"
import NotifBell 		from "./modules/notificationBell"

import { barFloat } from "../../lib/vars"

function leftModules(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <box
		spacing={8}
		halign={Gtk.Align.START} >
			<ControlButton/>
			{Workspaces(gdkmonitor)}
			{Taskbar(gdkmonitor)}
	</box>
}

function centerModules(): JSX.Element {
	return <box 
		spacing={8}
		halign={Gtk.Align.CENTER} >
	</box>
}

function rightModules(): JSX.Element {
	return <box
		spacing={8}
		halign={Gtk.Align.END} >
		<Player/>
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
		className={"bar"}
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
