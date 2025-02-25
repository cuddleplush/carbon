/* eslint-disable no-unused-vars */
import AstalNotifd from "gi://AstalNotifd";

import { timeout, Variable } from "astal";
import GObject, { property, register, signal } from "astal/gobject";
import { App, Astal, Gtk } from "astal/gtk3";

import Notification from "./notifs";

@register()
class NotificationTracker extends GObject.Object {
    #widgets: Map<number, Gtk.Widget>;

    @signal(Object)
    declare create: (widget: Gtk.Widget) => void;

    @signal(Object, Object)
    declare replace: (prev: Gtk.Widget, curr: Gtk.Widget) => void;

    @signal(Object)
    declare destroy: (widget: Gtk.Widget) => void;

    constructor() {
        super();
        this.#widgets = new Map();

        const notifd = AstalNotifd.get_default();

        notifd.connect("notified", (_, id) => {
            const notification = notifd.get_notification(id);

            const existingWidget = this.#widgets.get(id);
			const newWidget = Notification({
				notification,
				onHoverLost: () => {
					timeout(100, () => {
						if (this.#widgets.get(id)) {
							this.#widgets.delete(id);
							this.emit("destroy", newWidget);
						}
					});
				},
				setup: () => {
					timeout(5000, () => {
						if (this.#widgets.get(id)) {
							this.#widgets.delete(id);
							this.emit("destroy", newWidget);
						}
					})
				},
				className: "Notification"
			});

			this.#widgets.set(id, newWidget);
			
            if (existingWidget) {
                this.emit("replace", existingWidget, newWidget);
            } else {
                this.emit("create", newWidget);
            }
        });

        notifd.connect("resolved", (_, id) => {
            const widget = this.#widgets.get(id);
            if (widget) {
                this.#widgets.delete(id);
                this.emit("destroy", widget);
            }
        });
    }
}

export default function NotificationPopup() {
    const notifs = new NotificationTracker();

    const windowVisible = Variable(false);
    const box = <box vertical={true}></box> as Astal.Box;

    notifs.connect("create", (_, entry: Gtk.Widget) => {
        if (box.get_children().length === 0) {
            windowVisible.set(true);
        }
		box.add(entry);
    });
    notifs.connect("replace", (_, prev: Gtk.Widget, curr: Gtk.Widget) => {
		box.add(curr);
        box.remove(prev);
    });
    notifs.connect("destroy", (_, entry: Gtk.Widget) => {
        if (box.get_children.length === 0) {
            windowVisible.set(false);
        }
        box.remove(entry);
    });

	windowVisible.subscribe((value: boolean) => {
		print(value)
	})

	return <window
		name="notification-popup-window"
		namespace="notification-popups"
		anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
		layer={Astal.Layer.OVERLAY}
		visible={windowVisible()}
		// This causes the window to be able to shrink back down when the notification is destroyed.
		// But only if it isn't transparent.
		defaultWidth={1}
		defaultHeight={1}
		onDestroy={() => windowVisible.drop()}
		application={App}>
		{box}
	</window>
};

