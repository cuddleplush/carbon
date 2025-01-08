import Hyprland from "gi://AstalHyprland";

import { bind } from "astal"
import { Gdk } from "astal/gtk3"

const hyprland = Hyprland.get_default()

function Task(client: Hyprland.Client): JSX.Element {
	var connections: number[] = [];
	var visible = bind(hyprland, "focusedWorkspace").as(() => {
		return client.workspace.id == client.monitor.activeWorkspace.id;
	});
	var disconnectors: { (): any }[] = [];
	return <button
		onClick={() => {
			client.workspace.focus();
		}}
		setup={(self) => {
			disconnectors.push(
				bind(visible).subscribe((v) => {
					self.toggleClassName("active", v);
				}),
			);
			disconnectors.push(
				bind(hyprland, "focused_client").subscribe((focused) => {
					self.toggleClassName("focused", client == focused);
				}),
			);
			self.toggleClassName("active", visible.get());
			self.toggleClassName("focused", hyprland.focused_client == client && hyprland.focused_workspace == client.workspace);
		}}
		onDestroy={() => {
			connections.forEach((n) => hyprland.disconnect(n));
			disconnectors.forEach((d) => d());
		}}
		className={"module"}>
		<label
			maxWidthChars={bind(visible).as((v) => (v ? 20 : 10))}
			label={bind(client, "class").as((c) => c
				.replace("footclient", "foot")
				.replace("com.obsproject.Studio", "obs")
				.replace(/.*\..*?\.(.*)/, '$1')
				.toLowerCase())}
			truncate={true}>
		</label>
	</button>
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <box className={"taskbar-box"}>
		<button
			className={"module empty"} 
			label={"Desktop"}
			setup={(self: any) => {
				function empty() {
					self.visible = hyprland.clients.filter((c) => c.monitor.model === gdkmonitor.model).length === 0
						? true : false
				}
				self.visible = empty()
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
							return c.length > 0 ? "ws-tasks" : "ws-tasks empty"
						})}
						visible={bind(workspace, "monitor").as((m) => {
							return m.model === gdkmonitor.model;
						})}>
						{bind(workspace, "clients").as((clients) => {
							return clients.map(Task);
						})}
					</box>
				});
		})}
	</box>
}
