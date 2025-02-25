import Hyprland from "gi://AstalHyprland";

import { bind } from "astal"
import { Gdk } from "astal/gtk3"

const hyprland = Hyprland.get_default()

function Task(client: Hyprland.Client): JSX.Element {
	var connections: number[] = [];
	var active = bind(hyprland, "focusedWorkspace").as(() => {
		return client.workspace.id == client.monitor.activeWorkspace.id;
	});
	var focused = bind(hyprland, "focusedClient").as((focused) => {
		return focused == client;
	});
	var disconnectors: { (): any }[] = [];
	return <button
		onClick={() => {
			client.workspace.focus();
		}}
		setup={(self) => {
			disconnectors.push(
				bind(active).subscribe((a) => {
					self.toggleClassName("active", a);
				}),
				bind(focused).subscribe((f) => {
					self.toggleClassName("focused", f);
				}),
			);
			disconnectors.push(
				bind(hyprland, "focused_client").subscribe((focused) => {
					self.toggleClassName("focused", client == focused);
				}),
			);
			self.toggleClassName("active", active.get());
			self.toggleClassName("focused", focused.get());
		}}
		onDestroy={() => {
			connections.forEach((n) => hyprland.disconnect(n));
			disconnectors.forEach((d) => d());
		}}
		className={"module"}>
		<label
			maxWidthChars={bind(active).as((v) => (v ? 20 : 10))}
			label={bind(client, "class").as((c) => c
				.replace("com.obsproject.Studio", "obs")
				.replace(/.*\..*?\.(.*)/, '$1')
				.toLowerCase())}
			truncate={true}>
		</label>
	</button>
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <box>
		<button
			className={"module empty"} 
			label={"Desktop"}
			setup={(self: any) => {
				function empty() {
					self.visible = hyprland.clients.filter((c) => c.monitor.model === gdkmonitor.model).length === 0
						? true : false
				}
				empty()
				self.hook(hyprland, "notify::clients", empty)
				self.hook(hyprland, "client-moved", empty)
			}}>
		</button>
		{bind(hyprland, "workspaces").as((workspaces) => {
			return workspaces
				.sort((a, b) => a.id - b.id)
				.map((workspace) => {
					return <box
						className={bind(workspace, "clients").as((c) => {
							return c.length > 0 ? "workspace-tasks" : "workspace-tasks empty"
						})}
						visible={bind(workspace, "monitor").as((m) => {
							if (m) {
								return m.model === gdkmonitor.model;
							} else false
						})}>
						{bind(workspace, "clients").as((clients) => {
							return clients
								.sort((a, b) => (a.x + a.y) - (b.x + b.y))
								.map(Task);
						})}
					</box>
				});
		})}
	</box>
}
