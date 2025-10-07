import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

/**
 * Edit component for text animator items
 */
export default function EditItem({ attributes, setAttributes, context }) {
	const { text } = attributes;
	const layout = context['textAnimator/layout'] || 'row';
	const richTextRef = useRef();

	const blockProps = useBlockProps({
		className: `text-animator-item text-animator-item--${layout}`
	});

	// Auto-focus when text is empty (new block)
	useEffect(() => {
		if (!text || text.trim() === '') {
			// Small delay to ensure the block is fully rendered
			setTimeout(() => {
				if (richTextRef.current) {
					richTextRef.current.focus();
				}
			}, 100);
		}
	}, []);

	return (
		<div {...blockProps}>
			<RichText
				ref={richTextRef}
				tagName="span"
				value={text}
				onChange={(value) => setAttributes({ text: value })}
				placeholder={__('Enter animated text...', 'text-animator')}
				className="text-animator-item__text"
				allowedFormats={[]} // Plain text only
				onSplit={(value) => {
					// Handle Enter key - create new block
					if (!value) {
						return createBlock('telex/text-animator-item', { text: '' });
					}
					return createBlock('telex/text-animator-item', { text: value });
				}}
				onReplace={(blocks) => {
					return blocks;
				}}
				onRemove={() => null} // Allow removal
				multiline={false}
				identifier="text"
				aria-label={__('Animation text', 'text-animator')}
			/>
		</div>
	);
}