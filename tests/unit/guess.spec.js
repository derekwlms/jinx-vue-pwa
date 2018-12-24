import { shallowMount } from '@vue/test-utils'
import Guess from '@/components/Guess.vue'

describe('Guess.vue', () => {
  it('renders an input and button for guessing', () => {
    const wrapper = shallowMount(Guess);
    expect(wrapper.contains('input')).toBe(true);
    expect(wrapper.contains('button')).toBe(true);
  }),
  it('disables input when isWaiting is true', () => {
    const wrapper = shallowMount(Guess, {
      propsData: { isWaiting: false }
    });
    expect(wrapper.contains('button')).toBe(true);
  })
});
