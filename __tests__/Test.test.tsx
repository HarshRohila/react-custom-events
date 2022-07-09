/**
 * @jest-environment jsdom
 */

import React, { useState } from 'react'
import { emitCustomEvent, newEventEmitter, useCustomEventListener } from '../src/index'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type TestProps = {}

const Test = ({}: TestProps) => {
	const [data, setData] = useState('')

	useCustomEventListener<string>('test-event', (data) => {
		setData(data)
	})

	const listener = useCustomEventListener<string>('hello', (data) => {
		setData(data)
	})

	const handleIncrement = () => {
		emitCustomEvent('test-event', 'test-data')
	}

	return (
		<>
			<div ref={listener}>
				<div data-testid="data">{data}</div>
				<button data-testid="button" onClick={handleIncrement}>
					Fire Event with data
				</button>
				<TestChild />
			</div>
		</>
	)
}

const TestChild = () => {
	const emitter = newEventEmitter()

	const fireHello = () => {
		emitter.emit('hello', 'data from hello')
	}

	return (
		<button data-testid="fire-hello" ref={emitter} onClick={fireHello}>
			Fire Hello
		</button>
	)
}

describe('Test Component', () => {
	let data: any

	beforeEach(() => {
		render(<Test />)
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

	it('sets data fire-hello button click', () => {
		const button = screen.getByTestId('fire-hello')
		userEvent.click(button)

		expect(data.textContent).toBe('data from hello')
	})
})
