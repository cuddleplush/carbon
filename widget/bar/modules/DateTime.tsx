import { Variable, GLib } from "astal"
import { Bash } from "../../../lib/"
import { Gdk } from 'astal/gtk4'

export default function(): JSX.Element { 
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H:%M")!)

    const date = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%A %d")!)

	return <box spacing={8} cssClasses={["time-box"]}>
		<box>
			<label label={"󱪺"} cssClasses={["icon", "date"]}/>
			<button		
				cssClasses={["module", "clock"]}
				tooltipText={"Open Calendar"}
				cursor={Gdk.Cursor.new_from_name('pointer', null)}
				onButtonPressed={() => Bash("gnome-calendar")} >
				<label label={date()} />
			</button>
		</box>
		<box>
			<label label={"󱑎"} cssClasses={["icon", "clock"]} />
			<button
				cssClasses={["module", "date"]}
				tooltipText={"Open Clocks"}
				cursor={Gdk.Cursor.new_from_name('pointer', null)}
				onButtonPressed={() => Bash("gnome-clocks")} >
				<label label={time()} />
			</button>
		</box>
	</box>
}
