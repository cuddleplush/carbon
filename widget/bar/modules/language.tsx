import Hyprland from "gi://AstalHyprland";

export default function(): JSX.Element { 
	const hyprland = Hyprland.get_default();
	return <box className={"lang-box"}>
		<label label={""} className={"icon lang"} />
		<button		
			className={"module lang"}
			tooltipText={"Switch Input Language"}
			// There isn't a way to query the layout at startup TwT
			label={"EU"}
			cursor="pointer"
			setup={(self) => {
				self.hook(hyprland, "keyboard-layout", (label, _, layoutName) => {
					label.label = layoutName.substring(0,2).toUpperCase();
				})
			}} >
		</button>
	</box>
}
