import Hyprland from "gi://AstalHyprland";

import { bind, Variable, Binding } from "astal";
import { Gdk } from "astal/gtk4"

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
	for (const hyprMonitor of hyprland.monitors) {
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ], (clients, _) => {
				return hyprland.get_monitor(monitorID).active_workspace === workspace ? ["module", "workspace", "active"]
                	: clients.length > 0 ? ["module", "workspace", "occupied"]
					: ["module", "workspace"]}
			)
			return <button
				cssClasses={className()}
				onDestroy={() => className.drop()}
				label={icons[iconIndex]}
				cursor={Gdk.Cursor.new_from_name('pointer', null)}
				onButtonPressed={() => dispatch(id)}>
			</button>
		}))
	}

	return <box>
		{Array.from({ length: 5 }, (_, idx) => {
			const id = idx + (monitorID * 10 + 1);
			return workspaceButton(id)
		})}
	</box>
}
