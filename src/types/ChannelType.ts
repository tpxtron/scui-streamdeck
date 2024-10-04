export type ChannelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | "master" | "aux1" | "aux2" | "aux3" | "aux4" | "mutegroup1" | "mutegroup2" | "mutegroup3" | "mutegroup4" | "mutegroup5" | "mutegroup6" | "fx1" | "fx2" | "fx3" | "fx4";

export function isInputChannel(channel?: ChannelType) {
  if (String(channel).startsWith("master") || String(channel).startsWith("aux") || String(channel).startsWith("mutegroup")) {
    return false;
  }

  return true;
}

export function isAuxChannel(channel?: ChannelType) {
  return String(channel).startsWith("aux");
}

export function isMasterChannel(channel?: ChannelType) {
  return String(channel).startsWith("master");
}

export function isMuteGroupChannel(channel?: ChannelType) {
  return String(channel).startsWith("mutegroup");
}

export function isFxChannel(channel?: ChannelType) {
  return String(channel).startsWith("fx");
}
