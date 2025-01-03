import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import { bash } from "../../lib/utils"

// const MAX_ITEMS = 32

function hide() {
	App.get_window("launcher")!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
	return <button
		className="app-button"
		onClicked={() => { hide(); bash(app.get_executable()) }}>
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
	const apps = new Apps.Apps()

	const text = Variable("")
	const list = text(text => apps.fuzzy_query(text))
	const onEnter = () => {
		bash(apps.fuzzy_query(text.get())?.[0].get_executable())
		hide()
	}

	return <window
		name="launcher"
		anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM}
		layer={Astal.Layer.OVERLAY}
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.EXCLUSIVE}
		margin={10}
		visible={false}
		application={App}
		onShow={() => text.set("")}
		onKeyPressEvent={(_, event) => {
			if (event.get_keyval()[1] === Gdk.KEY_Escape) {
				App.get_window("control")!.hide()
				App.get_window("power")!.hide()
				App.get_window("launcher")!.hide()
				App.get_window("closebox")!.hide()
			}
		}} >
		<box hexpand={false} vexpand vertical>
			<box widthRequest={300} heightRequest={1015} className="launcher" vertical>
				<entry
					className={"entry"}
					placeholderText="Search"
					text={text()}
					onChanged={self => text.set(self.text)}
					onActivate={onEnter}
				/>
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
