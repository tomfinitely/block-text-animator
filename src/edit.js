/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InspectorControls,
	InnerBlocks,
	useInnerBlocksProps,
	store as blockEditorStore
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
	Button
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const ALLOWED_BLOCKS = ['telex/text-animator-item'];

const TEMPLATE = [
	['telex/text-animator-item', { text: 'Your text here' }],
	['telex/text-animator-item', { text: 'Add more text' }],
	['telex/text-animator-item', { text: 'For animation' }]
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const { 
		prefix, 
		suffix, 
		animationType, 
		animationDuration, 
		displayDuration,
		layout
	} = attributes;

	const [currentIndex, setCurrentIndex] = useState(0);
	const [displayText, setDisplayText] = useState('');

	// Get inner blocks to extract text strings
	const { innerBlocks, hasInnerBlocks } = useSelect(
		(select) => ({
			innerBlocks: select(blockEditorStore).getBlocks(clientId),
			hasInnerBlocks: select(blockEditorStore).getBlocks(clientId).length > 0,
		}),
		[clientId]
	);

	const { insertBlock } = useDispatch(blockEditorStore);

	const textStrings = innerBlocks.map(block => block.attributes.text || '').filter(text => text.trim());

	const blockProps = useBlockProps({
		ClassName: `text-animator text-animator--${animationType} text-animator--layout-${layout}`
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `text-animator__items text-animator__items--${layout}`
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			templateInsertUpdatesSelection: false,
			orientation: layout === 'column' ? 'vertical' : 'horizontal',
			renderAppender: false, // We'll render our own appender
		}
	);

	// Simple preview animation for editor
	useEffect(() => {
		if (textStrings.length === 0) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % textStrings.length);
		}, displayDuration + animationDuration);

		return () => clearInterval(interval);
	}, [textStrings, displayDuration, animationDuration]);

	// Update display text based on current index
	useEffect(() => {
		if (textStrings[currentIndex]) {
			setDisplayText(textStrings[currentIndex]);
		}
	}, [currentIndex, textStrings]);

	const animationOptions = [
		{ label: __('Typewriter', 'text-animator'), value: 'typewriter' },
		{ label: __('Matrix Scramble', 'text-animator'), value: 'matrix' },
		{ label: __('Fade', 'text-animator'), value: 'fade' },
		{ label: __('Flash', 'text-animator'), value: 'flash' },
		{ label: __('Burst', 'text-animator'), value: 'burst' },
		{ label: __('Glitch', 'text-animator'), value: 'glitch' }
	];

	const layoutOptions = [
		{ label: __('Row (Horizontal)', 'text-animator'), value: 'row' },
		{ label: __('Column (Vertical)', 'text-animator'), value: 'column' }
	];

	const addNewTextItem = () => {
		const newBlock = createBlock('telex/text-animator-item', {
			text: ''
		});
		insertBlock(newBlock, innerBlocks.length, clientId);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout Settings', 'text-animator')}>
					<SelectControl
						label={__('Layout Direction', 'text-animator')}
						value={layout}
						options={layoutOptions}
						onChange={(value) => setAttributes({ layout: value })}
						help={__('Choose how text items are arranged in the editor.', 'text-animator')}
					/>
				</PanelBody>
				<PanelBody title={__('Animation Settings', 'text-animator')}>
					<SelectControl
						label={__('Animation Type', 'text-animator')}
						value={animationType}
						options={animationOptions}
						onChange={(value) => setAttributes({ animationType: value })}
					/>
					<RangeControl
						label={__('Animation Duration (ms)', 'text-animator')}
						value={animationDuration}
						onChange={(value) => setAttributes({ animationDuration: value })}
						min={200}
						max={3000}
						step={100}
					/>
					<RangeControl
						label={__('Display Duration (ms)', 'text-animator')}
						value={displayDuration}
						onChange={(value) => setAttributes({ displayDuration: value })}
						min={500}
						max={5000}
						step={100}
					/>
				</PanelBody>
				<PanelBody title={__('Text Settings', 'text-animator')}>
					<TextControl
						label={__('Prefix Text', 'text-animator')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder={__('Text before animation...', 'text-animator')}
					/>
					<TextControl
						label={__('Suffix Text', 'text-animator')}
						value={suffix}
						onChange={(value) => setAttributes({ suffix: value })}
						placeholder={__('Text after animation...', 'text-animator')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="text-animator__editor-preview">
					<div className="text-animator__content">
						{prefix && (
							<span className="text-animator__prefix">{prefix}</span>
						)}
						<span className="text-animator__animated-text text-animator__preview-text">
							{displayText || (textStrings.length > 0 ? textStrings[0] : __('Add text items below', 'text-animator'))}
						</span>
						{suffix && (
							<span className="text-animator__suffix">{suffix}</span>
						)}
					</div>
					<div className="text-animator__help">
						<small>
							{__('Preview shows current animation. Edit text items below:', 'text-animator')}
						</small>
					</div>
				</div>

				<div className="text-animator__editor-content">
					<div {...innerBlocksProps} />
					
					<div className="text-animator__appender">
						<Button
							className="text-animator__add-item"
							onClick={addNewTextItem}
							variant="secondary"
							title={__('Add animation text', 'text-animator')}
						>
							+ {__('Add Text', 'text-animator')}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}