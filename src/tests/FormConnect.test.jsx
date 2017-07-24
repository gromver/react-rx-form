import React from 'react';
import renderer from 'react-test-renderer';
import FormConnect from '../FormConnect';
import TestForm from './forms/TestForm';

describe('Test FormConnect', () => {
  test('FormConnect with no when... props', async () => {
    const form = new TestForm();

    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    const component = renderer.create(
      <FormConnect form={form} whenForm debounce={0}>{mockFn}</FormConnect>
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

    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    const component = renderer.create(
      <FormConnect form={form} whenForm={['a', 'b']} debounce={0}>{mockFn}</FormConnect>
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

    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    renderer.create(
      <FormConnect form={form} whenModel={['password']} debounce={0}>{mockFn}</FormConnect>
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

    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    renderer.create(
      <FormConnect form={form} whenModel={['password']} whenForm={['a', 'b']} debounce={0}>{mockFn}</FormConnect>
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

    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    renderer.create(
      <FormConnect form={form} whenModel={['password']} whenForm={['a', 'b']}>{mockFn}</FormConnect>
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

    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    renderer.create(
      <FormConnect form={form} whenModel={['password', 'name']}>{mockFn}</FormConnect>
    );

    mockFn.mockClear();
    form.setAttribute('password', 'Paul');
    await form.validate();

    await new Promise(resolve => setTimeout(resolve, FormConnect.TICK));
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('componentWillReceiveProps test', async () => {
    const mockFn = jest.fn((f) => {
      return <span>{f.getFirstError() && f.getFirstError().state}</span>;
    });

    const Wrapper = React.createClass({
      getInitialState() {
        return {
          whenModel: ['password', 'name'],
          form: new TestForm(),
        };
      },
      componentDidMount() {
        this.setState({
          form: new TestForm(),
        }, () => this.setState({
          whenModel: ['password', 'name'],
        }, () => this.setState({
          form: this.state.form,
        }, () => this.setState({
          form: new TestForm(),
        }, () => this.setState({
          form: this.state.form,
        })))));
      },

      render() {
        const { whenModel, form } = this.state;
        return <FormConnect form={form} whenModel={whenModel}>{mockFn}</FormConnect>
      },
    });

    renderer.create(<Wrapper />);

    expect(mockFn).toHaveBeenCalledTimes(4);
  });
});
