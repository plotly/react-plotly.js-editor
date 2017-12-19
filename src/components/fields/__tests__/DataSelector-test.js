/* eslint-disable no-magic-numbers */
import DropdownWidget from '../../widgets/Dropdown';
import React from 'react';
import {TestEditor, fixtures, plotly} from '../../../lib/test-utils';
import {mount} from 'enzyme';

function render(overrides = {}) {
  const {attr = 'x', ...props} = overrides;
  const editorProps = {...fixtures.scatter(), onUpdate: jest.fn(), ...props};

  // return the inner-most plot connected dropdown (last)
  return mount(<TestEditor {...editorProps} plotly={plotly} />)
    .find(`[traceIndex=0]`)
    .find(`[attr="${attr}"]`)
    .last();
}

describe('DataSelector', () => {
  it('contains options defined by dataSources', () => {
    const {dataSources} = fixtures.scatter();
    const wrapper = render({dataSources}).find(DropdownWidget);
    expect(wrapper.prop('options')).toEqual([
      {label: 'xCol', value: 'x1'},
      {label: 'yCol', value: 'y1'},
      {label: 'yCol2', value: 'y2'},
    ]);
  });

  it('uses gd.data dataSrc value not fullValue when data_array', () => {
    const wrapper = render().find(DropdownWidget);
    expect(wrapper.prop('value')).toBe('x1');
  });

  // arrayOk not implemented in defaultEditor yet
  it('uses gd.data dataSrc value not fullValue when arrayOk', () => {});

  it('calls updatePlot with srcAttr and data when present', () => {
    const onUpdateTraces = jest.fn();
    const wrapper = render({onUpdateTraces}).find(DropdownWidget);
    wrapper.prop('onChange')('y1');
    expect(onUpdateTraces.mock.calls[0][0]).toEqual({
      update: {xsrc: 'y1', x: [2, 3, 4]},
      traceIndexes: [0],
    });
  });

  it('is invisible when a data src does not exist for trace type', () => {
    let wrapper = render().find(DropdownWidget);
    expect(wrapper.exists()).toBe(true);

    wrapper = render({...fixtures.pie(), attr: 'x'}).find(DropdownWidget);
    expect(wrapper.exists()).toBe(false);
  });
});
