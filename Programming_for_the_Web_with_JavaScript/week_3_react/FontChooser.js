class FontChooser extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isEditMode: false,
			isBold: JSON.parse(props.bold),
			fontSize: this.getInitialFontSize()
		};
	}

	getInitialFontSize() {
		var initialSize = parseInt(this.props.size);

		if (initialSize < this.props.min) {
			return this.getMinFontSize();
		} else if (initialSize > this.props.max) {
			return this.getMaxFontSize()
		}

		return initialSize;
	}

	getMinFontSize() {
		if (this.props.min <= 0) {
			return 1;
		}

		return this.props.min;
	}

	getMaxFontSize() {
		if (parseInt(this.props.min) > parseInt(this.props.max)) {
			return this.getMinFontSize();
		}

		return this.props.max;
	}

	handleEditModeEvent(e) {
		console.log('Calling eventHandler handleEditModeEvent');
		this.setState({ isEditMode: !this.state.isEditMode });

	}

	handleBoldEvent(e) {
		console.log('Event target:', e.target);
		this.setState({ isBold: !this.state.isBold });
	}

	handleFontSizeEvent(e) {
		console.log('Event target:', e.target);
		console.log('Old size:', this.state.fontSize);
		var newSize = e.target.id === 'increaseButton' ? this.state.fontSize + 1 : this.state.fontSize - 1;

		console.log('New size before validation:', newSize);

		if (newSize < this.getMinFontSize()) {
			newSize = this.getMinFontSize();
		} else if (newSize > this.getMaxFontSize()) {
			newSize = this.getMaxFontSize();
		}

		console.log('New size:', newSize);

		this.setState({ fontSize: parseInt(newSize) });
	}

	handleResetFontSizeEvent(e) {
		console.log('Reset font size to size: ', this.props.size);
		this.setState({ fontSize: this.getInitialFontSize()});
	}

	hasFontSizeReachedLimits() {
		var fontSize = this.state.fontSize;
		return fontSize == this.getMinFontSize() || fontSize == this.getMaxFontSize();
	}

	render() {

		console.log('Properties:', this.props);
		console.log('State:', this.state);
		var textStyle = {
			fontWeight: this.state.isBold ? 'bold' : 'normal',
			fontSize: this.state.fontSize
		};

		var fontSizeStyle = {
			color: this.hasFontSizeReachedLimits() ? 'red' : 'black'
		};

		return (
			<div>
				<input type="checkbox" id="boldCheckbox" onChange={this.handleBoldEvent.bind(this)} checked={this.state.isBold} hidden={!this.state.isEditMode} />
				<button id="decreaseButton" onClick={this.handleFontSizeEvent.bind(this)} hidden={!this.state.isEditMode}>-</button>
				<span id="fontSizeSpan" style={fontSizeStyle} onDoubleClick={this.handleResetFontSizeEvent.bind(this)} hidden={!this.state.isEditMode}>{this.state.fontSize}</span>
				<button id="increaseButton" onClick={this.handleFontSizeEvent.bind(this)} hidden={!this.state.isEditMode}>+</button>
				<span id="textSpan" style={textStyle} onClick={this.handleEditModeEvent.bind(this)}>{this.props.text}</span>
			</div>
		);
	}
}

