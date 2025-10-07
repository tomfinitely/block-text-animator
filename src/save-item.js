import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Save component for text animator items
 * This ensures the text content is properly saved to the database
 */
export default function SaveItem({ attributes }) {
	const { text } = attributes;
	
	const blockProps = useBlockProps.save({
		className: 'text-animator-item'
	});

	return (
		<div {...blockProps}>
			<RichText.Content 
				tagName="span"
				className="text-animator-item__content"
				value={text || ''}
			/>
		</div>
	);
}