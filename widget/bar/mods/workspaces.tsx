import Hyprland from "gi://AstalHyprland";

import { bind, Variable, Binding } from "astal";
import { Gdk } from "astal/gtk3"

function dispatch(arg: number): void {
    const hyprland = Hyprland.get_default();
	hyprland.message(`dispatch workspace ${arg}`)
};

function ws(id: number): Variable<Hyprland.Workspace> {
    const hyprland = Hyprland.get_default();
    const get = () => hyprland.get_workspace(id) || Hyprland.Workspace.dummy(id, null);

    return Variable(get())
        .observe(hyprland, "workspace-added", get)
        .observe(hyprland, "workspace-removed", get);
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
    const hyprland = Hyprland.get_default()

	let monitorID: number = 0;
	for (let hyprMonitor of hyprland.monitors) {
		if (hyprMonitor.model === gdkmonitor.model) {
			monitorID = hyprMonitor.id;
		}
	}

    function workspaceButton(id: number): Binding<JSX.Element> {
        return (bind(ws(id)).as(workspace => {
			const icons = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
			const iconIndex = id % 10 - 1;

            const className = Variable.derive([
                bind(workspace, "clients"),
				bind(hyprland, "focusedWorkspace")
            ], (clients, _) => {
				return hyprland.get_monitor(monitorID).active_workspace === workspace ? "ws-button active"
                	: clients.length > 0 ? "ws-button occupied"
					: "ws-button"}
			)
			return <button
				className={className()}
				label={icons[iconIndex]}
				cursor="pointer"
				onClick={() => dispatch(id)}>
			</button>
		}))
	}

	return <box spacing={8}>
		{Array.from({ length: 5 }, (_, idx) => {
			const id = idx + (monitorID * 10 + 1);
			return workspaceButton(id)
		})}
	</box>
}
