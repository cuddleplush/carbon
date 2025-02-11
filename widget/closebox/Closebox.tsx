import { App, Gdk, Astal } from "astal/gtk4"

import { debug } from "../../lib/vars"
import { hideWindows, toggleClassName } from "../../lib/"
import { bind } from "astal"

function closeBox(): JSX.Element {
	return <box
		visible={true}
		cssClasses={["closebox"]}
		onButtonPressed={(_, buttonval) => {
			if (buttonval.get_button() === Gdk.BUTTON_PRIMARY) {
				hideWindows()
				print("hide")
			}
		}}
		setup={((self) => {
			bind(debug).as((value) => {
				toggleClassName(self, value, "debug")
			})
		})}
		vexpand>

		{/* THE SILLY (DO NOT REMOVE)*/}
		<box cssClasses={["the-silly"]}/>
	</box>
}

export default function(): JSX.Element {
	return <window
		visible={false}
		name={`closebox`}
		namespace={"carbon-debug-closebox"}
		anchor={Astal.WindowAnchor.TOP
			| Astal.WindowAnchor.BOTTOM
			| Astal.WindowAnchor.LEFT
			| Astal.WindowAnchor.RIGHT}
		exclusivity={Astal.Exclusivity.IGNORE}
		keymode={Astal.Keymode.NONE}
		margin_top={45}
		layer={Astal.Layer.TOP}
		application={App}
		onKeyPressed={(_, keyval) => {
			if (keyval === Gdk.KEY_Escape) {
				hideWindows()
			}
		}} >
		{closeBox()}
	</window>
}
