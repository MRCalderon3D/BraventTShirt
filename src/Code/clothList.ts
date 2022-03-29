import { ClothManager, WearableDescriptor } from "./clothWearManager";

export class ClothList extends ClothManager {

	private previewMargin = 1.5;

	constructor(clothDatabase: { [key: string]: WearableDescriptor }) {
		super();

		let x = 0;
    
		for (const cloth of Object.values(clothDatabase)) {
    
			this.CreateClothInMenu(cloth, x);
    
			x -= this.previewMargin;
		}
	}
}
