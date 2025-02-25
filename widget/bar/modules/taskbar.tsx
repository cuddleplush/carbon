import Hyprland from "gi://AstalHyprland";
import Pango from "gi://Pango?version=1.0";

import { bind, Variable } from "astal"
import { Gdk, hook } from "astal/gtk4"

const hyprland = Hyprland.get_default()

function Task(client: Hyprland.Client): JSX.Element {
	const className = Variable.derive([
		bind(hyprland, "focusedWorkspace"),
		bind(hyprland, "focusedClient")
	], (_fw, fc) => {
			return fc === client ? ["module", "focused"]
				: client.workspace.id === client.monitor.activeWorkspace.id ? ["module", "active"]
					: ["module"]}
	)
	return <button
		onButtonPressed={() => {
			client.workspace.focus();
		}}
		cssClasses={className()}
		onDestroy={() => {
			className.drop()
			print("task destroyed")
		}}
		cursor={Gdk.Cursor.new_from_name('pointer', null)}>
		<label
			maxWidthChars={bind(hyprland, "focusedWorkspace").as(() => {
				return client.workspace.id === client.monitor.activeWorkspace.id ? 20 : 10
			})}
            ellipsize={Pango.EllipsizeMode.END}
			label={bind(client, "class").as((c) => c
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
							if (m) {
								return m.model === gdkmonitor.model
							} else { return false }
						})}>
						{bind(workspace, "clients").as((clients) => {
							if (clients.length > 0) {
								return clients
									.sort((a, b) => (a.x + a.y) - (b.x + b.y))
									.map(Task)
							} else {
								return <></>
							}
						})}
					</box>
				})
		})}
	</box>
}
