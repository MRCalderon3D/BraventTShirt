
import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import { Vector3 } from "@microsoft/mixed-reality-extension-sdk";
import App from "../app";


export class Utilities{

	public static CreateHoverButton(actor: MRE.Actor): MRE.ButtonBehavior {
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

	public static ScaleAnimation(
		object: MRE.Actor,
		scale: (MRE.Vector3 | Vector3),
		duration: number
	): void {
		MRE.Animation.AnimateTo(App.Context, object, {
			destination: { transform: { local: { scale: scale } } },
			duration: duration,
			easing: MRE.AnimationEaseCurves.EaseOutSine,
		});

	}
}
