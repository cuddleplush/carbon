import { Variable, GLib } from "astal"
import { bash } from "../../../lib"

export default function(): JSX.Element { 
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H:%M")!)

    const date = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%A\ %d")!)

	return <box spacing={8} className={"time-box"}>
		<box>
			<label label={"󱪺"} className={"icon date"} />
			<button		
				className={"module clock"}
				tooltipText={"Open Calendar"}
				cursor="pointer"
				onClick={() => bash("gnome-calendar")} >
				<label label={date()} />
			</button>
		</box>
		<box>
			<label label={"󱑎"} className={"icon clock"} />
			<button		
				className={"module date"}
				tooltipText={"Open Clocks"}
				cursor="pointer"
				onClick={() => bash("gnome-clocks")} >
				<label label={time()} />
			</button>
		</box>
	</box>
}
