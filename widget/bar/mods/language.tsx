import { execAsync } from "astal"
import Hyprland from "gi://AstalHyprland";
import { easyAsync } from "../../../utils";

const hyprland = Hyprland.get_default();

export function Lang(): JSX.Element { 
	return <box>
		<label label={""} className={"icon lang"} />
		<button		
			onHover={(self) => self.toggleClassName("hover", true)}
			onHoverLost={(self) => self.toggleClassName("hover", false)}

			className={"module Lang"}
			tooltipText={"Switch Input Language"}
			onClick={() => easyAsync("gnome-calendar")} 
			label={"EN"}
			setup={(self) => {
				self.hook(hyprland, "keyboard-layout", (label: any, _kbName: any, layoutName) => {
                    label.label = layoutName.includes("Russian") ? "RU" : "EN"
				})
			}} >
		</button>
		</box>
}
