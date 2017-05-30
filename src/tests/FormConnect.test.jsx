import React from 'react';
import renderer from 'react-test-renderer';
import { Form } from 'rx-form';
import FormConnect from '../FormConnect';
import TestModel from './models/TestModel';

describe('Test FormConnect', () => {
  test('FormConnect with no when... props', async () => {
    const form = new Form(new TestModel());

    const mockFn = jest.fn((f) => {
      return <span>{f.getModel().getFirstError() && f.getModel().getFirstError().state}</span>;
    });

    const component = renderer.create(<FormConnect form={form}>{mockFn}</FormConnect>);

    form.setAttribute('name', 'a');
    form.set('foo', 'bar');
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    await form.validateAttributes('name');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    form.set('a', 'a');
    form.set('b', 'b');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    form.setAttribute('password', 'abc');
    await form.validateAttributes('password');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(component).toMatchSnapshot();
  });

  test('FormConnect with whenForm prop', async () => {
    const form = new Form(new TestModel());

    const mockFn = jest.fn((f) => {
      return <span>{f.getModel().getFirstError() && f.getModel().getFirstError().state}</span>;
    });

    const component = renderer.create(<FormConnect form={form} whenForm={['a', 'b']}>{mockFn}</FormConnect>);

    mockFn.mockClear();
    form.setAttribute('name', 'a');
    form.set('a', 'a');
    form.set('b', 'b');
    form.set('c', 'c');
    form.set('d', 'd');
    form.set('e', 'e');
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(component).toMatchSnapshot();

    mockFn.mockClear();
    form.setAttribute('password', 'abc');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(component).toMatchSnapshot();
  });

  test('FormConnect with whenModel prop', async () => {
    const form = new Form(new TestModel());

    const mockFn = jest.fn((f) => {
      return <span>{f.getModel().getFirstError() && f.getModel().getFirstError().state}</span>;
    });

    renderer.create(<FormConnect form={form} whenModel={['password']}>{mockFn}</FormConnect>);

    mockFn.mockClear();
    form.setAttribute('name', 'Paul');
    form.set('a', 'a');
    form.set('b', 'b');
    expect(mockFn).toHaveBeenCalledTimes(2);

    mockFn.mockClear();
    form.setAttribute('name', 'John');
    form.setAttribute('password', 'abc');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('FormConnect with whenModel and whenForm prop', async () => {
    const form = new Form(new TestModel());

    const mockFn = jest.fn((f) => {
      return <span>{f.getModel().getFirstError() && f.getModel().getFirstError().state}</span>;
    });

    renderer.create(<FormConnect form={form} whenModel={['password']} whenForm={['a', 'b']}>{mockFn}</FormConnect>);

    mockFn.mockClear();
    form.setAttribute('name', 'Paul');
    form.set('a', 'a');
    form.set('b', 'b');
    form.set('c', 'c');
    form.set('d', 'd');
    expect(mockFn).toHaveBeenCalledTimes(2);

    mockFn.mockClear();
    form.setAttribute('name', 'John');
    form.setAttribute('password', 'abc');
    form.set('b', 'b');
    form.set('c', 'c');
    form.set('d', 'd');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
