#!/usr/bin/env -S ags run --gtk4

import { App, Astal, Gtk, Gdk } from "astal/gtk4"

import style from "./dialog.scss"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

function dialog(action: string): JSX.Element {
	function yes() {
		print("yes")
		App.quit()
	}

	function no() {
		print("no")
		App.quit()
	}

	return <window
		visible
		onKeyPressed={(_, keyval) => {
			if (keyval === Gdk.KEY_Escape) {
				no()
			}}
		}
		exclusivity={IGNORE}
		keymode={EXCLUSIVE}
		namespace={"carbon-dialog"}
		anchor={TOP | BOTTOM | LEFT | RIGHT}>
		<box halign={CENTER} valign={CENTER} vertical>
			<label cssClasses={["title"]} label="Are you sure you want to" />
			<label cssClasses={["action"]} label={`${action}?`} />
			<box homogeneous>
				<button onClicked={yes}>
					Yes
				</button>
				<button onClicked={no}>
					No
				</button>
			</box>
		</box>
	</window>
}

App.start({
	instanceName: "tmp" + Date.now(),
	css: style,
	main(action = "XYZ") {
		dialog(action)
	}
})
