import { Gdk, Gtk, Widget } from "astal/gtk4";
import { GLib } from "astal";
import Pango from "gi://Pango";
import AstalNotifd from "gi://AstalNotifd";

export default function NotifWidget({ n, ...boxprops }: { n: AstalNotifd.Notification } & Widget.BoxProps) {

	const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

	const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!);
	const isIcon = (name: string | null) => name && iconTheme.has_icon(name);

	let icon: Gtk.Widget | null;
	if (n.appIcon) {
		if (n.appName == "grimblast") {
			icon = Gtk.Image.new_from_icon_name("dialog-information-symbolic");
		} else if (fileExists(n.appIcon)) {
			icon = Gtk.Image.new_from_file(n.appIcon);
		} else {
			icon = Gtk.Image.new_from_icon_name(n.appIcon);
		}
	} else if (isIcon(n.desktopEntry)) {
		icon = Gtk.Image.new_from_icon_name(n.desktopEntry);
	} else {
		icon = Gtk.Image.new_from_icon_name("dialog-information-symbolic");
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
		return (
			<label
				{...props}
				wrap={true}
				ellipsize={Pango.EllipsizeMode.END}
				// Setting this to a value that is definitely smaller than the box width
				// causes the label to expand to that size.
				maxWidthChars={5}
				halign={Gtk.Align.FILL}
				xalign={0}
			/>
		);
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
		return (
			<box hexpand={false} cssClasses={["content"]} spacing={4}>
				<NotificationImage notification={notification} cssClasses={["image"]} />
				<box spacing={8} vertical>
					<NotificationLabel label={notification.summary} lines={2} cssClasses={["summary"]} />
					<NotificationLabel label={notification.body} lines={5} cssClasses={["body"]} useMarkup={true} />
				</box>
			</box>
		);
	};

	const actionBox =
		n.get_actions().length > 0 && (
			<box spacing={8} cssClasses={["actions"]}>
				{n.get_actions().map(({ label, id }) => (
					<button hexpand onClicked={() => { 
						n.invoke(id)
						n.dismiss()
					}}>
						<label label={label} halign={Gtk.Align.CENTER} hexpand />
					</button>
				))}
			</box>
		);

	return (
		<box {...boxprops}
			vertical={true}
			hexpand={false}
			vexpand={false}
			widthRequest={400}
			overflow={Gtk.Overflow.HIDDEN}>
			<box cssClasses={["header"]} spacing={8}>
				{icon}
				<label label={n.appName} halign={Gtk.Align.START} hexpand={true} />
				<button
					halign={Gtk.Align.END}
					iconName="window-close-symbolic"
					cssClasses={["close-button"]}
					onClicked={() => {
						n.dismiss();
					}}
				/>
			</box>
			<NotificationLayoutProfile notification={n} />
			{actionBox}
		</box>
	);
}
