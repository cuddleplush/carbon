import {  bind } from "astal"
import { App, Astal, Gtk } from "astal/gtk3"
import { Date } from "./mods/timedate"
import { Launcher } from "./mods/launcher"
import { Workspaces } from "./mods/workspaces"
import { Lang } from "./mods/language"
import { Mute } from "./mods/mute"
import { SysTray } from "./mods/tray"
import { Taskbar } from "./mods/taskbar"
import { Player } from "./mods/mpris"

import vars, { barFloat } from "../../vars"

function Start(monitor: number) {
	return <box
		spacing={8}
		halign={Gtk.Align.START} >
		<box className={"modules-1"} spacing={8}>
			{Launcher(monitor)}
			{Workspaces(monitor)}
		</box>
		<box className={"modules-2"} spacing={0}>
			{Taskbar(monitor)}
		</box>
		{vars.playerPos === "start"
			? <box className={"modules-3"}>
				<Player />
			</box> : <box />}
	</box>
}

function Center() {
	return <box 
		spacing={8}
		halign={Gtk.Align.CENTER} >
		{vars.playerPos === "center"
			? <box className={"modules-3"}>
				<Player />
			</box> : <box />}
	</box>
}

function End() {
	return <box
		spacing={8}
		halign={Gtk.Align.END} >
		{vars.playerPos === "end"
			? <box className={"modules-3"}>
				<Player />
			</box> : <box />}
		<box className={"modules-4"}>
			<SysTray />
		</box>
			<Mute />
		<box className={"modules-5"} spacing={8}>
			<Lang />
			<Date />
		</box>
	</box>
}

export default function Bar(monitor: number) {
	return <window
		className="Bar"
		monitor={monitor}
		margin={bind(barFloat).as((value) => value === true ? 8 : 0)}
		margin_bottom={bind(barFloat).as((value) => value === true ? 0 : 0)}
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
