import Notifd from "gi://AstalNotifd"

import { Astal, Gtk } from "astal/gtk3"
import Notification from "./notifs"
import { type Subscribable } from "astal/binding"
import { Variable, bind, timeout } from "astal"

const TIMEOUT_DELAY = 5000

class NotificationMap implements Subscribable {
    private map: Map<number, Gtk.Widget> = new Map()
    private var: Variable<Array<Gtk.Widget>> = Variable([])

    private notifiy(): void {
        this.var.set([...this.map.values()].reverse())
    }

    public constructor() {
        const notifd = Notifd.get_default()
        // notifd.ignoreTimeout = true

        notifd.connect("notified", (_, id): void => {
            this.set(id, Notification({
                notification: notifd.get_notification(id)!,
                onHoverLost: () => this.delete(id),
                setup: () => timeout(TIMEOUT_DELAY, () => {
                    // this.delete(id)
                })
            }))
        })

        notifd.connect("resolved", (_, id): void => {
            this.delete(id)
        })
    }

    private set(key: number, value: Gtk.Widget): void {
        this.map.get(key)?.destroy()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number): void {
        this.map.get(key)?.destroy()
        this.map.delete(key)
        this.notifiy()
    }

    get(): Gtk.Widget[] {
        return this.var.get()
    }

    subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
        return this.var.subscribe(callback)
    }
}

export default function NotificationPopups(): JSX.Element {
    const { BOTTOM, RIGHT } = Astal.WindowAnchor
    const notifs = new NotificationMap()

    return <window
        className="NotificationPopups"
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
		layer={Astal.Layer.OVERLAY}
        anchor={BOTTOM | RIGHT}>
        <box vertical>
            {bind(notifs)}
        </box>
    </window>
}
