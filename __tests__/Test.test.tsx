/**
 * @jest-environment jsdom
 */

import React, { useState } from 'react';
import { emitCustomEvent, useCustomEventListener } from '../src/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

type TestProps = {}

const Test = ({}: TestProps) => {
	const [data, setData] = useState('');

	useCustomEventListener<string>('test-event', data => {
		setData(data);
	})

	const handleIncrement = () => {
		emitCustomEvent('test-event', 'test-data')
	}

	return (
		<>
			<div data-testid='data'>{data}</div>
			<button data-testid='button' onClick={handleIncrement}>Fire Event with data</button> 
		</>
	);
};

describe('Test Component', () => {

	let data: any

	beforeEach(() => {
		render(<Test />);
		data = screen.getByTestId('data')
	})

	it('renders data as empty string', () => {
		expect(data.textContent).toBe('')
	})

	it('sets data to test-data on button click', () => {
		const button = screen.getByTestId('button')

		userEvent.click(button)

		expect(data.textContent).toBe('test-data')
	})
})
