import Hyprland from "gi://AstalHyprland";
import Pango from "gi://Pango?version=1.0";

import { bind } from "astal"
import { Gdk, hook } from "astal/gtk4"

import { toggleClassName } from "../../../lib/";

const hyprland = Hyprland.get_default()

function Task(client: Hyprland.Client): JSX.Element {
	const connections: number[] = [];
	const active = bind(hyprland, "focusedWorkspace").as(() => {
		return client.workspace.id === client.monitor.activeWorkspace.id;
	});
	const focused = bind(hyprland, "focusedClient").as((fc) => {
		return fc === client;
	});
	const disconnectors: { (): void }[] = [];
	return <button
		onButtonPressed={() => {
			client.workspace.focus();
		}}
		setup={(self) => {
			disconnectors.push(
				bind(active).subscribe((a) => {
					toggleClassName(self, a, "active")
				}),
				bind(focused).subscribe((f) => {
					toggleClassName(self, f, "focused")
				}),
			);
			disconnectors.push(
				bind(hyprland, "focusedClient").subscribe((fc) => {
					toggleClassName(self, client === fc, "focused")
				}),
			);
			toggleClassName(self, active.get(), "active")
			toggleClassName(self, focused.get(), "focused")
		}}
		onDestroy={() => {
			connections.forEach((n) => hyprland.disconnect(n));
			disconnectors.forEach((d) => d());
		}}
		cursor={Gdk.Cursor.new_from_name('pointer', null)}
		cssClasses={["module"]}>
		<label
			maxWidthChars={bind(active).as((v) => (v ? 20 : 10))}
            ellipsize={Pango.EllipsizeMode.END}
			label={bind(client, "class").as((c) => c
				.replace("footclient", "foot")
				.replace("com.obsproject.Studio", "obs")
				.replace(/.*\..*?\.(.*)/, '$1')
				.toLowerCase())}>
		</label>
	</button>
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <box>
		<button
			cssClasses={["module", "empty"]} 
			label={"Desktop"}
			setup={(self) => {
				function empty() {
					self.visible = hyprland.clients.filter((c) => c.monitor.model === gdkmonitor.model).length === 0
						? true : false
				}
				empty()
				hook(self, hyprland, "notify::clients", empty)
				hook(self, hyprland, "client-moved", empty)
			}}>
		</button>
		{bind(hyprland, "workspaces").as((workspaces) => {
			return workspaces
				.sort((a, b) => a.id - b.id)
				.map((workspace) => {
					return <box
						cssClasses={bind(workspace, "clients").as((c) => {
							return c.length > 0 ? ["workspace-tasks"] : ["workspace-tasks", "empty"]
						})}
						visible={bind(workspace, "monitor").as((m) => {
							return m.model === gdkmonitor.model
						})}>
						{bind(workspace, "clients").as((clients) => {
							return clients
								.sort((a, b) => (a.x + a.y) - (b.x + b.y))
								.map(Task)
						})}
					</box>
				})
		})}
	</box>
}
