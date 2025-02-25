import Hyprland from "gi://AstalHyprland";
import Pango from "gi://Pango?version=1.0";

import { bind, Variable } from "astal"
import { Gdk } from "astal/gtk4"
import { VarMap } from "../../../lib/varmap";

const hyprland = Hyprland.get_default()

interface ClientProps {
	client: Hyprland.Client;
	gdkmonitor: Gdk.Monitor;
}

function Task(client: Hyprland.Client, props: ClientProps): JSX.Element {
	const className = Variable.derive([
		bind(hyprland, "focusedWorkspace"),
		bind(hyprland, "focusedClient")
	], (_fw, fc) => {
			return fc === client ? ["module", "focused"]
				: client.workspace.id === client.monitor.activeWorkspace.id ? ["module", "active"]
					: ["module"]}
	)
	return <button
		{...props}
		onButtonPressed={() => {
			client.workspace.focus();
		}}
		visible={bind(client, "monitor").as((m) =>{
			return m.model === props.gdkmonitor.model ? true : false
		})}
		cssClasses={className()}
		onDestroy={() => {
			className.drop()
			print("task destroyed")
		}}
		cursor={Gdk.Cursor.new_from_name('pointer', null)}>
		<label
			maxWidthChars={bind(hyprland, "focusedWorkspace").as(() => {
				return client.workspace.id === client.monitor.activeWorkspace.id ? 20 : 10
			})}
            ellipsize={Pango.EllipsizeMode.END}
			label={bind(client, "class").as((c) => c
				.replace("com.obsproject.Studio", "obs")
				.replace(/.*\..*?\.(.*)/, '$1')
				.toLowerCase())}>
		</label>
	</button>
}

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
    const map = new VarMap([])

	hyprland.clients.forEach((client: Hyprland.Client) => {
		map.set(client, Task(client, { client: client, gdkmonitor: gdkmonitor }))
	})


    const conns = [
        hyprland.connect("client-added", (_, client) => map.set(client.address, Task(client, { client: client, gdkmonitor: gdkmonitor }))),
        hyprland.connect("client-removed", (_, address) => map.delete(address)),
    ]

    return <box onDestroy={() => conns.map(address => hyprland.disconnect(address))}>
        {bind(map).as(arr => arr.map(([,w]) => w))}
    </box>
}
