import { Variable, bind } from "astal"
import { Gtk } from "astal/gtk4"

import { debug, barFloat, barSplit, nightLight } from "../../../lib/vars"

function toggleButton(toggleable: Variable<boolean>, label: string): JSX.Element {
	return <button
		setup={(self) => {
			if (toggleable.get() === true) {
				self.add_css_class("active")
			} else {
				self.remove_css_class("active")
			}
		}}
		hexpand={true}
		cssClasses={bind(toggleable).as((value) => 
			value === true ? ["togglebtn", "active"] : ["togglebtn"])}
		onClicked={() => toggleable.set(!toggleable.get())}>
		<box vertical valign={Gtk.Align.CENTER}>
			<label label={label} halign={Gtk.Align.START}/>
			<label
				label={bind(toggleable).as((value) => 
					value === true ? "Enabled" : "Disabled")}
				halign={Gtk.Align.START}/>
		</box>
	</button>
}

export function toggles(): JSX.Element {
	return <box cssClasses={["toggles"]} spacing={8} vertical>
		<box spacing={8}>
			{toggleButton(barFloat, "Floating Bar")}
			{toggleButton(barSplit, "Split Bar")}
		</box>
		<box spacing={8}>
			{toggleButton(debug, "Debug Mode")}
			{toggleButton(nightLight, "Night Light")}
		</box>
	</box>
}
