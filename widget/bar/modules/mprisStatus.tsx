import Mpris from "gi://AstalMpris"

import { bind, Variable } from "astal"

import vars from "../../../lib/vars"

export default function(): JSX.Element {
	const player =  Mpris.Player.new(vars.player)

	const visible = Variable.derive([
		bind(player, "available"),
		bind(player, "artist")
	], (available, artist) => {
			if (available && artist) {
				return true
			} else return false
		}
	)

	return <box visible={visible()}>
		<label label={"󰋋"} className={"icon mpris"}/>
		<button
			className={"module mpris"}
			onClicked={() => player.play_pause()}
			label={bind(player, "metadata").as(() => `${player.title} - ${player.artist}`)}
			tooltipText={bind(player, "metadata").as(() => `on ${player.album}`)}>
		</button>
	</box>
}
