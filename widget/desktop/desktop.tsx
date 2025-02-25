import { Astal, Gtk, Gdk, App } from "astal/gtk3"

import { Menu, MenuItem } from "../../lib/shared"

import { bash } from "../../lib"

function item(label: string, app: string): JSX.Element {
	return <MenuItem className={"menu-item"} label={label} 
		onButtonPressEvent={(_, event) => {
			if (event.get_button()[1] === Gdk.BUTTON_PRIMARY) {
				bash(app)	
			}
		}}
	/>
}

function desktopMenu(): JSX.Element { 
	return <Menu className={"desktop-menu"} >
		{item("Audio", "pavucontrol")}
		{item("Music", "/opt/Cider/cider --ozone-platform-hint=wayland")}
		{item("Files", "nemo")}
		{item("Browser", "firefox")}
		{item("Screenshot", "grimblast --notify copysave area")}
		<MenuItem submenu={
			<Menu>
				{item("Steam", "steam")}
				{item("Prism", "prismlauncher")}
				{item("Genshin", "anime-game-launcher")}
			</Menu>}>
			<box>
				<label label={"Games"} hexpand halign={Gtk.Align.START}/>
				<label label={"  "}/>
			</box>
		</MenuItem>
		<MenuItem submenu={
			<Menu>
				{item("Vesktop", "vesktop --enable-features=UseOzonePlatform --ozone-platform=wayland")}
				{item("Telegram", "telegram-desktop")}
			</Menu>}>
			<box>
				<label label={"Messaging"} hexpand halign={Gtk.Align.START}/>
				<label label={"  "}/>
			</box>
		</MenuItem>
		<MenuItem submenu={
			<Menu>
				{item("Log Out", "hyprctl dispatch exit")}
				{item("Shutdown", "fctl poweroff")}
				{item("Reboot", "fctl reboot")}
			</Menu>}>
			<box>
				<label label={"Power"} hexpand halign={Gtk.Align.START}/>
				<label label={"  "}/>
			</box>
		</MenuItem>
	</Menu>
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <window
		name={`desktop`}
		anchor={Astal.WindowAnchor.TOP
		| Astal.WindowAnchor.BOTTOM
		| Astal.WindowAnchor.LEFT
		| Astal.WindowAnchor.RIGHT}
		exclusivity={Astal.Exclusivity.IGNORE}
		keymode={Astal.Keymode.NONE}
		layer={Astal.Layer.BOTTOM}
		gdkmonitor={gdkmonitor}
		application={App} >
		<eventbox
			className={"desktop"}
			onButtonPressEvent={(_, event) => {
				if (event.get_button()[1] === Gdk.BUTTON_SECONDARY) {
					(desktopMenu() as Menu).popup_at_pointer(event)
				}
			}}>
		</eventbox>
	</window>
}

