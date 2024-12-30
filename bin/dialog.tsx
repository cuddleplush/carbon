#!/usr/bin/env -S ags run

import { App, Astal, Gtk, Gdk } from "astal/gtk3"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

App.start({
    instanceName: "tmp" + Date.now(),
    css: /* css */`
		* {
			border-radius: 0px;	
		}
        window {
            background-color: alpha(black, 0.3);
        }

        window > box {
            margin: 8px;
            padding: 8px;
            box-shadow: 0 0 5px 5px alpha(black, 0.3);
            border-radius: 0px;
            background-color: #0F0F0F;
            color: white;
            min-width: 200px;
        }

        box > label {
            font-size: large;
            margin: 6px;
        }

        label.title {
            font-size: large;
        }

        .action {
            font-size: large;
        }

        button {
            margin: 6px;
        }
    `,
    main: (action = "XYZ") => {
        function yes() {
            print("yes")
            App.quit()
        }

        function no() {
            print("no")
            App.quit()
        }

        function onKeyPress(_: Astal.Window, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape) {
                no()
            }
        }

        <window
            onKeyPressEvent={onKeyPress}
            exclusivity={IGNORE}
            keymode={EXCLUSIVE}
			namespace={"carbon-dialog"}
            anchor={TOP | BOTTOM | LEFT | RIGHT}>
            <box halign={CENTER} valign={CENTER} vertical>
                <label className="title" label="Are you sure you want to" />
                <label className="action" label={`${action}?`} />
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
})
