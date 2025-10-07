import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function Save({ attributes }) {
	const { 
		prefix, 
		suffix, 
		animationType, 
		animationDuration, 
		displayDuration,
		layout
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `text-animator text-animator--${animationType} text-animator--layout-${layout}`,
		'data-animation-type': animationType,
		'data-animation-duration': animationDuration,
		'data-display-duration': displayDuration
	});

	return (
		<div {...blockProps}>
			<div className="text-animator__content">
				{prefix && (
					<span className="text-animator__prefix">{prefix}</span>
				)}
				<div className={`text-animator__items text-animator__items--${layout}`}>
					<InnerBlocks.Content />
				</div>
				{suffix && (
					<span className="text-animator__suffix">{suffix}</span>
				)}
			</div>
		</div>
	);
}