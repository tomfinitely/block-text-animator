<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$prefix = $attributes['prefix'] ?? '';
$suffix = $attributes['suffix'] ?? '';
$animation_type = $attributes['animationType'] ?? 'typewriter';
$animation_duration = $attributes['animationDuration'] ?? 1000;
$display_duration = $attributes['displayDuration'] ?? 2000;
$layout = $attributes['layout'] ?? 'row';

// Extract text strings from inner blocks
$text_strings = array();

if ( ! empty( $content ) ) {
	// Parse the saved content to extract text
	$dom = new DOMDocument();
	$dom->loadHTML( '<div>' . $content . '</div>', LIBXML_HTML_NOIMPLIED );
	
	// Look for spans with the text-animator-item__content class
	$xpath = new DOMXPath( $dom );
	$text_elements = $xpath->query( '//span[@class="text-animator-item__content"]' );
	
	foreach ( $text_elements as $element ) {
		$text_content = trim( $element->textContent );
		if ( ! empty( $text_content ) ) {
			$text_strings[] = $text_content;
		}
	}
	
	// Fallback: if no content elements found, try to extract from any text-animator-item divs
	if ( empty( $text_strings ) ) {
		$item_elements = $xpath->query( '//div[contains(@class, "text-animator-item")]' );
		foreach ( $item_elements as $element ) {
			$text_content = trim( wp_strip_all_tags( $element->textContent ) );
			if ( ! empty( $text_content ) ) {
				$text_strings[] = $text_content;
			}
		}
	}
}

// Remove any empty text strings and re-index
$text_strings = array_values( array_filter( $text_strings, function( $text ) {
	return ! empty( trim( $text ) );
} ) );

// Fallback if no text strings found
if ( empty( $text_strings ) ) {
	$text_strings = array( __( 'Add text items in the editor', 'text-animator' ) );
}

// Prepare data attributes for JavaScript
$data_attrs = array(
	'data-text-strings' => esc_attr( wp_json_encode( $text_strings, JSON_UNESCAPED_UNICODE ) ),
	'data-animation-type' => esc_attr( $animation_type ),
	'data-animation-duration' => esc_attr( $animation_duration ),
	'data-display-duration' => esc_attr( $display_duration ),
);

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'text-animator text-animator--' . esc_attr( $animation_type ) . ' text-animator--layout-' . esc_attr( $layout ),
) );

// Combine wrapper attributes with data attributes
foreach ( $data_attrs as $key => $value ) {
	$wrapper_attributes .= ' ' . $key . '="' . $value . '"';
}
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="text-animator__content">
		<?php if ( ! empty( $prefix ) ) : ?>
			<span class="text-animator__prefix"><?php echo esc_html( $prefix ); ?></span>
		<?php endif; ?>
		
		<span class="text-animator__animated-text">
			<?php echo esc_html( $text_strings[0] ?? '' ); ?>
		</span>
		
		<?php if ( ! empty( $suffix ) ) : ?>
			<span class="text-animator__suffix"><?php echo esc_html( $suffix ); ?></span>
		<?php endif; ?>
	</div>
</div>