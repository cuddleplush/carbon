import { Gdk, Gtk, App } from "astal/gtk4";
import { idle, timeout, Variable } from "astal";
import AstalNotifd from "gi://AstalNotifd";
import NotifWidget from "./Notification";
import Astal from "gi://Astal?version=4.0";

const WINDOWNAME = `notifications${App.get_monitors()[0].get_model()}`;

const DEFAULTS = {
	EXPIRE_TIME: 5000,
	WAIT_TIME: 100,
} as const;

function NotifItem() {
	const Notif = AstalNotifd.get_default();
	const expireTime = new Variable(DEFAULTS.EXPIRE_TIME);
	const waitTime = new Variable(DEFAULTS.WAIT_TIME);

	function removeItem(box: Gtk.Box, notificationItem: any) {
		expireTime.drop();
		waitTime.drop();
		notificationItem.unparent();

		const win = App.get_window(WINDOWNAME);
		if (win && !box.get_last_child()) {
			win.visible = false;
		}
	}

	const popupBox = (<box vertical={true} spacing={10} hexpand={false} vexpand valign={Gtk.Align.END} halign={Gtk.Align.END} />) as Gtk.Box;
    // const popupBox = (<box vertical={true} noImplicitDestroy={true}></box>) as Astal.Box;

	Notif.connect("notified", (_, id) => {
		if (Notif.dont_disturb && Notif.get_notification(id).urgency != AstalNotifd.Urgency.CRITICAL) {
			return;
		}

		const notification = Notif.get_notification(id);
		if (!notification) return;

		const notificationItem = (
			<NotifWidget
				n={notification}
				cssClasses={["Notification"]}
				onButtonPressed={(_, event) => {
					switch (event.get_button()) {
						case Gdk.BUTTON_PRIMARY:
							const action = notification.get_actions().find((action) => action.id == "default");
							if (action) {
								notification.invoke("default");
							}
						case Gdk.BUTTON_SECONDARY:
							timeout(DEFAULTS.WAIT_TIME, () => notification.dismiss())
							break;
					}
				}}
				onHoverEnter={() => {
					idle(() => expireTime);
				}}
				onHoverLeave={() => {
					timeout(DEFAULTS.WAIT_TIME, () => removeItem(popupBox, notificationItem));
				}}
			/>
		);

		popupBox.append(notificationItem);

		notification.connect("dismissed", () => {
			if (!notification) return;
			removeItem(popupBox, notificationItem);
		});

		let isHandlingResolved = false;

		notification.connect("resolved", () => {
			if (!notification || isHandlingResolved) return;

			try {
				isHandlingResolved = true;
				notification.dismiss();
			} finally {
				isHandlingResolved = false;
			}
		});

		setTimeout(() => {
			removeItem(popupBox, notificationItem);
		}, expireTime.get());
	});

	return popupBox;
}

export default () => {
	const Notif = AstalNotifd.get_default();

	Notif.connect("notified", () => {
		const win = App.get_window(WINDOWNAME);
		const hasNotifications = Notif.get_notifications().length > 0;
		if (win && hasNotifications) {
			win.set_visible(hasNotifications);
		}
	});

	return (
		<window
			name={WINDOWNAME}
			application={App}
			hexpand={false}
			vexpand
			widthRequest={450}
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
			layer={Astal.Layer.OVERLAY}>
			<NotifItem />
		</window>
	);
};
