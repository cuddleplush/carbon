#!/usr/bin/env -S ags run --gtk4

import Hyprland from "gi://AstalHyprland";
import Pango from "gi://Pango?version=1.0";

import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { bind, Variable } from "astal";

import style from "./carbon-share-picker.scss"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

App.start({
    instanceName: "tmp" + Date.now(),
    css: style,
    main() {
		const hyprland = Hyprland.get_default()

		function picked(pickedElement: Hyprland.Monitor | Hyprland.Client) {
			if (pickedElement instanceof Hyprland.Monitor) {
				const monitor = pickedElement
				print(`[SELECTION]/screen:${monitor.name}`)
			} else {
				const client = pickedElement
				print(`[SELECTION]/window:${client.address}`)
			}
			App.quit();
		}

		function pickable(pickableElement: Hyprland.Monitor | Hyprland.Client) {
			if (pickableElement instanceof Hyprland.Monitor) {
				const monitor = pickableElement
				return <button
					onClicked={() => picked(monitor)}>
					<label
						label={`Screen ${monitor.id} at ${monitor.x}, ${monitor.y} [${monitor.width}x${monitor.height}] [${monitor.name}]`}
						halign={Gtk.Align.START}>
					</label>
				</button>
			} else {
				const client = pickableElement
				return <button
					onClicked={() => picked(client)}>
					<label
						maxWidthChars={35}
						ellipsize={Pango.EllipsizeMode.END}
						label={`${client.title}`}
						halign={Gtk.Align.START}>
					</label>
				</button>
			}
		}

		function onKeyPressed(_: Astal.Window, keyval: number): void {
			if (keyval === Gdk.KEY_Escape) {
				App.quit();
			}
		}

		const page = Variable("monitors");
		const pageHeight = bind(page).as((v) => {
			if (v !== "monitors") {
				return 350;
			} else {
				return 0;
			}
		});

		<window
			visible
			onKeyPressed={onKeyPressed}
			exclusivity={IGNORE}
			keymode={EXCLUSIVE}
			namespace={"carbon-dialog"}
			anchor={TOP | BOTTOM | LEFT | RIGHT}>
			<box halign={CENTER} valign={CENTER} vertical heightRequest={pageHeight}>
				<box vertical={false} homogeneous>
					<button
						label={"Monitors"}
						cssClasses={bind(page).as((p) => p === "monitors" ? ["button", "active"] : ["button"])}
						onClicked={() => page.set("monitors")}>
					</button>
					<button
						label={"Windows"}
						cssClasses={bind(page).as((p) => p === "clients" ? ["button", "active"] : ["button"])}
						onClicked={() => page.set("clients")}>
					</button>
				</box>
				<box cssClasses={["separator"]} heightRequest={1}/>
				<stack
					visibleChildName={bind(page)}
					transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
					transitionDuration={200}>
					<box vertical name={"monitors"}>
						<label label={"Select a screen to share"}/>
						{bind(hyprland, "monitors").as((monitors) => {
							return monitors
								.sort((a, b) => a.id - b.id)
								.map((monitor) => {
									return pickable(monitor)
								});
						})}
					</box>
					<box vertical name={"clients"}>
						<label label={"Select a window to share"}/>
						<Gtk.ScrolledWindow vexpand
							vscrollbar_policy={Gtk.PolicyType.ALWAYS}
							hscrollbar_policy={Gtk.PolicyType.NEVER}>
							<box vertical>
								{bind(hyprland, "clients").as((clients) => {
									return clients
										.map((client) => {
											return pickable(client)
										});
								})}
							</box>
						</Gtk.ScrolledWindow>
					</box>
				</stack>
			</box>
		</window>
	}
})
