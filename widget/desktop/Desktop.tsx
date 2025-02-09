import { Astal, Gdk, App } from "astal/gtk4"
import Gio from "gi://Gio?version=2.0"
import { exec } from "astal";

const powermenu = new Gio.Menu();
powermenu.append("Suspend", "powermenu.suspend");
powermenu.append("Shutdown", "powermenu.shutdown");
powermenu.append("Reboot", "powermenu.reboot");

const suspendAction = new Gio.SimpleAction({ name: "suspend" });
suspendAction.connect("activate", () => exec("systemctl sleep"));
const shutdownAction = new Gio.SimpleAction({ name: "shutdown" });
shutdownAction.connect("activate", () => exec("systemctl poweroff"));
const rebootAction = new Gio.SimpleAction({ name: "reboot" });
rebootAction.connect("activate", () => exec("systemctl reboot"));

const powermenuGroup = new Gio.SimpleActionGroup();
powermenuGroup.add_action(suspendAction);
powermenuGroup.add_action(shutdownAction);
powermenuGroup.add_action(rebootAction);

const PowerButton = () => (
    <menubutton
        name="power-button"
		cssClasses={["desktop"]}
        menuModel={powermenu}
        setup={(self) => self.insert_action_group("powermenu", powermenuGroup)}
    >
        <image iconName="system-shutdown-symbolic" />
    </menubutton>
);

export default function(gdkmonitor: Gdk.Monitor): JSX.Element {
	return <window
		visible
		name={`desktop`}
		widthRequest={200}
		heightRequest={200}
		// anchor={Astal.WindowAnchor.TOP
		// | Astal.WindowAnchor.BOTTOM
		// | Astal.WindowAnchor.LEFT
		// | Astal.WindowAnchor.RIGHT}
		exclusivity={Astal.Exclusivity.IGNORE}
		keymode={Astal.Keymode.NONE}
		layer={Astal.Layer.BOTTOM}
		gdkmonitor={gdkmonitor}
		application={App} >
        <PowerButton/>
	</window>
}

