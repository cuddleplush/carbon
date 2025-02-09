import { App, Astal, Gdk, Gtk } from "astal/gtk4"
import { timeout } from "astal/time"
import Variable from "astal/variable"
import Wp from "gi://AstalWp"

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
    const speaker = Wp.get_default()!.get_default_speaker()
	const microphone = Wp.get_default()!.get_default_microphone()

    const iconName = Variable("")
    const value = Variable(0)

    let count = 0
    function show(v: number, icon: string) {
        visible.set(true)
        value.set(v)
        iconName.set(icon)
        count++
        timeout(2000, () => {
            count--
            if (count === 0) visible.set(false)
        })
    }

	return <revealer
		setup={(self) => {
			if (speaker) {
				self.hook(speaker, "notify::volume", () =>
					show(speaker.volume, speaker.volumeIcon),
				)
			}
			if (microphone) {
				self.hook(microphone, "notify::volume", () =>
					show(microphone.volume, microphone.volumeIcon),
				)
				self.hook(microphone, "notify::mute", () =>
					show(microphone.volume, microphone.volumeIcon),
				)
			}
		}}
		revealChild={visible()}
		transitionType={Gtk.RevealerTransitionType.SLIDE_UP}>

		<box className="osd">
			<icon icon={iconName()} />
			<levelbar valign={Gtk.Align.CENTER} widthRequest={100} value={value()} />
			<label label={value(v => `${Math.floor(v * 100)}%`)} />
		</box>
	</revealer>
}

export default function() {
    const visible = Variable(false)

    return (
        <window
            className="OSD"
            namespace="osd"
            application={App}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.ON_DEMAND}
            anchor={Astal.WindowAnchor.BOTTOM}
        >
            <eventbox onClick={() => visible.set(false)}>
                <OnScreenProgress visible={visible} />
            </eventbox>
        </window>
    )
}
