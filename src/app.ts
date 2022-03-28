/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import { Vector3 } from "@microsoft/mixed-reality-extension-sdk";

import fetch from "node-fetch";

/**
 * The structure of a hat entry in the hat database.
 */
type wearableDescriptor = {
	resourceId: string;
	attachPoint: string;
	scale: {
		x: number; y: number; z: number;
	};
	rotation: {
		x: number; y: number; z: number;
	};
	position: {
		x: number; y: number; z: number;
	};
	menuScale: {
		x: number; y: number; z: number;
	};
	menuRotation: {
		x: number; y: number; z: number;
	};
	menuPosition: {
		x: number; y: number; z: number;
	};
	previewMargin: number;
};

/**
 * The main class of this app. All the logic goes here.
 */
export default class MreWearables {

	// Container for instantiated hats.
	private attachedCloth = new Map<MRE.Guid, MRE.Actor>();
	// Load the database of hats.
	private clothDatabase: { [key: string]: wearableDescriptor } = {};
	// Options
	private previewMargin = 1.5;

	private header = "Bravent Designs";

	constructor(private context: MRE.Context, private params: MRE.ParameterSet) {

		this.context.onUserLeft((user) => this.UserLeft(user));
		this.context.onUserJoined(() => this.UserJoin());

		this.context.onStarted(() => {
			if (this.params.content_pack) {
				fetch("https://account.altvr.com/api/content_packs/" +
					this.params.content_pack +
					"/raw.json"
				)
					.then((res: any) => res.json())
					.then((json: any) => {
						this.clothDatabase = json;
						this.ShowCloth();
					});
			}

			this.header = this.params.header as string ?? this.header;
			this.ShowMenu();
		});
	}

	private UserLeft(user: MRE.User) {
		// If the user was wearing a hat, destroy it. Otherwise it would be
		// orphaned in the world.
		if (this.attachedCloth.has(user.id)) {
			this.attachedCloth.get(user.id).destroy();
		}
		this.attachedCloth.delete(user.id);
	}

	private UserJoin() {
		for (const [key, value] of this.attachedCloth) {
			value.attachment.userId = key;
		}
	}

	private ShowMenu() {
		const menu = MRE.Actor.Create(this.context);
		
		// Header text
		MRE.Actor.Create(this.context, {
			actor: {
				parentId: menu.id,
				transform: {
					local: {
						position: { x: 1, y: 1.5, z: 0 },
						scale: { x: 1, y: 1, z: 1 },
					},
				},
				text: {
					contents: this.header,
					anchor: MRE.TextAnchorLocation.TopLeft,
					color: { r: 218 / 255, g: 221 / 255, b: 2 / 255 },
					height: 0.3
				},
			},
		});

		// Remove cloth
		const cross = MRE.Actor.CreateFromLibrary(this.context, {
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

		this.CreateHoverButton(cross).onClick((user) => {
			if (this.attachedCloth.has(user.id)) { this.attachedCloth.get(user.id).destroy(); }
			this.attachedCloth.delete(user.id);
		});

		MRE.Actor.Create(this.context, {
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
					color: { r: 218 / 255, g: 221 / 255, b: 2 / 255 },
					height: 0.15
				},
			},
		});

		// Scale Up cloth
		const upHolder = MRE.Actor.Create(this.context, {
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

		const up = MRE.Actor.CreateFromLibrary(this.context, {
			resourceId: "artifact:1150512610458730762", // Up
			actor: {
				parentId: upHolder.id,
			},
		});

		this.CreateHoverButton(up).onClick((user) => {
			if (this.attachedCloth.has(user.id)) {
				this.attachedCloth.get(user.id).transform.local.scale.x += 0.02;
				this.attachedCloth.get(user.id).transform.local.scale.y += 0.02;
				this.attachedCloth.get(user.id).transform.local.scale.z += 0.02;
			}
		});

		MRE.Actor.Create(this.context, {
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
					color: { r: 218 / 255, g: 221 / 255, b: 2 / 255 },
					height: 0.15
				},
			},
		});

		// Scale Down cloth
		const downHolder = MRE.Actor.Create(this.context, {
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

		const down = MRE.Actor.CreateFromLibrary(this.context, {
			resourceId: "artifact:1150512673557840258", // Down
			actor: {
				parentId: downHolder.id,
			},
		});

		this.CreateHoverButton(down).onClick((user) => {
			if (this.attachedCloth.has(user.id)) {
				this.attachedCloth.get(user.id).transform.local.scale.x -= 0.02;
				this.attachedCloth.get(user.id).transform.local.scale.y -= 0.02;
				this.attachedCloth.get(user.id).transform.local.scale.z -= 0.02;
			}
		});

		MRE.Actor.Create(this.context, {
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
					color: { r: 218 / 255, g: 221 / 255, b: 2 / 255 },
					height: 0.15
				},
			},
		});

	}

