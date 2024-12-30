import Hyprland from "gi://AstalHyprland";

import { bind } from "astal"
import { Gdk } from "astal/gtk3"
import { coordinateEquals } from "../../../../utils";

const dispatch = (arg: number): void => {
	const hyprland = Hyprland.get_default()
	hyprland.message(`dispatch workspace ${arg}`)
};

function Task(client: Hyprland.Client): JSX.Element { 
	const hyprland = Hyprland.get_default()
	return <button
		className={bind(hyprland, "focusedClient").as(fc =>
			`module ${fc == client ? "active" : ""}`,
			
		)}
		tooltipText={client?.title}
		cursor="pointer"
		onClick={() => dispatch(client?.workspace.id || 1)}
		label={client?.class
			.replace("footclient", "foot")
			.replace("com.obsproject.Studio", "obs")
			.replace(/.*\..*?\.(.*)/, '$1')
			.toLowerCase()
		} >
	</button>
}

export function Taskbar(gdkmonitor: Gdk.Monitor): JSX.Element { 
	const hyprland = Hyprland.get_default()

	var monitorID: number = 0;
	for (var hyprMonitor of hyprland.monitors) {
		if (coordinateEquals(hyprMonitor, gdkmonitor.geometry)) {
			monitorID = hyprMonitor.id;
		}
	}

	function updateTasks(self: any, monitorID: number): void {
		self.children.forEach((ch: any) => ch.destroy())
		self.children = hyprland.get_clients()
			.filter(client => client.monitor === hyprland.get_monitor(monitorID))
			.filter(client => client.class != "")
			.sort(function(a, b) {
				const aclient = hyprland.get_client(a.address)!
				const bclient = hyprland.get_client(b.address)!
				return aclient.workspace.id - bclient.workspace.id })
			.map(client => Task(client))
		if (self.children.length === 0) {
			self.child = <button className={"module empty"} label={"Desktop"} />
		}
	}

	return <box
		className={"taskbar-box"}
		spacing={8}
		setup={(self: any) => {
			updateTasks(self, monitorID)
			self.hook(hyprland, "event", (self: any, event?: string) => {
				switch (event) {
					case "movewindowv2":
					case "openwindow":
					case "closewindow":
						updateTasks(self, monitorID)
						break;
				}
			})
		}} >
	</box>
}
