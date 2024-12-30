import Hyprland from "gi://AstalHyprland";

export function Lang(): JSX.Element { 
	const hyprland = Hyprland.get_default();
	return <box className={"lang-box"}>
		<label label={""} className={"icon lang"} />
		<button		
			className={"module Lang"}
			tooltipText={"Switch Input Language"}
			label={"EN"}
			cursor="pointer"
			setup={(self) => {
				self.hook(hyprland, "keyboard-layout", (label, _kbName, layoutName) => {
					label.label = layoutName.includes("Russian") ? "RU" 
						: layoutName.includes("Eu") ? "EN"
						: layoutName.includes("Czech") ? "CZ"
						: 'NULL'
				})
			}} >
		</button>
	</box>
}
