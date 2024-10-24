import { barFloat, barSplit } from "../../../vars"

function toggleState(self: any, toggleable: any) {
	if (toggleable.get() === false) {
		toggleable.set(true)
		self.toggleClassName("active", true)
	} else {
		toggleable.set(false)
		self.toggleClassName("active", false)
	}
}

function toggleButton(toggleable: any, label: string) {
	return <button
		setup={(self: any) => {
			toggleable.get() === true
				? self.toggleClassName("active", true)
				: self.toggleClassName("active", false)
		}}
		hexpand
		className={"togglebtn"}
		label={label}
		onClicked={(self) => toggleState(self, toggleable)}>
	</button>
}

export function toggles() {
	return <box className={"toggles"} spacing={8}>
		{toggleButton(barFloat, "Float Bar")}
		{toggleButton(barSplit, "Split Bar")}
	</box>
}
