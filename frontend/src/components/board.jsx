import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { Box } from './board-box'

import * as utils from '../utils/functions'

export class Board extends React.Component {
	constructor(props) {
    super(props)

		this.state = {
			boxes: Array(9).fill(null),
			history: [],
			playerOneName: this.props.state.playerOneName,
			playerTwoName: this.props.state.playerTwoName,
			xIsNext: true
		}
	}

	handleBoxClick(index) {
		const boxes = this.state.boxes.slice()

		let history = this.state.history

		if (utils.findWinner(boxes) || boxes[index]) {
			return
		}

		if(utils.areAllBoxesClicked(boxes) === true) {
			return
		}

		boxes[index] = this.state.xIsNext ? 'x' : 'o'

		history.push(this.state.xIsNext ? this.state.playerOneName : this.state.playerTwoName)

    this.setState({
			boxes: boxes,
			history: history,
			xIsNext: !this.state.xIsNext
		})
	}

	handleBoardRestart = () => {
		this.setState({
			boxes: Array(9).fill(null),
			history: [],
			xIsNext: true
		})
	}

	render() {
    const winner = utils.findWinner(this.state.boxes)
    const isFilled = utils.areAllBoxesClicked(this.state.boxes)

    let status

		if (winner) {
			status = `The winner is: ${winner === 'x' ? this.state.playerOneName : this.state.playerTwoName}!`

			axios.post('http://localhost:8000/api/historys/', {title: `${winner === 'x' ? this.state.playerOneName : this.state.playerTwoName} won`, text: ''})
		} else if(!winner && isFilled) {
			status = 'Game drawn!'

			axios.post('http://localhost:8000/api/historys/', {title: `${'Game drawn'}`, text: ''})
		} else {
			status = `It is ${(this.state.xIsNext ? this.state.playerOneName : this.state.playerTwoName)}'s turn.`
		}

		return (
			<div className="view view--board">
				<Link to="/" className="board-back-link">Go back to scoreboard</Link>

				<div className="board-wrapper">
					<div className="board">
						<h2 className="board-heading">{status}</h2>

						<div className="board-row">
							<Box value={this.state.boxes[0]} onClick={() => this.handleBoxClick(0)} />

							<Box value={this.state.boxes[1]} onClick={() => this.handleBoxClick(1)} />

							<Box value={this.state.boxes[2]} onClick={() => this.handleBoxClick(2)} />
						</div>

						<div className="board-row">
							<Box value={this.state.boxes[3]} onClick={() => this.handleBoxClick(3)} />

							<Box value={this.state.boxes[4]} onClick={() => this.handleBoxClick(4)} />

							<Box value={this.state.boxes[5]} onClick={() => this.handleBoxClick(5)} />
						</div>

						<div className="board-row">
							<Box value={this.state.boxes[6]} onClick={() => this.handleBoxClick(6)} />

							<Box value={this.state.boxes[7]} onClick={() => this.handleBoxClick(7)} />

							<Box value={this.state.boxes[8]} onClick={() => this.handleBoxClick(8)} />
						</div>
					</div>

					<div className="board-history">
						<h2 className="board-heading">Moves history:</h2>

						<ul className="board-history-list">
							{this.state.history.length === 0 && <span>No moves to show.</span>}

							{this.state.history.length !== 0 && this.state.history.map((move, index) => {
								return <li key={index}>Move {index + 1}: <strong>{move}</strong></li>
							})}
						</ul>
					</div>

					{winner && <button className="board__btn btn" onClick={this.handleBoardRestart}>Start new game</button>}
				</div>
			</div>
		)
	}
}
