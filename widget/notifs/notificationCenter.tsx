import AstalNotifd from "gi://AstalNotifd";

import { Astal, App, Gtk, Gdk, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";

import { hideWindows } from "../../lib";
import NotificationItem from "./notifs";

export default function NotificationList() {
	const Notif = AstalNotifd.get_default();

	const Controls = ({ btn, ...props }: { btn: "trash" | "dnd" } & Widget.ButtonProps) => {
		const Bindings = Variable.derive([bind(Notif, "notifications"), bind(Notif, "dont_disturb")], (items, DND) => ({
			command: {
				trash: () => {
					items.forEach((item) => item.dismiss());
				},
				dnd: () => {
					if (DND) {
						Notif.set_dont_disturb(false);
						console.log("Notification Popups enabled");
					} else {
						Notif.set_dont_disturb(true);
						console.log("Notification Popups disabled");
					}
				},
			}[btn],
			icon: {
				trash: items.length > 0 ? "" : "",
				dnd: DND ? "󰂛" : "󰂚",
			}[btn],
			tooltip: {
				trash: items.length > 0 ? "Dismiss All Notifications" : "No Notifications Available",
				dnd: DND ? "Notification Popups Disabled" : "Notification Popups Enabled",
			}[btn],
		}));

		return <button
			onButtonPressEvent={(_, event) => {
				if (event.get_button()[1] === Gdk.BUTTON_PRIMARY) {
					Bindings.get().command();
				}
			}}
			tooltip_markup={bind(Bindings).as((t) => t.tooltip)}
			{...props}
		>
			<label label={bind(Bindings).as((i) => i.icon)} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} />
		</button>
	};

	function notifList() {
		return <box
			name={"NotificationCenter"} 
			className={"notifCenter"} 
			vertical={true} 
			halign={Gtk.Align.FILL} 
			valign={Gtk.Align.FILL}>
			<box
				className={"notifCenterHeader"}
				halign={Gtk.Align.FILL}>
				<box className={"notifCenterLabel"}>
					<label
						hexpand={true}
						label="Notifications"
						valign={Gtk.Align.CENTER}
						halign={Gtk.Align.START}>
					</label>
				</box>
				<box
					halign={Gtk.Align.START}
					valign={Gtk.Align.CENTER}>
					<Controls btn="trash" className={"notif-btn"}/>
					<Controls btn="dnd" className={"notif-btn"}/>
				</box>
			</box>
			<scrollable
				vscroll={Gtk.PolicyType.AUTOMATIC}
				hscroll={Gtk.PolicyType.NEVER}
				vexpand={true}
				hexpand={true}>
				<box className={"notifCenterContainer"}
					halign={Gtk.Align.FILL}
					valign={Gtk.Align.START}
					spacing={8}
					vexpand={true}
					vertical
					hexpand={false}
					widthRequest={400}
					heightRequest={1}>
					{bind(Notif, "notifications").as((nitems) => {
						if (nitems.length > 0) {
							nitems.sort((a, b) => b.time - a.time);
							return nitems.map((nitem) => (
								NotificationItem(
									{
										notification: nitem,
										onHoverLost: () => { },
										className: "Notification contained",
										setup: () => {}
									}
								)
							))
						} else {
							return <label label={"No Notifications. All caught up!"}/>
						}
					})}
				</box>
			</scrollable>
		</box>
	}

	return <window
		visible={false}
		name={`notification-center`}
		anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM}
		layer={Astal.Layer.OVERLAY}
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.ON_DEMAND}
		margin={-5}
		application={App}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				hideWindows()
			} else if (event.get_keyval()[1] === Gdk.KEY_c) {
				Notif.notifications.forEach(notification => {
					notification.dismiss()
				});
			}
		}}>
		{notifList()}
	</window>
}

