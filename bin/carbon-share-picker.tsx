#!/usr/bin/env -S ags run

import Hyprland from "gi://AstalHyprland";

import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { bind, exec, Variable } from "astal";
import GLib from "gi://GLib";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

App.start({
    instanceName: "tmp" + Date.now(),
    css: /* css */`
		* {
all: unset;
			border-radius: 0px;	
		}
        window {
            background-color: alpha(black, 0.3);
        }

        window > box {
            margin: 8px;
            padding: 8px;
            box-shadow: 0 0 5px 5px alpha(black, 0.3);
            border-radius: 0px;
            background-color: #0F0F0F;
            color: white;
            min-width: 200px;
        }

        label {
            font-size: 15px;
			color: #cdcdcd;
        }

        .action {
            font-size: large;
        }

        button {
			padding: 8px;
			transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
			margin: 8px;
			background-color: #1b1b1b;
			font-size: 15px;
        }

		button.active {
			background-color: #2f2f2f;
		}

		button:hover {
			background-color: #525252;
		}
		
		scrollable {
			all: unset;
			border: 0px;
		}
separator {
  margin: 0 8px;
  background-color: #525252;
}

`,
    main: () => {
		print(exec("bash -c 'echo $XDPH_WINDOW_SHARING_LIST > /home/max/env'"))
		
		interface Toplevel {
			id: number;
			class: string;
			title: string;
		}

		function parse(toplevelList: string): Toplevel[] {
			const regex = /\[HC>\]|\[HT>\]/;
			const toplevels: Toplevel[] = [];

			const parts = toplevelList.split('[HE>]');
			for (const part of parts) {
				const split = part.split(regex).filter(Boolean);
				if (split.length !== 3) {
					continue;
				}

				const id = parseInt(split[0], 10);
				if (isNaN(id)) {
					continue;
				}

				const classPart = split[1];
				const title = split[2];

				toplevels.push({ id, class: classPart, title });
			}

			return toplevels;
		}
	
		const toplevels = parse(GLib.getenv("XDPH_WINDOW_SHARING_LIST")!)

		const hyprland = Hyprland.get_default()

		function picked(pickedElement: Hyprland.Monitor | Hyprland.Client) {
			if (pickedElement instanceof Hyprland.Monitor) {
				let monitor = pickedElement
				print(`[SELECTION]/screen:${monitor.name}`)
			} else {
				let client = pickedElement
				let toplevel = toplevels.find((t) => t.class == client.class && t.title == client.title)
				print(`[SELECTION]/window:${toplevel!.id}`)
			}
			App.quit();
		}

		function pickable(pickableElement: Hyprland.Monitor | Hyprland.Client) {
			if (pickableElement instanceof Hyprland.Monitor) {
				let monitor = pickableElement
				return <button
					onClicked={() => picked(monitor)}>
					<label
						label={`Screen ${monitor.id} at ${monitor.x}, ${monitor.y} [${monitor.width}x${monitor.height}] [${monitor.name}]`}
						halign={Gtk.Align.START}>
					</label>
				</button>
			} else {
				let client = pickableElement
				return <button
					onClicked={() => picked(client)}>
					<label
						maxWidthChars={35}
						truncate
						label={`${client.title}`}
						halign={Gtk.Align.START}>
					</label>
				</button>
			}
		}

        function onKeyPress(_: Astal.Window, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape) {
                App.quit();
            }
        }

		const page = Variable("monitors");
		const pageHeight = bind(page).as((v) => {
			if (v != "monitors") {
				return `min-height: 350px;`;
			} else {
				return `min-height: 0px;`;
			}
		});

		<window
			onKeyPressEvent={onKeyPress}
			exclusivity={IGNORE}
			keymode={EXCLUSIVE}
			namespace={"carbon-dialog"}
			anchor={TOP | BOTTOM | LEFT | RIGHT}>
			<box halign={CENTER} valign={CENTER} vertical css={pageHeight}>
				<box vertical={false} homogeneous css={"margin-bottom: 8px;"}>
					<button
						label={"Monitors"}
						className={bind(page).as((p) => p === "monitors" ? "button active" : "button")}
						onClicked={() => page.set("monitors")}>
					</button>
					<button
						label={"Windows"}
						className={bind(page).as((p) => p === "clients" ? "button active" : "button")}
						onClicked={() => page.set("clients")}>
					</button>
				</box>
				<Gtk.Separator visible />
				<stack
					shown={bind(page)}
					transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
					transitionDuration={200}>
					<box vertical name={"monitors"}>
						<label label={"Select a screen to share"} css={"margin: 16px 0 8px 0"}/>
						{bind(hyprland, "monitors").as((monitors) => {
							return monitors
								.sort((a, b) => a.id - b.id)
								.map((monitor) => {
									return pickable(monitor)
								});
						})}
					</box>
					<box vertical name={"clients"}>
						<label label={"Select a window to share"} css={"margin: 16px 0 8px 0"}/>
						<scrollable vexpand
							vscroll={Gtk.PolicyType.ALWAYS}
							hscroll={Gtk.PolicyType.NEVER}>
							<box vertical>
								{bind(hyprland, "clients").as((clients) => {
									return clients
										.map((client) => {
											return pickable(client)
										});
								})}
							</box>
						</scrollable>
					</box>
				</stack>
			</box>
		</window>
	}
})
