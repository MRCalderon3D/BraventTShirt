/* eslint-disable indent */
import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import App from "../app";

import { ClothManager, WearableDescriptor } from "./clothWearManager";
import { Utilities } from "./utilities";

export class ClothCarousel extends ClothManager {

	private clothDatabase: ArrayLike<WearableDescriptor>;

	private currentCloth: MRE.Actor;

	private selectionIndex = 0;

	constructor(clothDatabase: { [key: string]: WearableDescriptor }) {
		super();

		this.clothDatabase = Object.values(clothDatabase);

		this.currentCloth = this.CreateClothInMenu(this.clothDatabase[this.selectionIndex], -0.5);

		this.CreateArrows();
	}

	private CreateArrows() {
		const rightHolder = MRE.Actor.Create(App.Context, {
			actor: {
				parentId: this.assets.id,
				transform: {
					local: {
						position: { x: 0.5, y: 0, z: 0 },
						scale: { x: 3, y: 3, z: 3 },
						rotation: MRE.Quaternion.FromEulerAngles(
							0 * MRE.DegreesToRadians,
							0 * MRE.DegreesToRadians,
							-90 * MRE.DegreesToRadians
						)
					},
				}
			}
		});

		const right = MRE.Actor.CreateFromLibrary(App.Context, {
			resourceId: "artifact:1150513195203429312", // Arrow
			actor: {
				parentId: rightHolder.id,
			},
		});

		Utilities.CreateHoverButton(right).onClick(() => this.MoveSelection(true));

		const leftHolder = MRE.Actor.Create(App.Context, {
			actor: {
				parentId: this.assets.id,
				transform: {
					local: {
						position: { x: -1.5, y: 0, z: 0 },
						scale: { x: 3, y: 3, z: 3 },
						rotation: MRE.Quaternion.FromEulerAngles(
							0 * MRE.DegreesToRadians,
							0 * MRE.DegreesToRadians,
							90 * MRE.DegreesToRadians
						)
					},
				}
			}
		});

		const left = MRE.Actor.CreateFromLibrary(App.Context, {
			resourceId: "artifact:1150513195203429312", // Arrow
			actor: {
				parentId: leftHolder.id,
			},
		});

		Utilities.CreateHoverButton(left).onClick(() => this.MoveSelection(false));
	}

	private MoveSelection(up: boolean) {
		this.selectionIndex += up ? 1 : -1;

		if (this.selectionIndex === this.clothDatabase.length) { this.selectionIndex = 0; }
		if (this.selectionIndex === -1) { this.selectionIndex = this.clothDatabase.length - 1; }

		this.currentCloth.destroy();

		this.currentCloth = this.CreateClothInMenu(this.clothDatabase[this.selectionIndex], -0.5);
	}
}

