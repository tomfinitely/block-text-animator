/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import EditItem from './edit-item';
import SaveItem from './save-item';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save: Save,
} );

/**
 * Register the text animator item block
 */
registerBlockType( 'telex/text-animator-item', {
	title: 'Text Animation Item',
	category: 'text',
	icon: 'editor-textcolor',
	description: 'Individual text item for the Text Animator block.',
	parent: ['telex/block-text-animator'],
	attributes: {
		text: {
			type: 'string',
			default: '',
		}
	},
	usesContext: [
		'textAnimator/animationType',
		'textAnimator/layout'
	],
	supports: {
		html: false,
		inserter: false,
		reusable: false,
		lock: false
	},
	edit: EditItem,
	save: SaveItem,
} );