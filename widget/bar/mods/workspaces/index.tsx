import { Gdk } from "astal/gtk3"
import { hyprSplit } from "../../../../vars";
import { getDesktop } from "../../../../utils";

export function Workspaces(gdkmonitor: Gdk.Monitor): JSX.Element {
	switch (getDesktop()) {
		case "hyprland":
			return <box className={"ws-box"}
				setup={async (self) => {
					if (hyprSplit.get()) {
						const { Workspaces } = await import("./workspacesSplit");
						self.add(Workspaces(gdkmonitor));
					} else {
						const { Workspaces } = await import("./workspacesVanilla");
						self.add(Workspaces(gdkmonitor));
					}
				}}>
			</box> 
		case "river":
			return <box className={"ws-box"}
				setup={async (self) => {
					const { Workspaces } = await import("./workspacesRiver");
					self.add(Workspaces(gdkmonitor));
				}}>
			</box>
		default:
			return <box/>
	}
}
