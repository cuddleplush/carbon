import { Gdk } from "astal/gtk3"
import { getDesktop } from "../../../../utils";

export function Taskbar(gdkmonitor: Gdk.Monitor): JSX.Element {
	switch (getDesktop()) {
		case "hyprland":
			return <box
				setup={async (self) => {
						const { Taskbar } = await import("./taskbarTest");
						self.add(Taskbar(gdkmonitor));

					}}>
			</box> 
		case "river":
			return <box
				setup={async (self) => {
					const { Taskbar } = await import("./taskbarRiver");
					self.add(Taskbar(gdkmonitor));
				}}>
			</box>
		default:
			return <box/>
	}
}

