import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import FormConnect from '../FormConnect';
import TestForm from './forms/TestForm';

describe('Test FormConnect', () => {
  test('FormConnect with no when... props', async () => {
    const form = new TestForm();

    const mockFn = jest.fn(f => <span>{f.getFirstError() && f.getFirstError().state}</span>);

    const component = renderer.create(
      <FormConnect form={form} whenForm debounce={0}>{mockFn}</FormConnect>,
    );

    mockFn.mockClear();
    form.setAttribute('name', 'a');
    form.setStateValue('foo', 'bar');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    await form.validateAttributes('name');
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    form.setStateValue('a', 'a');
    form.setStateValue('b', 'b');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    form.setAttribute('password', 'abc');
    await form.validateAttributes('password');
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(component).toMatchSnapshot();
  });

  test('FormConnect with whenForm prop', async () => {
    const form = new TestForm();

    const mockFn = jest.fn(f => <span>{f.getFirstError() && f.getFirstError().state}</span>);

    const component = renderer.create(
      <FormConnect form={form} whenForm={['a', 'b']} debounce={0}>{mockFn}</FormConnect>,
    );

    mockFn.mockClear();
    form.setAttribute('name', 'a');
    form.setStateValue('a', 'a');
    form.setStateValue('b', 'b');
    form.setStateValue('c', 'c');
    form.setStateValue('d', 'd');
    form.setStateValue('e', 'e');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    form.setAttribute('password', 'abc');
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(component).toMatchSnapshot();
  });

  test('FormConnect with whenModel prop', async () => {
    const form = new TestForm();

    const mockFn = jest.fn(f => <span>{f.getFirstError() && f.getFirstError().state}</span>);

    renderer.create(
      <FormConnect form={form} whenModel={['password']} debounce={0}>{mockFn}</FormConnect>,
    );

    mockFn.mockClear();
    form.setAttribute('name', 'Paul');
    form.setStateValue('a', 'a');
    form.setStateValue('b', 'b');
    expect(mockFn).toHaveBeenCalledTimes(0);

    mockFn.mockClear();
    form.setAttribute('name', 'John');
    form.setAttribute('password', 'abc');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('FormConnect with whenModel and whenForm prop', async () => {
    const form = new TestForm();

    const mockFn = jest.fn(f => <span>{f.getFirstError() && f.getFirstError().state}</span>);

    renderer.create(
      <FormConnect form={form} whenModel={['password']} whenForm={['a', 'b']} debounce={0}>{mockFn}</FormConnect>,
    );

    mockFn.mockClear();
    form.setAttribute('name', 'Paul');
    form.setStateValue('a', 'a');
    form.setStateValue('b', 'b');
    form.setStateValue('c', 'c');
    form.setStateValue('d', 'd');
    expect(mockFn).toHaveBeenCalledTimes(2);

    mockFn.mockClear();
    form.setAttribute('name', 'John');
    form.setAttribute('password', 'abc');
    form.setStateValue('b', 'b');
    form.setStateValue('c', 'c');
    form.setStateValue('d', 'd');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('debounce prop test', async () => {
    const form = new TestForm();

    const mockFn = jest.fn(f => <span>{f.getFirstError() && f.getFirstError().state}</span>);

    renderer.create(
      <FormConnect form={form} whenModel={['password']} whenForm={['a', 'b']}>{mockFn}</FormConnect>,
    );

    mockFn.mockClear();
    form.setAttribute('password', 'Paul');
    form.setStateValue('a', 'a');
    form.setStateValue('b', 'b');
    form.setStateValue('c', 'c');
    form.setStateValue('d', 'd');

    expect(mockFn).toHaveBeenCalledTimes(3);

    mockFn.mockClear();
    form.setAttribute('password', 'abc');
    form.setAttribute('password', 'bvs');
    await form.validate();
    await new Promise(resolve => setTimeout(resolve, FormConnect.TICK));

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('debounce prop test 2', async () => {
    const form = new TestForm();

    const mockFn = jest.fn(f => <span>{f.getFirstError() && f.getFirstError().state}</span>);

    renderer.create(
      <FormConnect form={form} whenModel={['password', 'name']}>{mockFn}</FormConnect>,
    );

    mockFn.mockClear();
    form.setAttribute('password', 'Paul');
    await form.validate();

    await new Promise(resolve => setTimeout(resolve, FormConnect.TICK));
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('componentWillReceiveProps test', async () => {
    const wrapper = shallow(<FormConnect
      form={new TestForm()}
      whenModel={['foo', 'bar']}
    >
      {() => false}
    </FormConnect>);

    const mockFn2 = jest.spyOn(wrapper.instance(), 'connect');

    wrapper.setProps({ unknown: 'value' });
    wrapper.setProps({ whenModel: ['foo', 'bar'] });
    expect(mockFn2).toHaveBeenCalledTimes(0);

    wrapper.setProps({ whenModel: ['foo'] });
    wrapper.setProps({ whenModel: ['foo'] });
    wrapper.setProps({ whenForm: ['foo'] });
    wrapper.setProps({ whenForm: ['foo'] });
    wrapper.setProps({ debounce: 100 });
    wrapper.setProps({ form: new TestForm() });
    expect(mockFn2).toHaveBeenCalledTimes(4);
  });
});
