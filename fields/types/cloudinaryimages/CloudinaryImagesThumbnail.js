import React, { PropTypes } from 'react';
import _defaults from 'lodash/defaults';
import _set from 'lodash/set';
import _get from 'lodash/get';
import { Button } from '../../../admin/client/App/elemental';
import ImageThumbnail from '../../components/ImageThumbnail';

const labelWrapper = {
	display: 'flex',
	flexDirection: 'column',
	margin: '8px 0',
};

const titleInputStyle = {
	margin: '4px 0',
};

const imageStyles = {
	display: 'flex',
	flexDirection: 'column',
	width: '200px',
	marginBottom: '30px',
};

const langs = ['en', 'de', 'it'];

class CloudinaryImagesThumbnail extends React.Component {
	constructor (params) {
		super(params);

		const defaultState = {};

		langs.forEach(lang => {
			_set(defaultState, `${lang}.title`, '');
		});

		this.state = _defaults(_get(this.props, 'value.content', {}), defaultState);
	}

	onTodoChange ({ title, lang }) {
		this.setState({
			[lang]: {
				title,
			},
		});
	}

	render () {
		const {
			isDeleted,
			imageSourceLarge,
			imageSourceSmall,
			inputName,
			isQueued,
			openLightbox,
			shouldRenderActionButton,
			toggleDelete,
			value,
			...props
		} = this.props;
		// render icon feedback for intent
		let mask;
		if (isQueued) mask = 'upload';
		else if (isDeleted) mask = 'remove';

		// action button
		const actionButton = (shouldRenderActionButton && !isQueued) ? (
			<Button variant="link" color={isDeleted ? 'default' : 'cancel'} block onClick={toggleDelete}>
				{isDeleted ? 'Undo' : 'Remove'}
			</Button>
		) : null;

		const labelInput = (!isQueued && !isDeleted && value) ? (
			<div style={labelWrapper}>
				{langs.map((lang, ind) => (
					<input key={ind}
						style={titleInputStyle}
						type="text"
						name={`${inputName}-titles-${lang}`}
						value={this.state[lang].title}
						placeholder={`Title [${lang}]`}
						onChange={e => this.onTodoChange({ title: e.target.value, lang })}/>
				))}
			</div>
		) : null;

		const input = (!isQueued && !isDeleted && value) ? (
			<input type="hidden" name={inputName} value={JSON.stringify(value)}/>
		) : null;

		return (
			<div style={imageStyles}>
				<ImageThumbnail
					component={imageSourceLarge ? 'a' : 'span'}
					href={!!imageSourceLarge && imageSourceLarge}
					onClick={!!imageSourceLarge && openLightbox}
					mask={mask}
					target={!!imageSourceLarge && '__blank'}
				>
					<img src={imageSourceSmall} style={{ maxWidth: '100%', maxHeight: '100%' }}/>
				</ImageThumbnail>
				{labelInput}
				{actionButton}
				{input}
			</div>
		);

	}
}

CloudinaryImagesThumbnail.propTypes = {
	imageSourceLarge: PropTypes.string,
	imageSourceSmall: PropTypes.string.isRequired,
	isDeleted: PropTypes.bool,
	isQueued: PropTypes.bool,
	openLightbox: PropTypes.func.isRequired,
	shouldRenderActionButton: PropTypes.bool,
	toggleDelete: PropTypes.func.isRequired,
};

module.exports = CloudinaryImagesThumbnail;
