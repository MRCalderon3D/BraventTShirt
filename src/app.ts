import * as MRE from "@microsoft/mixed-reality-extension-sdk";

import fetch from "node-fetch";

import { ClothCarousel, ClothList, ClothMenu, ClothManager} from "./Code";

/**
 * The main class of this app. All the logic goes here.
 */
export default class App {

	public static Context: MRE.Context;

	private header = "Bravent Designs";
	private color: MRE.Color3Like = { r: 218 / 255, g: 221 / 255, b: 2 / 255 };

	private menu: ClothMenu;
	private clothList: ClothManager;

	constructor(private context: MRE.Context, private params: MRE.ParameterSet) {

		App.Context = context;

		this.context.onUserLeft((user) => ClothManager.RemoveUserCloth(user));
		this.context.onUserJoined(() => ClothManager.UpdateUsersCloth());

		this.context.onStarted(() => {
			// Get items and update
			if (this.params.content_pack) {
				this.GetContentPackJson(this.params.content_pack as string, (json: any) => {
					if (this.params.carousel as string === "true") {
						this.clothList = new ClothCarousel(json);
					} else {
						this.clothList = new ClothList(json);
					}
				});
			} else { console.log("ERROR: No content path selected!"); }

			// Update options (color/header) and menu items.
			if (this.params.options) {
				this.GetContentPackJson(this.params.options as string, (json: any) => {
					this.header = json.header ?? this.header;
					this.color = json.color ?
						{ r: json.color.r / 255, g: json.color.g / 255, b: json.color.b / 255 } : this.color;

					this.menu = new ClothMenu(this.header, this.color);
				});
			} else {
				this.header = this.params.header as string ?? this.header;

				this.menu = new ClothMenu(this.header, this.color);
			}
		});
	}

	private GetContentPackJson(id: string, callback: (json: any) => void) {
		fetch("https://account.altvr.com/api/content_packs/" +
			id +
			"/raw.json")
			.then((res: any) => res.json())
			.then((json: any) => callback(json));
	}
}
