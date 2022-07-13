/**
 * @jest-environment jsdom
 */

import React, { useState } from 'react'
import { emitCustomEvent, newCustomEventEmitter, useCustomEventListener } from '../src/index'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type TestProps = {}

const Test = ({}: TestProps) => {
	const [data, setData] = useState('')

	const listener = useCustomEventListener<string>('hello', (data) => {
		setData(data)
	})

	useCustomEventListener<string>('test-event', (data) => {
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
	const emitter = newCustomEventEmitter()

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

	it('sets data on fire-hello button click', () => {
		const button = screen.getByTestId('fire-hello')

		userEvent.click(button)

		expect(data.textContent).toBe('data from hello')
	})
})

describe('useCustomEventListener', () => {
	interface TestComponentProps {
		evenFired: (text: string) => void
	}

	const TestComponent = ({ evenFired }: TestComponentProps) => {
		const [text, setText] = useState('initial')

		useCustomEventListener(
			'eventFired',
			() => {
				evenFired(text)
			},
			[text]
		)

		const handleStateChange = () => setText('changed')

		const handleEventFire = () => emitCustomEvent('eventFired')

		return (
			<>
				<button data-testid="state-changer" onClick={handleStateChange}>
					Change State
				</button>
				<button data-testid="fire-event-btn" onClick={handleEventFire}>
					Fire Event with data
				</button>
			</>
		)
	}
	test('its callback having latest state', (done) => {
		render(
			<TestComponent
				evenFired={(text: string) => {
					try {
						expect(text).toBe('changed')
						done()
					} catch (cause) {
						done(cause)
					}
				}}
			/>
		)

		const stateChangerBtn = screen.getByTestId('state-changer')
		userEvent.click(stateChangerBtn)

		const fireBtn = screen.getByTestId('fire-event-btn')
		userEvent.click(fireBtn)
	})
})
