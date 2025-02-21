import { bind } from "astal"
import { App, Astal, Gtk, hook } from "astal/gtk4"
import { timeout } from "astal/time"
import Variable from "astal/variable"
import Wp from "gi://AstalWp"

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
	const speaker = Wp.get_default()!.get_default_speaker()
	const microphone = Wp.get_default()!.get_default_microphone()

	const iconName = Variable("")
	const value = Variable(0)
	const muted = Variable(true)

	let count = 0
	function show(v: number, mute: boolean, icon: string) {
		visible.set(true)
		value.set(v)
		iconName.set(icon)
		muted.set(mute)
		count++
		timeout(2000, () => {
			count--
			if (count === 0) visible.set(false)
		})
	}

	return <box
		setup={(self) => {
			if (speaker) {
				hook(self, speaker, "notify::volume", () => {
					show(speaker.volume, false,
						speaker.volume <= 0 ? "󰝟"
							: speaker.volume <= 0.33 && speaker.volume < 0.66 ? "󰕿"
							: speaker.volume > 0.33 && speaker.volume < 0.99 ? "󰖀"
							: speaker.volume >= 0.99 ? "󰕾"
							: "null"
					)
				})
			}

			if (microphone) {
				hook(self, microphone, "notify::volume", () => {
					show(microphone.volume, microphone.mute ? true : false,
						microphone.volume <= 0 || microphone.mute ? "󰍭" : "󰍬"
					)
				})

				hook(self, microphone, "notify::mute", () => {
					show(microphone.volume, microphone.mute ? true : false, microphone.mute ? "󰍭" : "󰍬")
				})
			}
		}}
		visible={visible()}>

		<box cssClasses={["osd"]}>
			<label label={iconName()} cssClasses={["osd-icon"]}/>
			<levelbar
				cssClasses={bind(muted).as((m => {
					return m ? ["osd-fill", "muted"] : ["osd-fill"] 
				}))}
				valign={Gtk.Align.CENTER} 
				widthRequest={300} 
				value={value()} 
				heightRequest={48}>
			</levelbar>
		</box>
	</box>
}

export default function() {
	const visible = Variable(false)

	return <window
		visible={bind(visible)}
		namespace="osd"
		name={"osd"}
		margin={-5}
		application={App}
		layer={Astal.Layer.OVERLAY}
		anchor={Astal.WindowAnchor.BOTTOM}>
		<OnScreenProgress visible={visible} />
	</window>
}
