import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import { EaseCurve } from "@microsoft/mixed-reality-extension-sdk";
import App from "../app";
import { Utilities } from "./utilities";

/**
 * The structure of a hat entry in the hat database.
 */
export type WearableDescriptor = {
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


export class ClothManager {

	protected static attachedCloth = new Map<MRE.Guid, MRE.Actor>();

	protected assets: MRE.Actor;

	constructor(){
		this.assets = MRE.Actor.Create(App.Context);
	}

	protected CreateClothInMenu(clothRecord: WearableDescriptor, x: number): MRE.Actor {

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
		const holder = MRE.Actor.Create(App.Context, {
			actor: {
				parentId: this.assets.id,
				transform: {
					local: {
						position: { x: x, y: position.y, z: position.z },
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
		let model = MRE.Actor.CreateFromLibrary(App.Context, {
			resourceId: clothRecord.resourceId,
			actor: {
				parentId: holder.id,
				transform: {
					local: {
						scale: new MRE.Vector3(0, 0, 0),
					},
				},
			},
		});
		
		// Set a click handler on the button.
		// NOTE: button press event fails on MAC
		Utilities.CreateHoverButton(model).onClick((user) =>
			ClothManager.CreateCloth(clothRecord, user)
		);

		const myCurve: EaseCurve = [0.17,0.67,0.59,1.28]
		Utilities.ScaleAnimation(model, new MRE.Vector3(1, 1, 1), 0.5, myCurve);

		return holder;
	}

	public static CreateCloth(wearRecord: WearableDescriptor, user: MRE.User) {

		// If the user is wearing a hat, destroy it.
		if (ClothManager.attachedCloth.has(user.id)) { ClothManager.attachedCloth.get(user.id).destroy(); }
		ClothManager.attachedCloth.delete(user.id);

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

		const actor = MRE.Actor.CreateFromLibrary(App.Context, {
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
					userId: user.id,
				},
			},
		});

		ClothManager.attachedCloth.set(user.id, actor);
	}

	public static RemoveUserCloth(user: MRE.User) {
		if (ClothManager.attachedCloth.has(user.id)) {
			ClothManager.attachedCloth.get(user.id).destroy();
		}
		ClothManager.attachedCloth.delete(user.id);
	}

	public static UpdateUsersCloth() {
		for (const [key, value] of ClothManager.attachedCloth) {
			value.attachment.userId = key;
		}
	}

	public static ScaleUserCloth(user: MRE.User, increment: number){
		if (ClothManager.attachedCloth.has(user.id)) {
			ClothManager.attachedCloth.get(user.id).transform.local.scale.x += increment;
			ClothManager.attachedCloth.get(user.id).transform.local.scale.y += increment;
			ClothManager.attachedCloth.get(user.id).transform.local.scale.z += increment;
		}
	}
}
