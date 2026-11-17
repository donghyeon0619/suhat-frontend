import { describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SpeakerView from '@/views/game/multiplayer/speaker/SpeakerView.vue';
import ListenerView from '@/views/game/multiplayer/listener/ListenerView.vue';
import { GameState } from '@/types/GameState';

vi.mock('@/views/game/multiplayer/speaker/SpeakerSpeakingView.vue', () => ({
  default: { name: 'SpeakerSpeakingView', props: ['currentSpeaker'], template: '<div />' },
}));
vi.mock('@/views/game/multiplayer/speaker/SpeakerVotingView.vue', () => ({ default: { template: '<div />' } }));
vi.mock('@/views/game/multiplayer/listener/ListenerListeningView.vue', () => ({
  default: { name: 'ListenerListeningView', props: ['currentSpeaker'], template: '<div />' },
}));
vi.mock('@/views/game/multiplayer/listener/ListenerVotingView.vue', () => ({ default: { template: '<div />' } }));

describe('server snapshot speaker field', () => {
  // Jackson serializes PlayerDto.isSpeaking() as "speaking".
  const gameState = JSON.parse(`{
    "currentPhase":"DISCUSSION", "votingEndsAt":0,
    "players":[
      {"playerId":1,"speaking":false,"playerInfo":{"name":"Listener"}},
      {"playerId":2,"speaking":true,"playerInfo":{"name":"Speaker"}}
    ]
  }`) as GameState;

  it.each([
    [SpeakerView, 'SpeakerSpeakingView'],
    [ListenerView, 'ListenerListeningView'],
  ] as const)('renders the current speaker from the wire payload (%s)', (component, childName) => {
    const wrapper = shallowMount(component, { props: { gameState } });
    const speaking = wrapper.findComponent({ name: childName });
    expect(speaking.exists()).toBe(true);
    expect(speaking.props('currentSpeaker').playerId).toBe(2);
    wrapper.unmount();
  });
});