	private ShowCloth() {
		// Create a parent object for all the menu items.
		let x = 0;

		const assets = MRE.Actor.Create(this.context);
	
		// Loop over the hat database, creating a menu item for each entry.
		for (const clothId of Object.keys(this.clothDatabase)) {

			const clothRecord = this.clothDatabase[clothId];

			// special scaling and rotation for menu
			const rotation = clothRecord.menuRotation
				? clothRecord.menuRotation
				: { x: 0, y: 0, z: 0 };
			const scale = clothRecord.menuScale
				? clothRecord.menuScale
				: { x: 3, y: 3, z: 3 };
			const position = clothRecord.menuPosition
				? clothRecord.menuPosition
				: { x: 0, y: 1, z: 0 };

			// Create menu parent
			const holder = MRE.Actor.Create(this.context, {
				actor: {
					parentId: assets.id,
					transform: {
						local: {
							position: { x, y: position.y, z: position.z },
							rotation: MRE.Quaternion.FromEulerAngles(
								rotation.x * MRE.DegreesToRadians,
								rotation.y * MRE.DegreesToRadians,
								rotation.z * MRE.DegreesToRadians
							),
							scale: scale,
						},
					},
				},
			});

			// Create a Artifact without a collider
			const model = MRE.Actor.CreateFromLibrary(this.context, {
				resourceId: clothRecord.resourceId,
				actor: {
					parentId: holder.id,
				},
			});

			// Set a click handler on the button.
			// NOTE: button press event fails on MAC
			this.CreateHoverButton(model).onClick((user) => this.WearCloth(clothId, user.id));

			x -= this.previewMargin;
		}
	}

	private WearCloth(wearId: string, userId: MRE.Guid) {

		// If the user is wearing a hat, destroy it.
		if (this.attachedCloth.has(userId)) { this.attachedCloth.get(userId).destroy(); }
		this.attachedCloth.delete(userId);

		const wearRecord = this.clothDatabase[wearId];

		const position = wearRecord.position
			? wearRecord.position
			: { x: 0, y: 0, z: 0 };
		const scale = wearRecord.scale
			? wearRecord.scale
			: { x: 1.5, y: 1.5, z: 1.5 };
		const rotation = wearRecord.rotation
			? wearRecord.rotation
			: { x: 0, y: 180, z: 0 };
		const attachPoint = (wearRecord.attachPoint ?? "head") as MRE.AttachPoint;

		const actor = MRE.Actor.CreateFromLibrary(this.context, {
			resourceId: wearRecord.resourceId,
			actor: {
				transform: {
					local: {
						position: position,
						rotation: MRE.Quaternion.FromEulerAngles(
							rotation.x * MRE.DegreesToRadians,
							rotation.y * MRE.DegreesToRadians,
							rotation.z * MRE.DegreesToRadians
						),
						scale: scale,
					},
				},
				attachment: {
					attachPoint: attachPoint,
					userId,
				},
			},
		});

		this.attachedCloth.set(userId, actor);
	}

	private CreateHoverButton(actor: MRE.Actor): MRE.ButtonBehavior {
		const button = actor.setBehavior(MRE.ButtonBehavior);

		// Trigger the grow/shrink animations on hover.
		button.onHover("enter", () => {
			this.ScaleAnimation(actor, new MRE.Vector3(1.1, 1.1, 1.1), 0.5);
		});

		button.onHover("exit", () => {
			this.ScaleAnimation(actor, new MRE.Vector3(1, 1, 1), 0.5);
		});

		return button;
	}

	private ScaleAnimation(
		object: MRE.Actor,
		scale: MRE.Vector3,
		duration: number
	): void {
		MRE.Animation.AnimateTo(this.context, object, {
			destination: { transform: { local: { scale: scale } } },
			duration: duration,
			easing: MRE.AnimationEaseCurves.EaseOutSine,
		});
	}
}
