import Hyprland from "gi://AstalHyprland";

import { bind } from "astal";
import { Gdk } from "astal/gtk3"
import { coordinateEquals } from "../../../../utils";

export function Workspaces(gdkmonitor: Gdk.Monitor): JSX.Element {
    const hypr = Hyprland.get_default()

	let monitorID: number = 0;
	for (let hyprMonitor of hypr.monitors) {
		if (coordinateEquals(hyprMonitor, gdkmonitor.geometry)) {
			monitorID = hyprMonitor.id;
		}
	}

    return <box className="Workspaces" spacing={8}>
        {bind(hypr, "workspaces").as(wss => wss
			.filter(ws => ws.monitor.id == monitorID )
            .sort((a, b) => a.id - b.id)
            .map(ws => (
                <button
                    className={bind(hypr, "focusedWorkspace").as(fw =>
                        ws === fw ? "ws-button active" 
							: ws.clients.length > 0 ? "ws-button occupied"
							: "ws-button")}
                    onClicked={() => ws.focus()}>
                    {ws.id}
                </button>
            ))
        )}
    </box>
}
