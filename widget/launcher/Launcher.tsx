import Applications from 'gi://AstalApps'
import Pango from 'gi://Pango'
import Hyprland from "gi://AstalHyprland";

import { App, Astal, Gdk, Gtk, hook } from 'astal/gtk4'
import { Variable } from 'astal'
import { hideWindows } from '../../lib/'


function hyprExec(arg: string): void {
	const hyprland = Hyprland.get_default();
	hyprland.message(`dispatch exec ${arg}`)
};

const applications = new Applications.Apps({
	nameMultiplier: 2,
	entryMultiplier: 0,
	executableMultiplier: 2
})

const query = Variable('')
const queriedApps = Variable(applications.fuzzy_query(''))
const selectedApp = Variable(queriedApps.get()[0])
const selectedIndex = Variable(0)

function ApplicationList() {
	return <Gtk.ScrolledWindow
		// cssClasses={['applications']}
		hexpand={true}
		vexpand={true}>
		<box
			vertical={true}
			spacing={8}>
			{queriedApps(apps =>
				apps.length <= 0
					? <label label='No result (dumbass)' />
					: apps.map(app => (
						<button
							cssClasses={
								selectedApp(selected =>
									selected.get_name() === app.get_name()
										? ['app-button', 'selected']
										: ['app-button']
								)
							}
							cursor={Gdk.Cursor.new_from_name('pointer', null)}
							onClicked={() => {
								hyprExec(app.get_executable().split("%")[0])
								hideWindows()
							}}>
							<box spacing={4}>
								<image iconName={app.iconName} cssClasses={["app-icon-launcher"]} />
								<label
									label={app.get_name()}
									maxWidthChars={50}
									ellipsize={Pango.EllipsizeMode.END}
								/>
							</box>
						</button>
					))
			)}
		</box>
	</Gtk.ScrolledWindow>
}

const entry = <entry
	canFocus
	onFocusEnter={(self) => {
		self.add_css_class("focused")
	}}
	onFocusLeave={(self) => {
		self.remove_css_class("focused")
	}}
	cssClasses={['entry']}
	hexpand={true}
	placeholderText='Search'
	onNotifyText={({ text }) => {
		query.set(text)
		queriedApps.set(applications.fuzzy_query(text))
		selectedApp.set(queriedApps.get()[0])
	}}
	onActivate={() => {
		hyprExec(applications.fuzzy_query(query.get())?.[0].get_executable().split("%")[0])
		hideWindows()
	}}
	setup={(self) => {
		hook(self, App, "window-toggled", (_, win) => {
			const winName = win.name;
			const visible = win.visible;

			if (winName === "launcher" && visible) {							
				self.text = ''
				queriedApps.set(applications.fuzzy_query(''))
				selectedApp.set(queriedApps.get()[0])
				selectedIndex.set(0)
			}
			self.grab_focus()
		})
	}}
/>


function QueryBox() {
	return <box cssClasses={['query_box']}>
		{entry}
	</box>
}

function AppLauncher() {
	return <box
		cssClasses={["launcher"]}
		widthRequest={300}
		heightRequest={1015}
		vertical={true}>
		<QueryBox />
		<ApplicationList />
	</box>
}

export default function() {
	return <window
		name="launcher"
		anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM}
		// anchor={Astal.WindowAnchor.MID}
		layer={Astal.Layer.OVERLAY}
		exclusivity={Astal.Exclusivity.NORMAL}
		keymode={Astal.Keymode.EXCLUSIVE}
		// defaultWidth={1}
		// defaultHeight={1}
		margin={-5}
		visible={false}
		application={App}
		onKeyPressed={(_, keyval) => {
			switch (keyval) {
				case Gdk.KEY_Escape:
					hideWindows()
					break

				case Gdk.KEY_Tab:
				case Gdk.KEY_Down:
					if (queriedApps.get().length <= 0) return

					if (selectedIndex.get() < queriedApps.get().length - 1) {
						selectedIndex.set(selectedIndex.get() + 1)
						selectedApp.set(queriedApps.get()[selectedIndex.get()])
					}
					break

				case Gdk.KEY_Up:
					if (queriedApps.get().length <= 0) return

					if (selectedIndex.get() > 0) {
						selectedIndex.set(selectedIndex.get() - 1)
						selectedApp.set(queriedApps.get()[selectedIndex.get()])
					}
					break
				default:
					entry.grab_focus()
					break
			}
		}}>
		<AppLauncher/>
	</window>
}

