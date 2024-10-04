import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { IncrementCounter } from "./actions/increment-counter";
import { MuteToggle } from './actions/mute-toggle';

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the increment action.
// streamDeck.actions.registerAction(new IncrementCounter());

// Register the mute-toggle action.
streamDeck.actions.registerAction(new MuteToggle());

// Finally, connect to the Stream Deck.
streamDeck.connect();
