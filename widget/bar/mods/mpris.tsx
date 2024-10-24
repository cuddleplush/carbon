import { bind } from "astal"
import Mpris from "gi://AstalMpris"
import vars from "../../../vars"

export function Player() {
	const player =  Mpris.Player.new(vars.player)

	return <box>
		{bind(player, "artist").as(p => p ? (
			<box className={"mprisbox"}>
				<label label={"󰋋"} className={"icon mpris"} />
				<button
					className="module mpris"
					onClicked={() => player.play_pause()}
					label={`${player.title} - ${player.artist}`} 
					tooltipText={`on "${player.album}"`}>
				</button>
			</box>
		) : (
			<box />
			)
		)}
	</box>
}
