import AstalNotifd from "gi://AstalNotifd";
import Pango from "gi://Pango?version=1.0";

import { GLib } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!);
const isIcon = (name: string | null) => name && iconTheme.has_icon(name);

const fileExists = (path: string | null) => path && GLib.file_test(path, GLib.FileTest.EXISTS);

export interface WidgetEntry {
	widget: Gtk.Widget;
}

interface NotificationLabelProps {
	label: string;
	lines: number;
	useMarkup?: boolean;
	cssClasses?: string[];
}

function NotificationLabel(props: NotificationLabelProps) {
	// Sometimes there's extra whitespace, especially with KDE Connect
	props.label = props.label.trim();
	// Use U+2028 LINE SEPARATOR in order to not introduce paragraph breaks
	props.label = props.label.replaceAll("\n", "\u2028");
	return <label
		{...props}
		wrap={true}
		ellipsize={Pango.EllipsizeMode.END}
		// Setting this to a value that is definitely smaller than the box width
		// causes the label to expand to that size.
		maxWidthChars={5}
		halign={Gtk.Align.FILL}
		xalign={0}
	/>
}

function NotificationImage({
	notification,
	...props
}: Partial<Gtk.Image.ConstructorProps> & { notification: AstalNotifd.Notification }) {
	// const path =
	//     notification.image && notification.image.startsWith("file://")
	//         ? notification.image.slice("file://".length)
	//         : null;

	const path = notification.image

	if (notification.appName == "grimblast") {
		return <image {...props} file={notification.appIcon}/>
	} else if (!path) {
		return <></>;
	} else if (fileExists(path)) {
		return <image {...props} file={path} />;
	} else if (isIcon(notification.image)) {
		return <image {...props} iconName={path} />;
	} else {
		return <></>;
	}
}

const NotificationLayoutProfile = ({ notification }: { notification: AstalNotifd.Notification }) => {
	return <box hexpand={false} cssClasses={["content"]} spacing={4}>
		<NotificationImage notification={notification} cssClasses={["image"]} />
		<box spacing={8} vertical>
			<NotificationLabel label={notification.summary} lines={2} cssClasses={["summary"]} />
			<NotificationLabel label={notification.body} lines={5} cssClasses={["body"]} useMarkup={true} />
		</box>
	</box>
};

export function NotificationItem(
	{ notification, onHoverLeave, cssClasses, setup }: {
		notification: AstalNotifd.Notification;
		onHoverLeave: () => void;
		cssClasses: string[];
		setup: () => void}): WidgetEntry {

	// console.log("got notification! timeout:", notification.expireTimeout);
	const NOTIFICATION_WIDTH = 400;

	/** Invoke an action by its ID, checking if it exists */
	function handleBackgroundClick(event: Gdk.ButtonEvent) {
		const button = event.get_button();
		if (button == Gdk.BUTTON_PRIMARY) {
			const action = notification.get_actions().find((action) => action.id == "default");
			if (action) {
				notification.invoke("default");
			}
		} else if (button == Gdk.BUTTON_SECONDARY) {
			// timer.cancel();
			notification.dismiss();
		}
	}

	let icon: Gtk.Widget | null;
	if (notification.appIcon) {
		if (notification.appName == "grimblast") {
			icon = Gtk.Image.new_from_icon_name("dialog-information-symbolic");
		} else if (fileExists(notification.appIcon)) {
			icon = Gtk.Image.new_from_file(notification.appIcon);
		} else {
			icon = Gtk.Image.new_from_icon_name(notification.appIcon);
		}
	} else if (isIcon(notification.desktopEntry)) {
		icon = Gtk.Image.new_from_icon_name(notification.desktopEntry);
	} else {
		icon = Gtk.Image.new_from_icon_name("dialog-information-symbolic");
	}

	const actionBox = notification.get_actions().length > 0
		&& <box spacing={8} cssClasses={["actions"]}>
			{notification.get_actions().map(({ label, id }) => (
				<button hexpand onClicked={() => notification.invoke(id)}>
					<label label={label} halign={Gtk.Align.CENTER} hexpand />
				</button>
			))}
		</box>

	return {
		widget: <box
			onHoverLeave={onHoverLeave}
			onButtonReleased={(_box, event) => handleBackgroundClick(event)}
			vertical={true}
			hexpand={false}
			vexpand={false}
			widthRequest={NOTIFICATION_WIDTH}
			cssClasses={cssClasses}
			overflow={Gtk.Overflow.HIDDEN}
			setup={setup}>
			<box cssClasses={["header"]} spacing={8}>
				{icon}
				<label label={notification.appName} halign={Gtk.Align.START} hexpand={true} />
				<button
					halign={Gtk.Align.END}
					iconName="window-close-symbolic"
					cssClasses={["close-button"]}
					onClicked={() => {
						notification.dismiss();
					}}
				/>
			</box>
			<NotificationLayoutProfile notification={notification} />
			{actionBox}
		</box>
	};
}
