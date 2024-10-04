import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { ChannelType, isAuxChannel, isFxChannel, isInputChannel, isMuteGroupChannel } from "../types/ChannelType";
import { SoundcraftUI } from "soundcraft-ui-connection";

const defaultMixerUrl = "ui-mixer.io";

@action({ UUID: "com.rollercoder.scui-streamdeck.mute-toggle" })
export class MuteToggle extends SingletonAction<CounterSettings> {
	private _conn?: SoundcraftUI = undefined;

	/**
	 * The {@link SingletonAction.onWillAppear} event is useful for setting the visual representation of an action when it becomes visible. This could be due to the Stream Deck first
	 * starting up, or the user navigating between pages / folders etc.. There is also an inverse of this event in the form of {@link streamDeck.client.onWillDisappear}. In this example,
	 * we're setting the title to the "count" that is incremented in {@link MuteToggle.onKeyDown}.
	 */
	override async onWillAppear(ev: WillAppearEvent<CounterSettings>): Promise<void> {
		const { settings } = ev.payload;

		if (!settings.mixerUrl) {
			settings.mixerUrl = defaultMixerUrl;
			await ev.action.setSettings(settings);
		}

		this._conn = new SoundcraftUI(settings.mixerUrl);

		if (!settings.channel) {
			settings.channel = 1;
			await ev.action.setSettings(settings);
		}

		let currentState = false;
		if (isInputChannel(settings.channel)) {
			currentState = !!this._conn.master.input(settings.channel as number).mute$;
		} else if (isAuxChannel(settings.channel)) {
			currentState = !!this._conn.master.aux(Number(String(settings.channel).replace("aux", ""))).mute$;
		} else if (isFxChannel(settings.channel)) {
			currentState = !!this._conn.master.fx(Number(String(settings.channel).replace("fx", ""))).mute$;
		} else if (isMuteGroupChannel(settings.channel)) {
			currentState = !!this._conn.muteGroup(Number(String(settings.channel).replace("mutegroup", ""))).state$;
		}

		if (!settings.muteState) {
			settings.muteState = currentState;
			await ev.action.setSettings(settings);
		}

		return ev.action.setImage(settings.muteState ? "imgs/actions/mute/muted@2x.png" : "imgs/actions/mute/unmuted@2x.png");
	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		// Update the count from the settings.
		const { settings } = ev.payload;
		settings.mixerUrl ??= "ui-mixer.io";
		settings.muteState ??= !!settings.muteState ? false : true;

		const newMuteState = !(settings.muteState || false);
		settings.muteState = newMuteState;

		if (!this._conn) {
			return;
		}

		if (isInputChannel(settings.channel)) {
			await this._conn.master.input(settings.channel as number).setMute(newMuteState ? 1 : 0);
		} else if (isAuxChannel(settings.channel)) {
			await this._conn.master.aux(Number(String(settings.channel).replace("aux", ""))).setMute(newMuteState ? 1 : 0);
		} else if (isFxChannel(settings.channel)) {
			await this._conn.master.fx(Number(String(settings.channel).replace("fx", ""))).setMute(newMuteState ? 1 : 0);
		} else if (isMuteGroupChannel(settings.channel)) {
			if (newMuteState === false) {
				await this._conn.muteGroup(Number(String(settings.channel).replace("mutegroup", ""))).unmute();
			} else {
				await this._conn.muteGroup(Number(String(settings.channel).replace("mutegroup", ""))).mute();
			}
		}

		// Update the current count in the action's settings, and change the title.
		await ev.action.setSettings(settings);
		await ev.action.setImage(newMuteState ? "imgs/actions/mute/muted@2x.png" : "imgs/actions/mute/unmuted@2x.png");
	}
}

/**
 * Settings for {@link MuteToggle}.
 */
type CounterSettings = {
	mixerUrl?: string;
	muteState?: boolean;
	channel?: ChannelType;
};
