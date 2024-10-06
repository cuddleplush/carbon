import { bind, execAsync, Variable } from "astal";
import Hyprland from "gi://AstalHyprland";
import { easyAsync } from "../../../utils";

const dispatch = (arg: string | number) => {
    easyAsync(`hyprctl dispatch workspace ${arg}`);
};

function ws(id: number) {
    const hyprland = Hyprland.get_default();
    const get = () => hyprland.get_workspace(id) || Hyprland.Workspace.dummy(id, null);

    return Variable(get())
        .observe(hyprland, "workspace-added", get)
        .observe(hyprland, "workspace-removed", get);
}

export function Workspaces(monitor: number) {

    const hyprland = Hyprland.get_default()

    function workspaceButton(id: number, monitor: number) {
        return (bind(ws(id)).as(ws => {
			const icons = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
			const iconIndex = id - (monitor * 10 + 1);

            const className = Variable.derive([
                bind(hyprland, "focusedWorkspace"),
                bind(ws, "clients"),
            ], (focused, clients) => 
				`${focused === ws ? "ws-button active" : ""}
                ${clients.length > 0 ? "ws-button occupied" : "ws-button"}`)
            return (
                <button
					// onHover={(self) => self.toggleClassName("hover", true)}
					// onHoverLost={(self) => self.toggleClassName("hover", false)}

                    className={className()}
					label={icons[iconIndex]}
					onClick={() => dispatch(id)}>
                </button >
            )
        }))
    }

	const workspaceButtons = (Array.from({ length: 5 }, (_, idx) => {
				const id = idx + (monitor * 10 + 1);
				return workspaceButton(id, monitor)}))

    return (<box spacing={8} >
        {workspaceButtons}
    </box>
    )
}
