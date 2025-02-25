import { bind, GLib, Variable } from "astal"
import { Gtk, Gdk, Astal } from "astal/gtk3"
import { type EventBox } from "astal/gtk3/widget"
import Notifd from "gi://AstalNotifd"

const isIcon = (icon: string) =>
    !!Astal.Icon.lookup_icon(icon)

const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS)

const getTime = (time: number) => {
    const messageTime = GLib.DateTime.new_from_unix_local(time);
    const now = GLib.DateTime.new_now_local();
    const todayDay = now.get_day_of_year();

	const diff = now.difference(messageTime) / 1e6;
	if (diff < 60) return "Now";
	if (diff < 3600) {
		const d = Math.floor(diff / 60);
		return `${d} min${d === 1 ? "" : "s"} ago`;
	}
	if (diff < 86400) {
		const d = Math.floor(diff / 3600);
		return `${d} hour${d === 1 ? "" : "s"} ago`;
	}
	if (messageTime.get_day_of_year() === todayDay) {
		const aMinuteAgo = GLib.DateTime.new_now_local().add_seconds(-60);
		return aMinuteAgo !== null && messageTime.compare(aMinuteAgo) > 0 ? "Now" : messageTime.format("%H:%M")!;
	}
    if (messageTime.get_day_of_year() === todayDay - 1) return "Yesterday";
    return messageTime.format("%d/%m")!;
};

type Props = {
    setup(self: EventBox): void
    onHoverLost(self: EventBox): void
    notification: Notifd.Notification
	className: string
}

export default function(props: Props) {
    const { notification: n, onHoverLost, setup, className } = props
    const { START, CENTER, END } = Gtk.Align

	function handleBackgroundClick(event: Gdk.Event) {
		const button = event.get_button()[1];
		if (button === Gdk.BUTTON_PRIMARY) {
			const action = n.get_actions().find((a) => a.id === "default");
			if (action) {
				n.invoke("default");
			}
		} else if (button === Gdk.BUTTON_SECONDARY) {
			n.dismiss();
		}
	}

	const time = Variable(getTime(n.time)).poll(60000, () => getTime(n.time));

	function icon(n: Notifd.Notification) {
		if (n.appName === "grimblast") {
			return <label className={"app-icon"} label={"󰋽"}/>
		}
		if (n.appIcon || n.desktopEntry) {
			return <icon className={"app-icon"} icon={n.appIcon || n.desktopEntry}/>
		} else return <label className={"app-icon"} label={"󰋽"}/>
	}

    return <eventbox
        className={className}
        setup={setup}
		onButtonPressEvent={(_, event) => handleBackgroundClick(event)}
        onHoverLost={onHoverLost}>
        <box vertical className={"content"}>
            <box className="header">
				{icon(n)}
                <label
                    className="app-name"
                    halign={START}
                    truncate
                    label={n.appName || "Unknown"}
                />
                <button
                    className="time"
                    hexpand
                    halign={END}
                    label={bind(time)}
					onDestroy={() => time.drop()}
                />
                <button onClicked={() => n.dismiss()}>
                    <label label="󰅖" />
                </button>
            </box>
            <box>
                {n.appName === "grimblast" && <box
                    valign={START}
                    className="image"
                    css={`background-image: url('${n.appIcon}')`}
                />}
                {n.image && fileExists(n.image) && <box
                    valign={START}
                    className="image"
                    css={`background-image: url('${n.image}')`}
                />}
                {n.image && isIcon(n.image) && <box
                    expand={false}
                    valign={START}
                    className="icon-image">
                    <icon icon={n.image} expand halign={CENTER} valign={CENTER} />
                </box>}
                <box vertical>
                    <label
                        className="summary"
                        halign={START}
                        xalign={0}
                        label={n.summary}
                        truncate
                    />
                    {n.body && <label
                        className="body"
                        wrap
                        useMarkup
                        halign={START}
                        xalign={0}
                        justifyFill
                        label={n.body}
                    />}
                </box>
            </box>
            {n.get_actions().length > 0 && <box className="actions">
                {n.get_actions().map(({ label, id }) => (
                    <button
                        hexpand
                        onClicked={() => n.invoke(id)}>
                        <label label={label} halign={CENTER} hexpand />
                    </button>
                ))}
            </box>}
        </box>
    </eventbox>
}
