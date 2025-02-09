import Notifd from "gi://AstalNotifd"

import { Gdk } from 'astal/gtk4'

import { Bash } from "../../../lib/"
import { bind, Variable } from "astal"

export default function(): JSX.Element { 
	const notifications = Notifd.get_default()
	return <box>
		<button
			setup={(self) => {
				Variable.derive([
					bind(notifications, "notifications"),
					bind(notifications, "dont_disturb")
				], (notifs, dnd) => {
						if (dnd) {
							self.label = "󰂛"
						} else if (notifs.length > 0) {
							self.label = "󱅫"
						} else {
							self.label = "󰂚"
						}
					}
				)
			}}
			cssClasses={["module", "icon-button"]}
			cursor={Gdk.Cursor.new_from_name('pointer', null)}
			tooltipText={bind(notifications, "notifications").as((n) => "Notifications " + "(" + n.length.toString() + ")")}
			onButtonPressed={() => Bash('ags --instance carbon request NotificationCenter')}>
		</button>
	</box>
}

