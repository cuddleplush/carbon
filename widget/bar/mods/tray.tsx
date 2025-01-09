import AstalTray from "gi://AstalTray?version=0.1";
import { bind, Gio, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk3";

// Thanks HyprPanel!

const systemtray = AstalTray.get_default();

function createMenu(menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup | null): Gtk.Menu {
	const menu = Gtk.Menu.new_from_model(menuModel);
	menu.insert_action_group("dbusmenu", actionGroup);

	return menu;
};

function MenuDefaultIcon({ item }: MenuEntryProps): JSX.Element {
	return <icon gicon={bind(item, "gicon")} tooltipMarkup={bind(item, "tooltipMarkup")} />;
};

function MenuEntry({ item, child }: MenuEntryProps): JSX.Element {
	let menu: Gtk.Menu;

	const entryBinding = Variable.derive(
		[bind(item, "menuModel"), bind(item, "actionGroup")],
		(menuModel, actionGroup) => {
			if (!menuModel) {
				return console.error(`Menu Model not found for ${item.id}`);
			}
			if (!actionGroup) {
				return console.error(`Action Group not found for ${item.id}`);
			}

			menu = createMenu(menuModel, actionGroup);
		},
	);

	return <button
		cursor={"pointer"}
		className={"tray-item"}
		onButtonPressEvent={(self, event) => {
			if (event.get_button()[1] === Gdk.BUTTON_PRIMARY) {
				item.activate(0, 0);
			} else {
				menu?.popup_at_widget(self, Gdk.Gravity.NORTH, Gdk.Gravity.SOUTH, null);
			}
		}}
		onDestroy={() => {
			menu?.destroy();
			entryBinding.drop();
		}}>
		{child}
	</button>
};

export default function(): JSX.Element {
	const isVis = Variable(false);
	const componentChildren = Variable.derive(
		[bind(systemtray, "items")],
		(items) => {
			const filteredTray = items.filter(({ id }) => id !== null);
			isVis.set(filteredTray.length > 0);
			return filteredTray.map((item) => {
				return <MenuEntry item={item}>
					<MenuDefaultIcon item={item} />
				</MenuEntry>
			});
		},
	);

	return <box
		className={"module"}
		spacing={8}
		onDestroy={() => {
			isVis.drop();
			componentChildren.drop();
		}}>
		{componentChildren()}
	</box>
};

interface MenuEntryProps {
    item: AstalTray.TrayItem;
    child?: JSX.Element;
}
