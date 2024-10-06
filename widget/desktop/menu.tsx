import { bind, Gtk, GObject, App, Variable, timeout, Widget } from "astal";
import { IconProps } from "../../../../../../../usr/share/astal/gjs/src/widgets";
import { LabelProps } from "../../../../../../../usr/share/astal/gjs/src/widgets";
import Pango from "gi://Pango"

export const opened = Variable("");
App.connect("window-toggled", (_, name: string, visible: boolean) => {
  if (name === "quicksettings" && !visible)
    timeout(500, () => (opened.value = ""));
});

type MenuProps = {
  name: string;
  icon: IconProps["icon"];
  title: LabelProps["label"];
  content: Gtk.Widget[];
};
export const Menu = ({ name, icon, title, content }: MenuProps) =>
  <revealer
    transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
    reveal_child={bind(opened).as((v) => v === name)} >
    <box
      className={["menu", name].join(" ")}
      vertical={true} >
      <box className={"title-box"} >
        <icon
          className={"icon"}
          icon={icon}>
        </icon>
        <label
          className={"title"}
          // ellipsize={Pango.EllipsizeMode}
          label={title} >
		</label>
      </box>
    </box>
    <Gtk.Separator />
    <box
      vertical={true}
      className={"content vertical"} >
      {content}
    </box>
</revealer>
