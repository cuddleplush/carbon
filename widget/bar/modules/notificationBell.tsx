import Notifd from "gi://AstalNotifd"

import { bind, Variable } from "astal"

import { bash } from "../../../lib/"

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
			className={"module icon-button"}
			cursor="pointer"
			tooltipText={bind(notifications, "notifications").as((n) => "Notifications " + "(" + n.length.toString() + ")")}
			onButtonPressEvent={() => bash('ags --instance carbon request NotificationCenter')}>
		</button>
	</box>
}

