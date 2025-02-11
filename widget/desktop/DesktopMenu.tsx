import Gio from "gi://Gio?version=2.0"

import { Bash } from "../../lib";

const gamesMenu = new Gio.Menu();
gamesMenu.append("Steam", "desktop-menu.steam")
gamesMenu.append("Prism", "desktop-menu.prism")
gamesMenu.append("Genshin", "desktop-menu.genshin")

const messagingMenu = new Gio.Menu();
messagingMenu.append("Vesktop", "desktop-menu.vesktop")
messagingMenu.append("Telegram", "desktop-menu.telegram")

const powerMenu = new Gio.Menu();
powerMenu.append("Log Out", "desktop-menu.logout")
powerMenu.append("Shutdown", "desktop-menu.shutdown")
powerMenu.append("reboot", "desktop-menu.reboot")

export const desktopMenu = new Gio.Menu();
desktopMenu.append("Audio", "desktop-menu.audio");
desktopMenu.append("Music", "desktop-menu.music");
desktopMenu.append("Files", "desktop-menu.files");
desktopMenu.append("Browser", "desktop-menu.browser");
desktopMenu.append("Screenshot", "desktop-menu.screenshot");
desktopMenu.append_submenu(" Games", gamesMenu)
desktopMenu.append_submenu(" Messaging", messagingMenu)
desktopMenu.append_submenu(" Power", powerMenu)

export const desktopMenuGroup = new Gio.SimpleActionGroup();

function action(actionName: string | Gio.SimpleAction | Gio.Action, cmd: string) {
	actionName = new Gio.SimpleAction({ name: actionName as string });
	actionName.connect("activate", () => Bash(cmd));
	desktopMenuGroup.add_action(actionName);
}

action("audio", "pavucontrol")
action("music", "/opt/Cider/cider --ozone-platform-hint=wayland")
action("files", "nemo")
action("browser", "firefox")
action("screenshot", "grimblast --notify copysave area")

action("steam", "steam")
action("prism", "prismlauncher")
action("genshin", "anime-game-launcher")

action("vesktop", "vesktop --enable-features=UseOzonePlatform --ozone-platform=wayland")
action("telegram", "telegram-desktop")

action("logout", "hyprctl dispatch exit")
action("shutdown", "fctl poweroff")
action("reboot", "fctl reboot")

