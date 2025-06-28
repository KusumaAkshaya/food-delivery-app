/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
        config.font_names =
            'Arial/Arial, Helvetica, sans-serif;' +
            'Comic Sans MS/Comic Sans MS, cursive;' +
            'Courier New/Courier New, Courier, monospace;' +
            'Georgia/Georgia, serif;' +
            'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
            'Tahoma/Tahoma, Geneva, sans-serif;' +
            'Times New Roman/Times New Roman, Times, serif;' +
            'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
            'Calibri/Calibri, Verdana, Geneva, sans-serif;' + /* here is your font */
            'Verdana/Verdana, Geneva, sans-serif';
            
            config.line_height="1em;1.1em;1.2em;1.3em;1.4em;1.5em" ;
            config.font_defaultLabel = 'Calibri';
            config.fontSize_defaultLabel = '10';
            config.removeButtons = 'Language,NewPage,Cut,Copy,Paste,PasteFromWord,PasteText,SpellChecker,Scayt,SelectAll,Link,Unlink,Anchor,Undo,Redo,CreateDiv,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,BGColor';
            config.removePlugins = 'resize,autogrow,find,replace,preview,sourcearea,templates,newPage,print,save,indent,indentlist,indentblock,list,blocks,justify,forms,bidi,blockquote,about';
            config.height = 100;
            config.width = 500;
            CKEDITOR.config.fullPage = false;
            CKEDITOR.config.resize_enabled = false;
            
};

