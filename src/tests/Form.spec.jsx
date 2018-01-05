import React from 'react';
import { shallow } from 'enzyme';
import { Model, Form as RxForm } from 'rx-form';
import Form from '../Form';

describe('Test Form', () => {
  test('Form should render', async () => {
    const model = Model.object({});
    const mockFn = jest.fn((form) => <span>{JSON.stringify(form)}</span>);
    const component = shallow(<Form
      render={mockFn}
      model={model}
    />);

    expect(component).toMatchSnapshot();
    expect(mockFn).toHaveBeenCalledWith(expect.any(RxForm));
  });

  test('Form should re-render when the model prop has been changed', async () => {
    const model = Model.object({});
    const mockFn = jest.fn(() => null);
    const component = shallow(<Form
      render={mockFn}
      model={model}
    />);

    component.setProps({
      model: Model.object({}),
    });
    expect(mockFn.mock.calls[0][0]).not.toBe(mockFn.mock.calls[1][0]);
  });

  test('Form should cleanup', async () => {
    const model = Model.object({});
    const component = shallow(<Form
      render={() => null}
      model={model}
    />);

    const mockFn = jest.spyOn(component.instance(), 'cleanup');
    component.unmount();

    expect(mockFn).toHaveBeenCalled();
  });
});
