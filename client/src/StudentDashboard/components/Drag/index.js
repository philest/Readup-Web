import React, { Component } from "react";
import PropTypes from "prop-types";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./styles.css";
import ForwardArrowButton from "../ForwardArrowButton";
import BackArrowButton from "../BackArrowButton";
import { ProgressBar } from "react-bootstrap";

import { saveSpellingResponse } from "../../sagas/networkingHelpers";

import SkipPrompt from "../SkipPrompt";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const isLetter = event => {
	return (
		(event.keyCode >= 65 || event.code >= 65) &&
		(event.keyCode <= 90 || event.code <= 90)
	);
};

const getLetter = event => {
	var inp = String.fromCharCode(event.keyCode).toLowerCase();
	return inp;
};

const getItems = (count, version) => {
	let extra;
	extra = version === 3 ? 13 : 0;

	return Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `${alphabet[k + extra]}`,
		content: `${alphabet[k + extra]}`
	}));
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const appendLetter = (list, itemId) => {
	let len = list.length;
	return insertAtIndex(list, itemId, len);
};

const removeLastLetter = list => {
	let len = list.length;
	let newArr = [];

	for (let i = 0; i < len - 1; i++) {
		newArr.push(list[i]);
	}

	return newArr;
};

const insertAtIndex = (list, itemId, index) => {
	let newArr = [];
	for (let i = 0; i < list.length; i++) {
		if (i !== index) {
			newArr.push(list[i]);
		} else {
			newArr.push({
				id: `${itemId}-${Math.random()}`,
				content: `${itemId}`
			});
			newArr.push(list[i]);
		}
	}

	if (list.length === 0 || index === list.length) {
		newArr.push({
			id: `${itemId}-${Math.random()}`,
			content: `${itemId}`
		});
	}

	return newArr;
};

const remove = (list, itemId) => {
	let newArr = [];
	for (let i = 0; i < list.length; i++) {
		if (list[i].id !== itemId) {
			newArr.push(list[i]);
		}
	}
	return newArr;
};

const grid = 8;

const getItemStyle = (draggableStyle, isDragging) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: grid * 2,
	margin: `0 ${grid}px 0 0`,
	width: 50,
	// height: 50 + "px !important",
	fontSize: 50,
	color: isDragging ? "rgb(48, 89, 121)" : "#4a4a4a",
	fontFamily: "Comic Neue Angular",
	// color: white,
	//    fontSize: 30,
	//    background: 'none';

	// change background colour if dragging
	// background: isDragging ? "lightgreen" : "grey",

	// styles we need to apply on draggables
	...draggableStyle,
	height: 40,
	cursor: "pointer"
});

const getListStyle = (isAlphabet, isDraggingOver) => {
	if (isAlphabet) {
		return {
			// background: isDraggingOver ? "grey" : "black",
			// background: isDraggingOver ? "lightblue" : "lightgray",
			padding: grid,
			minWidth: 800,
			minHeight: 70,
			maxWidth: 500,
			minHeight: 70,
			height: 100,
			margin: "0 auto",
			userSelect: "none",
			WebkitUserSelect: "none"
		};
	} else {
		return {
			background: isDraggingOver ? "lightblue" : "white",
			borderRadius: 6,
			padding: grid,
			minWidth: 400,
			height: 100,
			userSelect: "none",
			WebkitUserSelect: "none",
			transition: "all .3s",

			minHeight: 70,

			display: "flex",
			justifyContent: "center",
			alightContent: "center",
			flexFlow: "row"
		};
	}
};

export default class Drag extends React.Component {
	static propTypes = {
		spellingQuestionNumber: PropTypes.number,
		showSpellingBoxIndicator: PropTypes.bool,
		spellingQuestionNumber: PropTypes.number,
		onEnterPressed: PropTypes.func,
		onSpellingInputSet: PropTypes.func,
		spellingInput: PropTypes.string,
		book: PropTypes.object,
		onHearQuestionAgainClicked: PropTypes.func,
		onSkipClicked: PropTypes.func
	};
	static defaultProps = {};

