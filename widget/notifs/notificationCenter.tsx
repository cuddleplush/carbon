import AstalNotifd from "gi://AstalNotifd";

import { Astal, App, Gtk, Gdk, Widget } from "astal/gtk4";
import { bind, Variable } from "astal";

import { hideWindows } from "../../lib";
import { NotificationItem } from "./notificationItem";

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

		return (
			<button
				onButtonPressed={(_, event) => {
					if (event.get_button() === Gdk.BUTTON_PRIMARY) {
						Bindings.get().command();
					}
				}}
				tooltip_markup={bind(Bindings).as((t) => t.tooltip)}
				{...props}
			>
				<label label={bind(Bindings).as((i) => i.icon)} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} />
			</button>
		);
	};

	function notifList() {
		return <box name={"NotificationCenter"} cssClasses={["notifCenter"]} vertical={true} halign={Gtk.Align.FILL} valign={Gtk.Align.FILL} hexpand={false}>
			<centerbox
				cssClasses={["notifCenterHeader"]}
				halign={Gtk.Align.FILL}
				start_widget={
					<box cssClasses={["notifCenterLabel"]} hexpand>
						<label
							label="Notifications"
							valign={Gtk.Align.CENTER}
							halign={Gtk.Align.START}>
						</label>
					</box>
				}
				end_widget={
					<box
						halign={Gtk.Align.START}
						valign={Gtk.Align.CENTER}
						spacing={8}>
						<Controls btn="trash" cssClasses={["notif-btn"]}/>
						<Controls btn="dnd" cssClasses={["notif-btn"]}/>
					</box>
				}>
			</centerbox>
			<Gtk.ScrolledWindow
				vscrollbar-policy={Gtk.PolicyType.AUTOMATIC}
				hscrollbar-policy={Gtk.PolicyType.NEVER}
				vexpand={true}
				hexpand={true}>
				<box cssClasses={["notifCenterContainer"]}
					halign={Gtk.Align.FILL}
					valign={Gtk.Align.START}
					spacing={8}
					vexpand={true}
					vertical
					hexpand={false}
					widthRequest={350}
					heightRequest={1}>
					{bind(Notif, "notifications").as((nitems) => {
						if (nitems) {
							nitems.sort((a, b) => b.time - a.time);
						}
						return nitems.map((nitem) => (
							NotificationItem(
								{
									notification: nitem,
									onHoverLeave: () => { },
									cssClasses: ["Notification", "contained"],
									setup: () => {}
								}
							).widget
						));
					})}
				</box>
			</Gtk.ScrolledWindow>
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
		onKeyPressed={(_, keyval) => {
			if (keyval === Gdk.KEY_Escape) {
				hideWindows()
			}
		}} >
		{notifList()}
	</window>
}

