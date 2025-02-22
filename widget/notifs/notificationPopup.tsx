/* eslint-disable no-unused-vars */
import AstalNotifd from "gi://AstalNotifd";

import { timeout, Variable } from "astal";
import GObject, { register, signal } from "astal/gobject";
import { App, Astal } from "astal/gtk4";

import { WidgetEntry } from "./notificationItem";
import { NotificationItem } from "./notificationItem";

@register()
class NotificationTracker extends GObject.Object {
    #widgets: Map<number, WidgetEntry>;

    @signal(Object)
    declare create: (widget: WidgetEntry) => void;

    @signal(Object, Object)
    declare replace: (prev: WidgetEntry, curr: WidgetEntry) => void;

    @signal(Object)
    declare destroy: (widget: WidgetEntry) => void;

    constructor() {
        super();
        this.#widgets = new Map();

        const notifd = AstalNotifd.get_default();

        notifd.connect("notified", (_, id) => {
            const notification = notifd.get_notification(id);

            const existingWidget = this.#widgets.get(id);
			const newWidget = NotificationItem({
				notification,
				onHoverLeave: () => {
					timeout(100, () => {
						if (this.#widgets.get(id)) {
							this.#widgets.delete(id);
							this.emit("destroy", newWidget);
						}
					});
				},
				cssClasses: ["Notification"],
				setup: () => {
					timeout(5000, () => {
						if (this.#widgets.get(id)) {
							this.#widgets.delete(id);
							this.emit("destroy", newWidget);
						}
					})
				}
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

    notifs.connect("create", (_, entry: WidgetEntry) => {
        if (box.get_children().length === 0) {
            windowVisible.set(true);
        }
        box.prepend(entry.widget);
    });
    notifs.connect("replace", (_, prev: WidgetEntry, curr: WidgetEntry) => {
        box.insert_child_after(curr.widget, prev.widget);
        box.remove(prev.widget);
    });
    notifs.connect("destroy", (_, entry: WidgetEntry) => {
        box.remove(entry.widget);
        if (box.get_first_child() === null) {
            windowVisible.set(false);
        }
    });

	return <window
		name="notification-popup-window"
		namespace="notification-popups"
		anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
		layer={Astal.Layer.OVERLAY}
		setup={(self) => App.add_window(self)}
		visible={windowVisible()}
		// This causes the window to be able to shrink back down when the notification is destroyed.
		// But only if it isn't transparent.
		defaultWidth={1}
		defaultHeight={1}
		onDestroy={() => windowVisible.drop()}>
		{box}
	</window>
};

