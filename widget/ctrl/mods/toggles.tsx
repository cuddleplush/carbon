import { Variable, bind } from "astal"
import { Gtk } from "astal/gtk3"
import { dummyVar, barFloat, barSplit, nightLight } from "../../../lib/vars"

function toggleButton(toggleable: Variable<boolean>, label: string): JSX.Element {
	return <button
		setup={(self: any) => {
			self.toggleClassName("active", toggleable.get())
		}}
		hexpand={true}
		className={bind(toggleable).as((value) => 
			value === true ? "togglebtn active" : "togglebtn")}
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
	return <box className={"toggles"} spacing={8} vertical>
		<box spacing={8}>
			{toggleButton(barFloat, "Floating Bar")}
			{toggleButton(barSplit, "Split Bar")}
		</box>
		<box spacing={8}>
			{toggleButton(dummyVar, "Goblin Mode")}
			{toggleButton(nightLight, "Night Light")}
		</box>
	</box>
}