	constructor(props) {
		super(props);
		this.state = {
			items: getItems(0, 1),
			items2: getItems(13, 2),
			items3: getItems(13, 3)
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown);
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.spellingQuestionNumber !==
			nextProps.spellingQuestionNumber // incremented by
		) {
			const spellingGroupLibraryIdx = this.props.book.spellingObj
				.libraryIndex;

			saveSpellingResponse(
				this.getFormValue(),
				this.props.spellingQuestionNumber,
				spellingGroupLibraryIdx
			);

			this.clearForm();
		}
	}

	_handleKeyDown = event => {
		console.log("here we are: ", event);
		if (isLetter(event)) {
			const letter = getLetter(event);

			let itemsHolder = this.state.items;
			itemsHolder = appendLetter(itemsHolder, letter);
			this.setState({ items: itemsHolder });
		} else if (
			event.keyCode === 46 ||
			event.which === 46 ||
			event.key === "Delete" ||
			event.keyCode === 8 ||
			event.which === 8 ||
			event.key === "Backspace"
		) {
			let itemsHolder = this.state.items;
			itemsHolder = removeLastLetter(itemsHolder);
			this.setState({ items: itemsHolder });
		} else if (
			event.which == 13 ||
			event.keyCode == 13 ||
			event.code == "Enter"
		) {
			this.props.onEnterPressed();
		}
	};

	onDragEnd(result) {
		if (!result.destination && result.source.droppableId === "droppable") {
			console.log("here1");

			console.log("this.state.items: ", this.state.items);
			let itemsHolder = this.state.items;

			itemsHolder = remove(itemsHolder, result.draggableId);
			this.setState({ items: itemsHolder });
			return;
		}

		// dropped outside the list
		if (!result.destination) {
			console.log("here2: ", result);
			console.log(
				"result.source.droppableId: ",
				result.source.droppableId
			);

			return;
		}

		if (
			result.source.droppableId === "droppable" &&
			(result.destination.droppableId === "droppable2" ||
				result.destination.droppableId === "droppable3")
		) {
			console.log("here2");

			console.log("this.state.items: ", this.state.items);
			let itemsHolder = this.state.items;

			itemsHolder = remove(itemsHolder, result.draggableId);
			this.setState({ items: itemsHolder });
			return;
		}

		console.log("result: ", result);

		if (
			(result.source.droppableId === "droppable2" ||
				result.source.droppableId === "droppable3") &&
			result.destination.droppableId === "droppable"
		) {
			console.log("this.state.items: ", this.state.items);
			let itemsHolder = this.state.items;

			itemsHolder = insertAtIndex(
				itemsHolder,
				result.draggableId,
				result.destination.index
			);

			this.setState({ items: itemsHolder });
		}

		if (
			result.destination.droppableId === "droppable" &&
			result.source.droppableId === "droppable"
		) {
			const items = reorder(
				this.state.items,
				result.source.index,
				result.destination.index
			);

			this.setState({
				items
			});
		}
	}

	getFormValue = () => {
		let formVal = "";
		for (let i = 0; i < this.state.items.length; i++) {
			formVal += this.state.items[i].content;
		}
		return formVal;
	};

	clearForm = () => {
		console.log("clearing form...: ", this.getFormValue());
		this.setState({ items: [] });
	};

	back = () => {
		this.clearForm();
		this.props.onPreviousWordClicked();
	};

	renderRightButton = () => {
		return (
			<ForwardArrowButton
				title="Next"
				style={{
					width: 145,
					height: 120,
					position: "relative",
					left: 15,
					top: -5
				}}
				onClick={this.props.onNextWordClicked}
			/>
		);
	};

	renderLeftButton = () => {
		return (
			<BackArrowButton
				title="Back"
				style={{
					width: 95,
					height: 75,
					float: "right",
					position: "relative",
					right: 15,
					top: 15,
					visibility:
						this.props.spellingQuestionNumber <= 1
							? "hidden"
							: "visible"
				}}
				onClick={this.back}
			/>
		);
	};

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className={styles.mainContainer}>
					<div
						onClick={this.props.onHearQuestionAgainClicked}
						className={[styles.introVolume, styles.clickable].join(
							" "
						)}
					>
						<br />
						<i
							className={[
								"fa fa-volume-up fa-3x",
								styles.volumeIcon
							].join(" ")}
							style={{ color: "white" }}
							aria-hidden="true"
						/>
						<h4 className={styles.volumeLabel}>Hear again</h4>
					</div>
					<SkipPrompt
						topOffset={-10}
						nextSection={"end"}
						dragSpelling
						onSkipClicked={this.props.onSkipClicked}
					/>

					<div className={styles.flexContainer}>
						{this.renderLeftButton()}
						<Droppable
							droppableId="droppable"
							direction="horizontal"
						>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									style={getListStyle(
										false,
										snapshot.isDraggingOver
									)}
								>
									{this.state.items.map(item => (
										<Draggable
											key={item.id}
											draggableId={item.id}
										>
											{(provided, snapshot) => (
												<div
													style={{
														display: "inline-block"
													}}
												>
													<div
														ref={provided.innerRef}
														style={getItemStyle(
															provided.draggableStyle,
															snapshot.isDragging
														)}
														{...provided.dragHandleProps}
													>
														{item.content}
													</div>
													{provided.placeholder}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						{this.renderRightButton()}
					</div>

					<div className={styles.progress}>
						<ProgressBar now={this.props.progressNum} />
					</div>

					<div className={styles.spellingLetterBox}>
						<Droppable
							droppableId="droppable2"
							direction="horizontal"
						>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									style={getListStyle(
										true,
										snapshot.isDraggingOver
									)}
								>
									{this.state.items2.map(item => (
										<Draggable
											key={item.id}
											draggableId={item.id}
										>
											{(provided, snapshot) => (
												<div
													style={{
														display: "inline-block"
													}}
												>
													<div
														ref={provided.innerRef}
														style={getItemStyle(
															provided.draggableStyle,
															snapshot.isDragging
														)}
														{...provided.dragHandleProps}
													>
														{item.content}
													</div>
													{provided.placeholder}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>

						<div />
						<br />

						<Droppable
							droppableId="droppable3"
							direction="horizontal"
						>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									style={getListStyle(
										true,
										snapshot.isDraggingOver
									)}
								>
									{this.state.items3.map(item => (
										<Draggable
											key={item.id}
											draggableId={item.id}
										>
											{(provided, snapshot) => (
												<div
													style={{
														display: "inline-block"
													}}
												>
													<div
														ref={provided.innerRef}
														style={getItemStyle(
															provided.draggableStyle,
															snapshot.isDragging
														)}
														{...provided.dragHandleProps}
													>
														{item.content}
													</div>
													{provided.placeholder}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</div>
			</DragDropContext>
		);
	}
}
