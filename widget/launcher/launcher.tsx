import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import Hyprland from "gi://AstalHyprland";
import { hideWindows } from "../../lib";

function hyprExec(arg: string): void {
	const hyprland = Hyprland.get_default();
	hyprland.message(`dispatch exec ${arg}`)
};

const MAX_ITEMS = 32

const apps = new Apps.Apps()

const text = Variable("")
const list = text(text => apps.fuzzy_query(text).slice(0, MAX_ITEMS))
const onEnter = () => {
	hyprExec(apps.fuzzy_query(text.get())?.[0].get_executable().split("%")[0])
	hideWindows()
}

const entry	= <entry
	canFocus
	className={"entry"}
	placeholderText="Search"
	text={text()}
	setup={(self) => {
		self.hook(App, "window-toggled", (_, win) => {
			const winName = win.name;
			const visible = win.visible;

			if (winName == "launcher" && visible) {
				text.set("");
				self.grab_focus();
			}
		})
	}}
	onChanged={self => text.set(self.text)}
	onActivate={onEnter}
/>

const navkeys = [
	Gdk.KEY_Return,
	Gdk.KEY_Escape,
	Gdk.KEY_Tab,
	Gdk.KEY_Up,
	Gdk.KEY_Down,
	Gdk.KEY_Left,
	Gdk.KEY_Right,
]

function AppButton({ app }: { app: Apps.Application }) {
	return <button
		className="app-button"
		onClicked={() => {
			hyprExec(app.get_executable().split("%")[0])
			hideWindows()
		}}
		onKeyPressEvent={(_, event) => {
			if (!navkeys.includes(event.get_keyval()[1])) {
				text.set(Gdk.keyval_name(event.get_keyval()[1])!)
				entry.grab_focus()
				print(Gdk.keyval_name(event.get_keyval()[1])!)
			}
		}}>
		<box>
			<icon icon={app.iconName} className={"app-icon-launcher"} />
			<box valign={Gtk.Align.CENTER} vertical>
				<label
					className="name"
					truncate
					xalign={0}
					label={app.name}
				/>
			</box>
		</box>
	</button>
}

export default function() {
	const { CENTER } = Gtk.Align
	return <window
		name="launcher"
		anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM}
		layer={Astal.Layer.OVERLAY}
		exclusivity={Astal.Exclusivity.EXCLUSIVE}
		keymode={Astal.Keymode.EXCLUSIVE}
		margin={-5}
		margin_left={-15}
		visible={false}
		application={App}
		onShow={() => {
			text.set("")
		}}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				hideWindows()
			}		
		}}>
		<box hexpand={false} vexpand vertical>
			<box widthRequest={300} heightRequest={1015} className="launcher" vertical>
				{entry}
				<scrollable
					vexpand
					vscroll={Gtk.PolicyType.ALWAYS}
					hscroll={Gtk.PolicyType.NEVER}>
					<box spacing={8} vertical>
						{list.as(list => list.map(app => (
							<AppButton app={app} />
						)))}
					</box>
				</scrollable>
				<box
					halign={CENTER}
					className="not-found"
					vertical
					visible={list.as(l => l.length === 0)}>
					<icon icon="system-search-symbolic" />
					<label label="No match found" />
				</box>
			</box>
		</box>
	</window>
}
