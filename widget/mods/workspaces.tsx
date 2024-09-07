import { execAsync, Gtk, Variable, bind } from "astal"
import Hyprland from "gi://AstalHyprland";
const hyprland = Hyprland.get_default();

// function ws(id: number) {
//     const hyprland = Hyprland.get_default();
//     const get = () => hyprland.get_workspace(id) || Hyprland.Workspace.dummy(id, null);
//
//     return Variable(get())
//         .observe(hyprland, "workspace-added", get)
//         .observe(hyprland, "workspace-removed", get);
// }
//
// function className(i: number) { Variable.derive([
// 	bind(hyprland, "focusedWorkspace"),
// ], (focused) => `
// 	${focused.id === i ? "ws-button active" : "ws-button"}
// 	workspacebutton
// `)}
		// className={hyprland.focusedWorkspace.id === i ? "ws-button active" : "ws-button"}


function WorkspaceButton(i: number, monitor: number): JSX.Element { 
	const dispatch = (ws: string | number) => { execAsync(`hyprctl dispatch workspace ${ws}`)};
	const icons = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
	const iconIndex = i - (monitor * 10 + 1);
	return <box>
		<button
		onHover={(self) => self.toggleClassName("hover", true)}
		onHoverLost={(self) => self.toggleClassName("hover", false)}

		// className={className(i)}
		// className={hyprland.focusedWorkspace.id === i ? "ws-button active" : "ws-button"}
		// className={bind(hyprland, "focusedWorkspace").as(n => n.id === i) ? "ws-button active" : "ws-button"}
		// setup={}
		onClick={() => dispatch(i)} >
		<label label={icons[iconIndex]} />
		</button>
		</box>

	//TODO: Active class name

	// return Widget.Button({
	// 	class_name: "ws-button",
	// 	on_primary_click: () => dispatch(i),
	// 	child: Widget.Label({
	// 		label: icons[iconIndex],
	// 		// class_name: "ws-button-label"
	// 	})
	// }).hook(hyprland.active.workspace, button => {
	// 		button.toggleClassName("active", hyprland.active.workspace.id === i);
	// 	});

};


export function Workspaces(monitor: number): JSX.Element { 
	return <box
		spacing={8} >
			{Array.from({ length: 5 }, (_, idx) => {
				const i = idx + (monitor * 10 + 1);
				return WorkspaceButton(i, monitor);
			})}
		</box>



}
// const Workspaces = (monitor: number) => Widget.EventBox({
// 	child: Widget.Box({
// 		spacing: 8,
// 		children: Array.from({ length: vars.wsNum }, (_, idx) => {
// 			const i = idx + (monitor * 10 + 1);
// 			return WorkspaceButton(i, monitor);
// 		})
// 	}).hook(hyprland, box => {
// 		box.children.forEach((button, idx) => {
// 			const workspaceIndex = idx + (monitor * 10 + 1);
// 			const workspace = hyprland.getWorkspace(workspaceIndex);
// 			button.toggleClassName("occupied", (workspace?.windows ?? 0) > 0);
// 		});
// 	})
// });
//
// export default Workspaces;
