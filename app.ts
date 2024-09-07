import { App } from "astal"
import style from "./style/main.scss"
import Bar from "./widget/Bar"

App.start({
    css: style,
    main() {
        Bar(0)
        Bar(1)
        // Bar(1) // initialize other monitors
    },
})
