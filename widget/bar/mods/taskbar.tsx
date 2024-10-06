import { bind, execAsync } from "astal"
import Hyprland from "gi://AstalHyprland";
import { easyAsync } from "../../../utils";
const hyprland = Hyprland.get_default()

const dispatch = (arg: number) => {
	easyAsync(`hyprctl dispatch workspace ${arg}`);
};

function Task(client: any): JSX.Element { 
	return <button
		className={bind(hyprland, "focusedClient").as(fc =>
			`module ${fc == client ? "active" : ""}`,
			
		)}

		tooltipText={client?.title}
		onClick={() => dispatch(client?.workspace.id || 1)} >

		<button
			label={client?.class
				.replace("footclient", "foot")
				.replace("com.obsproject.Studio", "OBS")
				.replace("org.prismlauncher.PrismLauncher", "prism")
				.replace("org.gnome.", "")
				.replace("org.fooyin.fooyin", "fooyin")
				.toLowerCase()
			} >
		</button>
	</button>
}

function updateTasks(self: any, monitor: number) {
	self.children.forEach((ch: any) => ch.destroy())
	self.children = hyprland.get_clients()
		.filter(client => client.monitor === hyprland.get_monitor(monitor))
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

export function Taskbar(monitor: number) { 
	return <box
		spacing={8}
		setup={(self: any) => {
			updateTasks(self, monitor)
			self.hook(hyprland, "event", (self: any, event?: string) => {
				switch (event) {
					case "movewindowv2":
					case "workspacev2":
					case "openwindow":
					case "closewindow":
						updateTasks(self, monitor)
					break;
				}
			})
		}} >
	</box>
}
