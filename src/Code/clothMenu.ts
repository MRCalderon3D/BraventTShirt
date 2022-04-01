import * as MRE from "@microsoft/mixed-reality-extension-sdk";

import App from "../app";
import { ClothManager } from "./clothWearManager";
import { Utilities } from "./utilities";

export class ClothMenu {

	constructor(header: string, color: MRE.Color3Like) {

		const menu = MRE.Actor.Create(App.Context);

		// Header text
		MRE.Actor.Create(App.Context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 1, y: 1.5, z: 0 },
						scale: { x: 1, y: 1, z: 1 },
					},
				},
				text: {
					contents: header,
					anchor: MRE.TextAnchorLocation.TopLeft,
					color: color,
					height: 0.3
				},
			},
		});

		// Remove cloth
		const cross = MRE.Actor.CreateFromLibrary(App.Context, {
			resourceId: "artifact:1150513214480450500", // Cross
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 1.5, y: 0, z: 0 },
						scale: { x: 1, y: 1, z: 1 },
					},
				}
			},
		});

		Utilities.CreateHoverButton(cross).onClick((user) => ClothManager.RemoveUserCloth(user));

		MRE.Actor.Create(App.Context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 2, y: 0, z: 0 }
					},
				},
				text: {
					contents: "Remove",
					anchor: MRE.TextAnchorLocation.MiddleLeft,
					color: color,
					height: 0.15
				},
			},
		});

		// Scale Up cloth
		const upHolder = MRE.Actor.Create(App.Context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 1.5, y: 0.7, z: 0 },
						scale: { x: 0.7, y: 0.7, z: 0.7 },
					},
				}
			}
		});

		const up = MRE.Actor.CreateFromLibrary(App.Context, {
			resourceId: "artifact:1150512610458730762", // Up
			actor: {
				parentId: upHolder.id,
			},
		});

		Utilities.CreateHoverButton(up).onClick((user) => ClothManager.ScaleUserCloth(user, 0.02));

		MRE.Actor.Create(App.Context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 2, y: 0.7, z: 0 }
					},
				},
				text: {
					contents: "Scale Up",
					anchor: MRE.TextAnchorLocation.MiddleLeft,
					color: color,
					height: 0.15
				},
			},
		});

		// Scale Down cloth
		const downHolder = MRE.Actor.Create(App.Context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 1.5, y: -0.7, z: 0 },
						scale: { x: 0.7, y: 0.7, z: 0.7 },
						rotation: MRE.Quaternion.FromEulerAngles(
							0 * MRE.DegreesToRadians,
							0 * MRE.DegreesToRadians,
							90 * MRE.DegreesToRadians
						)
					},
				}
			}
		});

		const down = MRE.Actor.CreateFromLibrary(App.Context, {
			resourceId: "artifact:1150512673557840258", // Down
			actor: {
				parentId: downHolder.id,
			},
		});

		Utilities.CreateHoverButton(down).onClick((user) => ClothManager.ScaleUserCloth(user, -0.02));

		MRE.Actor.Create(App.Context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 2, y: -0.7, z: 0 }
					},
				},
				text: {
					contents: "Scale Down",
					anchor: MRE.TextAnchorLocation.MiddleLeft,
					color: color,
					height: 0.15
				},
			},
		});
	}
}
