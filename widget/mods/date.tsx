import { Variable, Gtk, execAsync } from "astal"

export function Date(): JSX.Element { 
	const time = Variable<string>("").poll(1000, "date +%A\\ %d,\\ %H:%M")
	return <box>
		<label label={"󱪺"} className={"icon date"} />
		<button		
			onHover={(self) => self.toggleClassName("hover", true)}
			onHoverLost={(self) => self.toggleClassName("hover", false)}
			
			className={"module date"}
			tooltipText={"Open Calendar"}
			onClick={() => execAsync("gnome-calendar")} >
			<label label={time()} />
		</button>
		</box>
}
