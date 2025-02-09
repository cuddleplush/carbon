import Hyprland from "gi://AstalHyprland";
import { hook } from "astal/gtk4";
import { Gdk } from 'astal/gtk4'

export default function(): JSX.Element { 
	const hyprland = Hyprland.get_default();
	return <box cssClasses={["lang-box"]}>
		<label label={""} cssClasses={["icon", "lang"]} />
		<button		
			cssClasses={["module", "lang"]}
			tooltipText={"Switch Input Language"}
			// There isn't a way to query the layout at startup TwT
			cursor={Gdk.Cursor.new_from_name('pointer', null)}
			label={"EU"}
			setup={(self) => {
				hook(self, hyprland, "keyboard-layout", (label, _, layoutName) => {
					label.label = layoutName.substring(0,2).toUpperCase();
				})
			}} >
		</button>
	</box>
}
